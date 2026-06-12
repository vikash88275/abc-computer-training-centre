/* 
========================================================================
   ABC Computer Training Centre - Interactive Admission Portal
   Developer: Antigravity
========================================================================
*/

const FEES_INDEX = {
  "dca": { name: "DCA (Diploma in Computer Applications)", fee: 7500, duration: "1 Year", category: "1y" },
  "pgdca": { name: "PGDCA (Post Graduate Diploma)", fee: 9500, duration: "1 Year", category: "1y" },
  "adca": { name: "ADCA (Advanced Diploma)", fee: 6500, duration: "6-12 Months", category: "1y" },
  "ccc": { name: "CCC (Course on Computer Concepts)", fee: 2500, duration: "3 Months", category: "3m" },
  "tally": { name: "Tally Prime ERP + GST", fee: 3500, duration: "3 Months", category: "3m" },
  "msoffice": { name: "MS Office (Advanced)", fee: 2000, duration: "3 Months", category: "3m" },
  "typing": { name: "Data Entry & Office Automation", fee: 1500, duration: "3 Months", category: "3m" },
  "programming": { name: "Coding: C, C++, Java, Python", fee: 4500, duration: "3 Months", category: "3m" },
  "basic": { name: "Basic Computer & Internet (2 Months)", fee: 1200, duration: "2 Months", category: "2m" },
  "basic_6m": { name: "Basic Computer & Internet (6 Months)", fee: 2500, duration: "6 Months", category: "6m" }
};

// --- Supabase Config & Initialization ---
const supabaseUrl = 'https://zoonzlmmlheapqentzld.supabase.co';
const supabaseKey = 'sb_publishable_aOXny0qKbF3Z2xrHBFkQSw_XXetTODe';
let supabase = null;

function getSupabase() {
  if (supabase) return supabase;
  if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// Global Supabase Integration Helpers
function mapLeadToSupabase(lead) {
  if (!lead) return null;
  return {
    sno: lead.sno,
    date: lead.date,
    name: lead.name,
    father: lead.father,
    mother: lead.mother,
    dob: lead.dob,
    qualification: lead.qualification,
    address: lead.address,
    aadhar: lead.aadhar,
    paymentstatus: lead.paymentStatus,
    mobile: lead.mobile,
    email: lead.email,
    courseid: lead.courseId,
    coursename: lead.courseName,
    coursecategory: lead.courseCategory,
    totalfee: lead.totalFee,
    paidfee: lead.paidFee,
    duefee: lead.dueFee,
    photo: lead.photo,
    signaturetext: lead.signatureText,
    signatureimg: lead.signatureImg,
    timestamp: lead.timestamp
  };
}

function mapLeadFromSupabase(row) {
  if (!row) return null;
  return {
    sno: row.sno,
    date: row.date,
    name: row.name,
    father: row.father,
    mother: row.mother,
    dob: row.dob,
    qualification: row.qualification,
    address: row.address,
    aadhar: row.aadhar,
    paymentStatus: row.paymentstatus,
    mobile: row.mobile,
    email: row.email,
    courseId: row.courseid,
    courseName: row.coursename,
    courseCategory: row.coursecategory,
    totalFee: row.totalfee,
    paidFee: row.paidfee,
    dueFee: row.duefee,
    photo: row.photo,
    signatureText: row.signaturetext,
    signatureImg: row.signatureimg,
    timestamp: row.timestamp
  };
}

async function saveToSupabase(lead) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const mapped = mapLeadToSupabase(lead);
    const { error } = await sb.from('admissions').upsert(mapped, { onConflict: 'sno' });
    if (error) throw error;
    console.log("Upserted lead to Supabase:", lead.sno);
  } catch (err) {
    console.error("Error upserting lead to Supabase:", err);
  }
}

async function deleteFromSupabase(sno) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const { error } = await sb.from('admissions').delete().eq('sno', sno);
    if (error) throw error;
    console.log("Deleted lead from Supabase:", sno);
  } catch (err) {
    console.error("Error deleting lead from Supabase:", err);
  }
}

// Safe localStorage.setItem with QuotaExceededError handling and image-stripping fallback for abc_leads
function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e && (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014)) {
      if (key === 'abc_leads') {
        console.warn("Local storage quota exceeded for abc_leads. Attempting to save records without photos/signatures.");
        try {
          const leads = JSON.parse(value);
          if (Array.isArray(leads)) {
            const strippedLeads = leads.map(lead => {
              if (!lead) return lead;
              return {
                ...lead,
                photo: '',
                signatureImg: ''
              };
            });
            localStorage.setItem(key, JSON.stringify(strippedLeads));
            console.log("Successfully saved stripped records to local storage.");
            return true;
          }
        } catch (err) {
          console.error("Failed to parse/strip leads for fallback:", err);
        }
      }
      alert('Storage is full! Please clear some old browser data or reduce photo size, then try again.');
    } else {
      console.error('localStorage.setItem failed:', e);
    }
    return false;
  }
}

async function syncFromSupabase(renderCallback) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const { data, error } = await sb.from('admissions').select('*');
    if (error) throw error;
    
    let localLeads = [];
    try {
      localLeads = JSON.parse(localStorage.getItem('abc_leads')) || [];
    } catch (e) {}

    const remoteLeads = (data && Array.isArray(data)) ? data.map(mapLeadFromSupabase) : [];
    let localUpdated = false;
    const merged = [...localLeads];
    
    // Merge remote data into local storage (remote newer dates win)
    remoteLeads.forEach(remoteLead => {
      if (!remoteLead) return;
      const idx = merged.findIndex(l => l && l.sno === remoteLead.sno);
      if (idx !== -1) {
        const remoteTime = remoteLead.timestamp ? new Date(remoteLead.timestamp).getTime() : 0;
        const localTime = merged[idx].timestamp ? new Date(merged[idx].timestamp).getTime() : 0;
        if (remoteTime > localTime) {
          merged[idx] = remoteLead;
          localUpdated = true;
        }
      } else {
        merged.push(remoteLead);
        localUpdated = true;
      }
    });

    if (localUpdated) {
      safeLocalStorageSet('abc_leads', JSON.stringify(merged));
    }

    // Bidirectional upload: Identify local leads missing or newer on remote and push them to Supabase
    for (const localLead of merged) {
      if (!localLead || !localLead.sno) continue;
      const remoteLead = remoteLeads.find(r => r && r.sno === localLead.sno);
      let needsUpload = false;
      if (!remoteLead) {
        needsUpload = true;
      } else {
        const localTime = localLead.timestamp ? new Date(localLead.timestamp).getTime() : 0;
        const remoteTime = remoteLead.timestamp ? new Date(remoteLead.timestamp).getTime() : 0;
        if (localTime > remoteTime) {
          needsUpload = true;
        }
      }
      if (needsUpload) {
        console.log("Uploading local lead to Supabase during sync:", localLead.sno);
        await saveToSupabase(localLead);
      }
    }

    if (typeof renderCallback === 'function') {
      renderCallback();
    }
    console.log("Supabase bidirectional sync completed successfully.");
  } catch (err) {
    console.error("Error syncing leads with Supabase:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Views panels
  const panelSelection = document.getElementById('portal-selection-view');
  const panelCheck = document.getElementById('portal-check-view');
  const panelNew = document.getElementById('portal-new-view');
  const panelReceipt = document.getElementById('portal-receipt-view');
  const panelAdminAuth = document.getElementById('portal-admin-auth-view');
  const panelRecords = document.getElementById('portal-records-view');
  const panelNotes = document.getElementById('portal-notes-view');
 
  // Trigger buttons
  const btnSelectNew = document.getElementById('btn-select-new');
  const btnSelectCheck = document.getElementById('btn-select-check');
  const btnSelectRecords = document.getElementById('btn-select-records');
  const btnSelectNotes = document.getElementById('btn-select-notes');
  const btnBackCheck = document.getElementById('btn-back-check');
  const btnBackNew = document.getElementById('btn-back-new');
  const btnBackAdminAuth = document.getElementById('btn-back-admin-auth');
  const btnBackRecords = document.getElementById('btn-back-records');
  const btnBackNotes = document.getElementById('btn-back-notes');
  const btnAdminLogout = document.getElementById('btn-admin-logout');
  const btnReceiptBack = document.getElementById('btn-receipt-back');
  const btnReceiptPrint = document.getElementById('btn-receipt-print');
  const btnReceiptEdit = document.getElementById('btn-receipt-edit');

  // Admin Auth form and table elements
  const adminAuthForm = document.getElementById('admin-auth-form');
  const adminPasswordInput = document.getElementById('admin-password');
  const adminAuthErrorMsg = document.getElementById('admin-auth-error-msg');
  const recordsSearchInput = document.getElementById('records-search-input');
  const recordsCourseFilter = document.getElementById('records-course-filter');
  const recordsTableBody = document.getElementById('records-table-body');
  const recordsCountBadge = document.getElementById('records-count-badge');

  // Summary widgets
  const summaryTotalText = document.getElementById('admin-summary-total');
  const summaryCollectedText = document.getElementById('admin-summary-collected');
  const summaryDuesText = document.getElementById('admin-summary-dues');

  // Back routing navigation state
  let receiptBackReferrer = panelSelection;
  
  // In-memory admin authentication state (clears on refresh/reload)
  let isAdminAuthenticated = false;

  // Track the S.No of the student record currently being edited
  let editingStudentSno = null;

  // Forms and errors
  const admissionForm = document.getElementById('admission-form');
  const checkForm = document.getElementById('check-form');
  const checkErrorMsg = document.getElementById('check-error-msg');

  // Photo upload elements
  const photoUploadInput = document.getElementById('form-photo-upload');
  const uploadTriggerBtn = document.getElementById('btn-upload-trigger');
  const photoPreviewBox = document.getElementById('photo-preview-box');
  let studentPhotoBase64 = "";

  // Signature canvas drawing elements
  const sigCanvas = document.getElementById('sig-canvas');
  const sigClearBtn = document.getElementById('btn-sig-clear');
  let isDrawing = false;
  let hasDrawn = false;
  let sigCtx = null;

  // Fee calculation elements
  const inputTotalFee = document.getElementById('form-total-fee');
  const inputPaidFee = document.getElementById('form-paid-fee');
  const inputDueFee = document.getElementById('form-due-fee');

  // Helper to switch active panel
  function switchPanel(activePanel) {
    [panelSelection, panelCheck, panelNew, panelReceipt, panelAdminAuth, panelRecords, panelNotes].forEach(panel => {
      if (panel) panel.style.display = 'none';
    });
    if (activePanel) {
      activePanel.style.display = 'block';
      // Smooth scroll to top of portal
      window.scrollTo({
        top: activePanel.offsetTop - 120,
        behavior: 'smooth'
      });
    }
  }

  // Null-safe helper: set textContent only if element exists
  function setElText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val !== undefined && val !== null ? String(val) : '';
  }

  // safeLocalStorageSet pulled to global scope

  // --- Panels Navigation ---
  if (btnSelectNew) {
    btnSelectNew.addEventListener('click', () => {
      // Reset form variables and inputs first (so it doesn't wipe out auto-filled values)
      editingStudentSno = null;
      const formSno = document.getElementById('form-sno');
      if (formSno) formSno.readOnly = true;

      studentPhotoBase64 = "";
      if (photoPreviewBox) photoPreviewBox.innerHTML = '<span>PHOTO PREVIEW</span>';
      if (admissionForm) admissionForm.reset();
      clearSignatureCanvas();

      // Auto generate Serial Number based on max existing + 1
      const formTitle = document.getElementById('admission-form-title');
      if (formTitle) formTitle.textContent = "Online Enrollment Form";

      const nextSno = getNextSerialNumber();
      if (formSno) formSno.value = nextSno;

      // Fill current date in YYYY-MM-DD format for date input
      const formDate = document.getElementById('form-date');
      if (formDate) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        formDate.value = `${yyyy}-${mm}-${dd}`;
      }

      // Update due fee display (reset to 0 since form was just reset)
      calculateDueFee();

      switchPanel(panelNew);
    });
  }

  function getNextSerialNumber() {
    let currentLeads = [];
    try {
      currentLeads = JSON.parse(localStorage.getItem('abc_leads'));
      if (!Array.isArray(currentLeads)) {
        currentLeads = [];
      }
    } catch (e) {
      currentLeads = [];
    }
    let maxNum = 0; // Starting number will be 1
    currentLeads.forEach(lead => {
      if (lead && lead.sno) {
        let numStr = lead.sno.toString();
        if (numStr.startsWith('ABC-2026-')) {
          numStr = numStr.replace('ABC-2026-', '');
        }
        const numPart = parseInt(numStr, 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });
    return 'ABC-2026-' + (maxNum + 1);
  }

  if (btnSelectCheck) {
    btnSelectCheck.addEventListener('click', () => {
      if (checkForm) checkForm.reset();
      if (checkErrorMsg) checkErrorMsg.style.display = 'none';
      switchPanel(panelCheck);
    });
  }

  if (btnBackCheck) btnBackCheck.addEventListener('click', () => switchPanel(panelSelection));
  if (btnBackNew) {
    btnBackNew.addEventListener('click', () => {
      editingStudentSno = null;
      const formSno = document.getElementById('form-sno');
      if (formSno) formSno.readOnly = true;

      if (receiptBackReferrer === panelRecords) {
        switchPanel(panelRecords);
      } else {
        switchPanel(panelSelection);
      }
    });
  }
  if (btnReceiptBack) btnReceiptBack.addEventListener('click', () => switchPanel(receiptBackReferrer));

  if (btnReceiptEdit) {
    btnReceiptEdit.addEventListener('click', () => {
      const sno = document.getElementById('receipt-sno-val').textContent;
      let leads = [];
      try {
        leads = JSON.parse(localStorage.getItem('abc_leads')) || [];
      } catch (err) {
        leads = [];
      }
      const match = leads.find(l => l && String(l.sno) === String(sno));
      if (match) {
        receiptBackReferrer = panelRecords;
        openEditAdmissionForm(match);
      }
    });
  }

  // --- Photo Upload Handling ---
  if (uploadTriggerBtn && photoUploadInput) {
    uploadTriggerBtn.addEventListener('click', () => photoUploadInput.click());
  }

  if (photoUploadInput) {
    photoUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert("Image size should not exceed 2MB.");
          photoUploadInput.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
          studentPhotoBase64 = event.target.result;
          if (photoPreviewBox) {
            photoPreviewBox.innerHTML = `<img src="${studentPhotoBase64}" alt="Student Photo">`;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --- Signature Canvas Pad Logic ---
  // Clear Canvas
  function clearSignatureCanvas() {
    if (sigCtx && sigCanvas) {
      sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
      hasDrawn = false;
    }
  }

  if (sigCanvas) {
    sigCtx = sigCanvas.getContext('2d');
    sigCtx.strokeStyle = '#0f172a';
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';

    if (sigClearBtn) {
      sigClearBtn.addEventListener('click', clearSignatureCanvas);
    }

    // Touch and mouse drawing listeners
    function getCanvasCoordinates(e) {
      const rect = sigCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDrawing(e) {
      isDrawing = true;
      hasDrawn = true;
      const coords = getCanvasCoordinates(e);
      sigCtx.beginPath();
      sigCtx.moveTo(coords.x, coords.y);
      e.preventDefault();
    }

    function draw(e) {
      if (!isDrawing) return;
      const coords = getCanvasCoordinates(e);
      sigCtx.lineTo(coords.x, coords.y);
      sigCtx.stroke();
      e.preventDefault();
    }

    function stopDrawing() {
      isDrawing = false;
    }

    // Mouse events
    sigCanvas.addEventListener('mousedown', startDrawing);
    sigCanvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);

    // Touch events for mobile support
    sigCanvas.addEventListener('touchstart', startDrawing, { passive: false });
    sigCanvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDrawing);
  }

  // --- Dynamic Fee calculation and course listener ---
  const courseRadios = document.getElementsByName('course-choice');
  
  function calculateDueFee() {
    if (inputTotalFee && inputPaidFee && inputDueFee) {
      const total = parseFloat(inputTotalFee.value) || 0;
      const paid = parseFloat(inputPaidFee.value) || 0;
      inputDueFee.value = Math.max(0, total - paid);
    }
  }

  if (inputTotalFee) {
    inputTotalFee.addEventListener('input', calculateDueFee);
  }
  if (inputPaidFee) {
    inputPaidFee.addEventListener('input', calculateDueFee);
  }

  courseRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const courseVal = e.target.value;
      if (FEES_INDEX[courseVal]) {
        if (inputTotalFee) {
          inputTotalFee.value = FEES_INDEX[courseVal].fee;
          calculateDueFee();
        }
      }
    });
  });

  // --- Validation and Submit New Form ---
  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather input values
      const sno = document.getElementById('form-sno').value;
      const date = document.getElementById('form-date').value;
      const name = document.getElementById('form-name').value.trim();
      const father = document.getElementById('form-father').value.trim();
      const mother = document.getElementById('form-mother').value.trim();
      const dob = document.getElementById('form-dob').value;
      const qualification = document.getElementById('form-qualification').value.trim();
      const address = document.getElementById('form-address').value.trim();
      let paymentStatus = "";
      const paymentStatusRadios = document.getElementsByName('form-payment-status');
      paymentStatusRadios.forEach(radio => {
        if (radio.checked) paymentStatus = radio.value;
      });
      const mobile = document.getElementById('form-mobile').value.trim();
      const aadhar = document.getElementById('form-aadhar').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const totalFee = parseFloat(inputTotalFee.value) || 0;
      const paidFee = parseFloat(inputPaidFee.value) || 0;
      const sigText = document.getElementById('form-signature-text').value.trim();

      // Course Selection verification
      let selectedCourseVal = "";
      courseRadios.forEach(radio => {
        if (radio.checked) selectedCourseVal = radio.value;
      });

      // Basic validations
      if (!name || !father || !mother || !dob || !qualification || !address || !paymentStatus) {
        alert("Please fill in all the required fields.");
        return;
      }

      if (!studentPhotoBase64) {
        alert("Please upload a student photo.");
        return;
      }

      // Validations: Mobile (10 digit)
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }

      // Validations: Aadhar (12 digit)
      const aadharRegex = /^\d{12}$/;
      if (!aadharRegex.test(aadhar)) {
        alert("Please enter a valid 12-digit Aadhar Card Number.");
        return;
      }

      // Validations: Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (!selectedCourseVal) {
        alert("Please select a course.");
        return;
      }

      if (totalFee <= 0) {
        alert("Total Fee must be greater than zero.");
        return;
      }

      if (!sigText) {
        alert("Please sign your name in the Student Signature field.");
        return;
      }

      // Prepare signatures
      let signatureImgBase64 = "";
      if (hasDrawn && sigCanvas) {
        signatureImgBase64 = sigCanvas.toDataURL();
      }

      const dueFee = Math.max(0, totalFee - paidFee);

      // Create new lead record
      const newLead = {
        sno,
        date: formatDateDisplay(date),
        name,
        father,
        mother,
        dob: formatDateDisplay(dob),
        qualification,
        address,
        aadhar,
        paymentStatus,
        mobile, // password
        email,
        courseId: selectedCourseVal,
        courseName: FEES_INDEX[selectedCourseVal].name,
        courseCategory: FEES_INDEX[selectedCourseVal].category,
        totalFee,
        paidFee,
        dueFee,
        photo: studentPhotoBase64,
        signatureText: sigText,
        signatureImg: signatureImgBase64,
        timestamp: new Date().toISOString()
      };

      // Save to localStorage with safety checks
      let currentLeads = [];
      try {
        currentLeads = JSON.parse(localStorage.getItem('abc_leads'));
        if (!Array.isArray(currentLeads)) {
          currentLeads = [];
        }
      } catch (e) {
        currentLeads = [];
      }
      
      // Match by original S.No when editing, or the new S.No if not editing
      const searchSno = editingStudentSno || sno;
      const matchIndex = currentLeads.findIndex(lead => lead && lead.sno === searchSno);
      if (matchIndex !== -1) {
        // Update existing record
        currentLeads[matchIndex] = newLead;
      } else {
        // Push new
        currentLeads.push(newLead);
      }
      
      // If photo is too large and storage is full, save without photo as fallback
      const saved = safeLocalStorageSet('abc_leads', JSON.stringify(currentLeads));
      if (!saved) {
        // Fallback: save without embedded photo to avoid quota error
        const leadsNoPhoto = currentLeads.map(l => l && l.sno === newLead.sno ? {...l, photo: ''} : l);
        safeLocalStorageSet('abc_leads', JSON.stringify(leadsNoPhoto));
        newLead.photo = ''; // Still show the receipt but without photo
      }

      // Reset edit state
      editingStudentSno = null;
      const formSno = document.getElementById('form-sno');
      if (formSno) formSno.readOnly = true;

      // Save to Supabase backend database
      saveToSupabase(newLead);

      // Display receipt — always navigate even if storage had issues
      receiptBackReferrer = panelSelection;
      try { populateReceipt(newLead); } catch(err) { console.error('populateReceipt error:', err); }
      switchPanel(panelReceipt);
    });
  }

  // --- Validation and Check Form (Retrieval) ---
  if (checkForm) {
    checkForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const searchName = document.getElementById('check-name').value.trim();
      const searchPassword = document.getElementById('check-password').value.trim(); // date of birth

      if (!searchName || !searchPassword) {
        showCheckError("Please enter both student name and password (date of birth).");
        return;
      }

      const formattedSearchPassword = normalizeDateInput(searchPassword);
      let match = null;
      let isRemote = false;

      const sb = getSupabase();
      if (sb) {
        showCheckError("Searching online records...");
        try {
          const { data, error } = await sb
            .from('admissions')
            .select('*')
            .ilike('name', searchName);
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            const mappedData = data.map(mapLeadFromSupabase);
            match = mappedData.find(lead => {
              if (!lead || !lead.dob) return false;
              const leadDobNormalized = normalizeDateInput(lead.dob);
              return leadDobNormalized === formattedSearchPassword;
            });
            if (match) {
              isRemote = true;
            }
          }
        } catch (err) {
          console.error("Error searching Supabase for check form:", err);
        }
      }

      if (!match) {
        // Fetch leads from local storage as fallback
        let currentLeads = [];
        try {
          currentLeads = JSON.parse(localStorage.getItem('abc_leads'));
          if (!Array.isArray(currentLeads)) {
            currentLeads = [];
          }
        } catch (e) {
          currentLeads = [];
        }
        match = currentLeads.find(lead => {
          if (!lead || !lead.name || !lead.dob) return false;
          const leadName = lead.name.toLowerCase().trim();
          const searchNameLower = searchName.toLowerCase().trim();
          const leadDobNormalized = normalizeDateInput(lead.dob);
          return leadName === searchNameLower && leadDobNormalized === formattedSearchPassword;
        });
      }

      if (match) {
        // Load matched form receipt
        receiptBackReferrer = panelSelection;
        if (checkErrorMsg) checkErrorMsg.style.display = 'none';

        // Cache/update in local storage if we got it from remote
        if (isRemote) {
          try {
            let currentLeads = JSON.parse(localStorage.getItem('abc_leads')) || [];
            const idx = currentLeads.findIndex(l => l && l.sno === match.sno);
            if (idx !== -1) {
              currentLeads[idx] = match;
            } else {
              currentLeads.push(match);
            }
            safeLocalStorageSet('abc_leads', JSON.stringify(currentLeads));
          } catch (e) {
            console.error("Failed to update check form match in local storage:", e);
          }
        }

        try { populateReceipt(match); } catch(err) { console.error('populateReceipt error:', err); }
        switchPanel(panelReceipt);
      } else {
        showCheckError("No records found with this name and password. Please check details or create a new form.");
      }
    });
  }

  function showCheckError(msg) {
    if (checkErrorMsg) {
      checkErrorMsg.textContent = msg;
      checkErrorMsg.style.display = 'block';
    }
  }

  // Date format normalization helper
  function normalizeDateInput(dateStr) {
    if (!dateStr) return "";
    const trimmed = dateStr.trim();
    // Match YYYY-MM-DD or YYYY/MM/DD
    const yyyymmddMatch = trimmed.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
    if (yyyymmddMatch) {
      return `${yyyymmddMatch[3]}/${yyyymmddMatch[2]}/${yyyymmddMatch[1]}`;
    }
    // Match DD-MM-YYYY or DD/MM/YYYY
    const ddmmyyyyMatch = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (ddmmyyyyMatch) {
      return `${ddmmyyyyMatch[1]}/${ddmmyyyyMatch[2]}/${ddmmyyyyMatch[3]}`;
    }
    return trimmed.replace(/-/g, '/');
  }

  // Parse date from DD/MM/YYYY to YYYY-MM-DD for date input pre-filling
  function parseDateToInputFormat(dateStr) {
    if (!dateStr) return "";
    if (dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  }

  // Populate Enrollment Form with student data for editing
  function openEditAdmissionForm(lead) {
    editingStudentSno = lead.sno || "";
    const formSno = document.getElementById('form-sno');
    if (formSno) formSno.readOnly = false;

    studentPhotoBase64 = lead.photo || "";
    if (photoPreviewBox) {
      if (lead.photo) {
        photoPreviewBox.innerHTML = `<img src="${lead.photo}" alt="Preview" style="width:100%; height:100%; object-fit:cover;">`;
      } else {
        photoPreviewBox.innerHTML = '<span>PHOTO PREVIEW</span>';
        const sb = getSupabase();
        if (sb && lead.sno) {
          sb.from('admissions').select('photo').eq('sno', lead.sno).single()
            .then(({ data, error }) => {
              if (!error && data && data.photo) {
                lead.photo = data.photo;
                studentPhotoBase64 = data.photo;
                photoPreviewBox.innerHTML = `<img src="${data.photo}" alt="Preview" style="width:100%; height:100%; object-fit:cover;">`;
              }
            });
        }
      }
    }

    if (admissionForm) admissionForm.reset();
    clearSignatureCanvas();

    const formTitle = document.getElementById('admission-form-title');
    if (formTitle) formTitle.textContent = "Edit Student Enrollment";

    // Pre-fill inputs
    document.getElementById('form-sno').value = lead.sno || "";
    document.getElementById('form-date').value = parseDateToInputFormat(lead.date);
    document.getElementById('form-name').value = lead.name || "";
    document.getElementById('form-father').value = lead.father || "";
    document.getElementById('form-mother').value = lead.mother || "";
    document.getElementById('form-dob').value = parseDateToInputFormat(lead.dob);
    document.getElementById('form-qualification').value = lead.qualification || "";
    document.getElementById('form-address').value = lead.address || "";

    const paymentStatusRadios = document.getElementsByName('form-payment-status');
    paymentStatusRadios.forEach(radio => {
      if (radio.value === lead.paymentStatus) {
        radio.checked = true;
      }
    });

    document.getElementById('form-mobile').value = lead.mobile || "";
    document.getElementById('form-aadhar').value = lead.aadhar || "";
    document.getElementById('form-email').value = lead.email || "";
    inputTotalFee.value = lead.totalFee || 0;
    inputPaidFee.value = lead.paidFee || 0;
    calculateDueFee();

    document.getElementById('form-signature-text').value = lead.signatureText || "";
    if (lead.signatureImg && sigCanvas) {
      const ctx = sigCanvas.getContext('2d');
      const img = new Image();
      img.onload = function() {
        ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
        ctx.drawImage(img, 0, 0);
        hasDrawn = true;
      };
      img.src = lead.signatureImg;
    } else {
      hasDrawn = false;
      const sb = getSupabase();
      if (sb && lead.sno) {
        sb.from('admissions').select('signatureimg').eq('sno', lead.sno).single()
          .then(({ data, error }) => {
            if (!error && data && data.signatureimg) {
              lead.signatureImg = data.signatureimg;
              if (sigCanvas) {
                const ctx = sigCanvas.getContext('2d');
                const img = new Image();
                img.onload = function() {
                  ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
                  ctx.drawImage(img, 0, 0);
                  hasDrawn = true;
                };
                img.src = data.signatureimg;
              }
            }
          });
      }
    }

    courseRadios.forEach(radio => {
      if (radio.value === lead.courseId) {
        radio.checked = true;
      }
    });

    switchPanel(panelNew);
  }

  // Helper date formatter
  function formatDateDisplay(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      // YYYY-MM-DD to DD/MM/YYYY
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  // --- Populate receipt layout ---
  function populateReceipt(lead) {
    // Show/hide Edit Form button depending on whether we came from the Records Portal
    if (btnReceiptEdit) {
      if (isAdminAuthenticated && receiptBackReferrer === panelRecords) {
        btnReceiptEdit.style.display = 'inline-block';
      } else {
        btnReceiptEdit.style.display = 'none';
      }
    }

    // Fill text labels (null-safe)
    setElText('receipt-sno-val', lead.sno);
    setElText('receipt-date-val', lead.date);
    setElText('receipt-name-val', lead.name);
    setElText('receipt-father-val', lead.father);
    setElText('receipt-mother-val', lead.mother);
    setElText('receipt-dob-val', lead.dob);
    setElText('receipt-qualification-val', lead.qualification);
    setElText('receipt-address-val', lead.address);
    
    const receiptAadhar = document.getElementById('receipt-aadhar-val');
    if (receiptAadhar) receiptAadhar.textContent = lead.aadhar || "N/A";
    
    const receiptPaymentStatus = document.getElementById('receipt-payment-status-val');
    if (receiptPaymentStatus) {
      const currentMode = lead.paymentStatus || "";
      const isModeValid = (currentMode === 'Online' || currentMode === 'Offline');

      if (isModeValid) {
        receiptPaymentStatus.textContent = currentMode;
      } else {
        // Render Online/Offline interactive selection buttons that are hidden during print
        receiptPaymentStatus.innerHTML = `
          <span class="payment-mode-text print-only"></span>
          <div class="payment-selector-widget no-print" style="display: inline-flex; gap: 0.5rem; align-items: center;">
            <button type="button" class="btn-mode-select" data-val="Online" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--primary); border-radius: 4px; background: transparent; color: var(--primary); cursor: pointer; font-weight: 600;">Online</button>
            <button type="button" class="btn-mode-select" data-val="Offline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--neutral-gray); border-radius: 4px; background: transparent; color: var(--neutral-gray); cursor: pointer; font-weight: 600;">Offline</button>
          </div>
        `;

        // Attach click handlers to the buttons
        const textSpan = receiptPaymentStatus.querySelector('.payment-mode-text');
        const buttons = receiptPaymentStatus.querySelectorAll('.btn-mode-select');

        buttons.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedVal = btn.getAttribute('data-val');
            
            // Set text for print
            if (textSpan) textSpan.textContent = selectedVal;
            
            // Set text in cell
            receiptPaymentStatus.textContent = selectedVal;
            
            // Update the lead in localStorage
            lead.paymentStatus = selectedVal;
            updateLeadInLocalStorage(lead);
          });
        });
      }
    }
    
    setElText('receipt-mobile-val', lead.mobile);
    setElText('receipt-email-val', lead.email);

    // Fill Image Photo
    const photoTarget = document.getElementById('receipt-photo-target');
    if (photoTarget) {
      if (lead.photo) {
        photoTarget.innerHTML = `<img src="${lead.photo}" alt="Student Photo">`;
      } else {
        photoTarget.innerHTML = '<span>PHOTO</span>';
        const sb = getSupabase();
        if (sb && lead.sno) {
          sb.from('admissions').select('photo').eq('sno', lead.sno).single()
            .then(({ data, error }) => {
              if (!error && data && data.photo) {
                lead.photo = data.photo;
                photoTarget.innerHTML = `<img src="${data.photo}" alt="Student Photo">`;
              }
            });
        }
      }
    }

    // Courses categories display matching physical photo
    const chkVal2m = document.getElementById('chk-val-2m');
    const chkVal3m = document.getElementById('chk-val-3m');
    const chkVal6m = document.getElementById('chk-val-6m');
    const chkVal1y = document.getElementById('chk-val-1y');

    if (chkVal2m) chkVal2m.textContent = "";
    if (chkVal3m) chkVal3m.textContent = "";
    if (chkVal6m) chkVal6m.textContent = "";
    if (chkVal1y) chkVal1y.textContent = "";

    // Set value in appropriate course category line
    if (lead.courseCategory === '2m' && chkVal2m) {
      chkVal2m.textContent = lead.courseName;
    } else if (lead.courseCategory === '3m' && chkVal3m) {
      chkVal3m.textContent = lead.courseName;
    } else if (lead.courseCategory === '6m' && chkVal6m) {
      chkVal6m.textContent = lead.courseName;
    } else if (lead.courseCategory === '1y' && chkVal1y) {
      chkVal1y.textContent = lead.courseName;
    }

    // Fees rows
    const totalFeeNum = lead.totalFee ? Number(lead.totalFee) : 0;
    const dueFeeNum = lead.dueFee ? Number(lead.dueFee) : 0;
    setElText('receipt-total-fee-val', `₹${isNaN(totalFeeNum) ? 0 : totalFeeNum.toLocaleString('en-IN')}/-`);
    setElText('receipt-due-fee-val', `₹${isNaN(dueFeeNum) ? 0 : dueFeeNum.toLocaleString('en-IN')}/-`);

    // Signatures
    const sigTextDisplay = document.getElementById('receipt-sig-text-display');
    const sigImgDisplay = document.getElementById('receipt-sig-image-display');

    if (lead.signatureImg) {
      if (sigImgDisplay) {
        sigImgDisplay.src = lead.signatureImg;
        sigImgDisplay.style.display = 'block';
      }
      if (sigTextDisplay) sigTextDisplay.style.display = 'none';
    } else {
      if (sigImgDisplay) sigImgDisplay.style.display = 'none';
      if (sigTextDisplay) {
        sigTextDisplay.textContent = lead.signatureText;
        sigTextDisplay.style.display = 'block';
      }
      const sb = getSupabase();
      if (sb && lead.sno && (!lead.signatureImg || lead.signatureImg === "")) {
        sb.from('admissions').select('signatureimg').eq('sno', lead.sno).single()
          .then(({ data, error }) => {
            if (!error && data && data.signatureimg) {
              lead.signatureImg = data.signatureimg;
              if (sigImgDisplay) {
                sigImgDisplay.src = data.signatureimg;
                sigImgDisplay.style.display = 'block';
              }
              if (sigTextDisplay) sigTextDisplay.style.display = 'none';
            }
          });
      }
    }

    // Set WhatsApp link
    const whatsappLink = document.getElementById('receipt-whatsapp-link');
    if (whatsappLink) {
      const msg = `Hello Sir, I have submitted my admission form (S.No: ${lead.sno}). Name: ${lead.name}, Course: ${lead.courseName}, Mobile: ${lead.mobile}. Total Fee: \u20B9${lead.totalFee}, Due Fee: \u20B9${lead.dueFee}. Please confirm my enrollment.`;
      whatsappLink.href = `https://wa.me/918827512123?text=${encodeURIComponent(msg)}`;
    }
  }

  // --- Print Handler (Native Print Dialog) ---
  if (btnReceiptPrint) {
    btnReceiptPrint.addEventListener('click', () => {
      document.body.classList.add('print-admission-active');
      window.print();
      document.body.classList.remove('print-admission-active');
    });
  }

  // --- Admin Authentication Logic ---
  if (btnSelectRecords) {
    btnSelectRecords.addEventListener('click', () => {
      if (isAdminAuthenticated) {
        renderRecords();
        switchPanel(panelRecords);
      } else {
        if (adminAuthForm) adminAuthForm.reset();
        if (adminAuthErrorMsg) adminAuthErrorMsg.style.display = 'none';
        switchPanel(panelAdminAuth);
      }
    });
  }

  if (btnBackAdminAuth) btnBackAdminAuth.addEventListener('click', () => switchPanel(panelSelection));
  if (btnBackRecords) {
    btnBackRecords.addEventListener('click', () => {
      isAdminAuthenticated = false;
      switchPanel(panelSelection);
    });
  }

  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', () => {
      isAdminAuthenticated = false;
      switchPanel(panelSelection);
    });
  }

  if (adminAuthForm) {
    adminAuthForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPassword = adminPasswordInput.value;
      if (enteredPassword === '8827512123#') {
        isAdminAuthenticated = true;
        if (adminAuthErrorMsg) adminAuthErrorMsg.style.display = 'none';
        renderRecords();
        switchPanel(panelRecords);
      } else {
        if (adminAuthErrorMsg) {
          adminAuthErrorMsg.textContent = "Incorrect admin password. Please try again.";
          adminAuthErrorMsg.style.display = 'block';
        }
      }
    });
  }

  // --- Records List Management Dashboard ---
  function renderRecords() {
    if (!recordsTableBody) return;

    let currentLeads = [];
    try {
      currentLeads = JSON.parse(localStorage.getItem('abc_leads'));
      if (!Array.isArray(currentLeads)) {
        currentLeads = [];
      }
    } catch (e) {
      currentLeads = [];
    }

    // Clean up undefined forms (where name or sno is missing, or lead is null)
    const cleanedLeads = currentLeads.filter(lead => lead && lead.name && lead.sno);
    if (cleanedLeads.length !== currentLeads.length) {
      safeLocalStorageSet('abc_leads', JSON.stringify(cleanedLeads));
      currentLeads = cleanedLeads;
    }

    const searchQuery = recordsSearchInput ? recordsSearchInput.value.toLowerCase().trim() : "";
    const courseFilter = recordsCourseFilter ? recordsCourseFilter.value : "all";

    // Filter leads
    const filteredLeads = currentLeads.filter(lead => {
      if (!lead) return false;
      
      // Course ID filter
      if (courseFilter !== 'all' && lead.courseId !== courseFilter) {
        return false;
      }

      // Search match
      if (searchQuery !== "") {
        const nameMatch = lead.name ? String(lead.name).toLowerCase().includes(searchQuery) : false;
        const snoMatch = lead.sno ? String(lead.sno).toLowerCase().includes(searchQuery) : false;
        const mobileMatch = lead.mobile ? String(lead.mobile).includes(searchQuery) : false;
        const paymentModeMatch = lead.paymentStatus ? String(lead.paymentStatus).toLowerCase().includes(searchQuery) : false;
        const emailMatch = lead.email ? String(lead.email).toLowerCase().includes(searchQuery) : false;
        const aadharMatch = lead.aadhar ? String(lead.aadhar).includes(searchQuery) : false;
        
        return nameMatch || snoMatch || mobileMatch || paymentModeMatch || emailMatch || aadharMatch;
      }

      return true;
    });

    // Update records count badge
    if (recordsCountBadge) {
      recordsCountBadge.textContent = `Total Forms: ${filteredLeads.length}`;
    }

    // Calculate revenue summaries based on database-wide leads (more appropriate for admin overview)
    let totalRevenue = 0;
    let totalCollected = 0;
    let totalDues = 0;

    currentLeads.forEach(lead => {
      if (lead) {
        totalRevenue += Number(lead.totalFee) || 0;
        totalCollected += Number(lead.paidFee) || 0;
        totalDues += Number(lead.dueFee) || 0;
      }
    });

    if (summaryTotalText) summaryTotalText.textContent = `\u20B9${totalRevenue.toLocaleString('en-IN')}/-`;
    if (summaryCollectedText) summaryCollectedText.textContent = `\u20B9${totalCollected.toLocaleString('en-IN')}/-`;
    if (summaryDuesText) summaryDuesText.textContent = `\u20B9${totalDues.toLocaleString('en-IN')}/-`;

    // Render Table Rows
    if (filteredLeads.length === 0) {
      recordsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--neutral-gray);">No admission records found.</td>
        </tr>
      `;
      return;
    }

    recordsTableBody.innerHTML = filteredLeads.map(lead => {
      const dueColor = Number(lead.dueFee || 0) > 0 ? '#ef4444' : '#25d366';
      return `
        <tr style="border-bottom: 1px solid var(--neutral-border);">
          <td style="padding: 1rem; font-weight: 600;">${lead.sno}</td>
          <td style="padding: 1rem;">
            <div style="font-weight: 600; color: var(--neutral-darker);">${lead.name}</div>
            <div style="font-size: 0.78rem; color: var(--neutral-gray); margin-top: 2px;">DOB: ${lead.dob} | Aadhar: ${lead.aadhar || "N/A"}</div>
          </td>
          <td style="padding: 1rem;">${lead.courseName}</td>
          <td style="padding: 1rem;">${lead.mobile}</td>
          <td style="padding: 1rem;">
            <div>\u20B9${Number(lead.totalFee || 0).toLocaleString('en-IN')}</div>
            <div style="font-size: 0.78rem; color: var(--secondary); margin-top: 2px;">Paid: \u20B9${Number(lead.paidFee || 0).toLocaleString('en-IN')}</div>
          </td>
          <td style="padding: 1rem; font-weight: 600; color: ${dueColor};">\u20B9${Number(lead.dueFee || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 1rem; text-align: center;">
            <div style="display: flex; gap: 0.5rem; justify-content: center; align-items: center;">
              <button class="btn btn-secondary btn-sm btn-view-lead" data-sno="${lead.sno}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">View</button>
              <button class="btn btn-secondary btn-sm btn-edit-lead" data-sno="${lead.sno}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; background: var(--secondary); color: white; border-color: var(--secondary);">Edit</button>
              <button class="btn-primary-sm btn-fee-lead" data-sno="${lead.sno}">Fee Slip</button>
              <button class="btn btn-danger-sm btn-delete-lead" data-sno="${lead.sno}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Event Listeners on View/Delete/Fee buttons dynamically using button closure directly (failsafe against bubbling target)
    const viewButtons = recordsTableBody.querySelectorAll('.btn-view-lead');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sno = btn.getAttribute('data-sno');
        const match = currentLeads.find(l => l && l.sno === sno);
        if (match) {
          receiptBackReferrer = panelRecords;
          try { populateReceipt(match); } catch(err) { console.error('populateReceipt error:', err); }
          switchPanel(panelReceipt);
        }
      });
    });

    const editButtons = recordsTableBody.querySelectorAll('.btn-edit-lead');
    editButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sno = btn.getAttribute('data-sno');
        const match = currentLeads.find(l => l && l.sno === sno);
        if (match) {
          receiptBackReferrer = panelRecords;
          openEditAdmissionForm(match);
        }
      });
    });

    const feeButtons = recordsTableBody.querySelectorAll('.btn-fee-lead');
    feeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sno = btn.getAttribute('data-sno');
        const match = currentLeads.find(l => l && l.sno === sno);
        if (match) {
          openFeeSlipModal(match);
        }
      });
    });

    const deleteButtons = recordsTableBody.querySelectorAll('.btn-delete-lead');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sno = btn.getAttribute('data-sno');
        const match = currentLeads.find(l => l && l.sno === sno);
        if (match) {
          if (confirm(`Are you sure you want to delete the admission record for ${match.name} (${match.sno})?`)) {
            // Delete from localStorage array
            const updatedLeads = currentLeads.filter(l => l && l.sno !== sno);
            safeLocalStorageSet('abc_leads', JSON.stringify(updatedLeads));
            
            // Delete from Supabase
            deleteFromSupabase(sno);
            
            renderRecords(); // re-render
          }
        }
      });
    });
  }

  // Hook search and filter change listeners
  if (recordsSearchInput) {
    recordsSearchInput.addEventListener('input', renderRecords);
  }
  if (recordsCourseFilter) {
    recordsCourseFilter.addEventListener('change', renderRecords);
  }

  // Pre-fill course query params integration
  const urlParams = new URLSearchParams(window.location.search);
  const paramCourse = urlParams.get('course');
  const paramAction = urlParams.get('action');

  if (paramAction === 'new' || paramCourse) {
    if (btnSelectNew) btnSelectNew.click();
    if (paramCourse) {
      // Trigger course radio option programmatically
      const targetRadio = document.querySelector(`input[name="course-choice"][value="${paramCourse}"]`);
      if (targetRadio) {
        targetRadio.checked = true;
        // Dispatch change event to calculate fees
        targetRadio.dispatchEvent(new Event('change'));
      }
    }
  } else if (paramAction === 'check') {
    if (btnSelectCheck) btnSelectCheck.click();
  } else if (paramAction === 'records') {
    if (btnSelectRecords) btnSelectRecords.click();
  }

  // --- Fee Slip Generator Logic ---
  function openFeeSlipModal(lead) {
    const modal = document.getElementById('fee-slip-modal');
    const form = document.getElementById('fee-slip-input-form');
    if (!modal || !form) return;

    // Reset error messages and form
    const errMsg = document.getElementById('fee-slip-error-msg');
    if (errMsg) errMsg.style.display = 'none';
    form.reset();

    // Set data attribute to track which lead is being updated
    form.setAttribute('data-target-lead-sno', lead.sno);

    // Pre-fill student data
    document.getElementById('fee-slip-sno').value = lead.sno || "";
    document.getElementById('fee-slip-date').value = lead.date || "";
    document.getElementById('fee-slip-name').value = lead.name || "";
    document.getElementById('fee-slip-father').value = lead.father || "";
    document.getElementById('fee-slip-course').value = lead.courseName || "";
    
    // Determine course duration text based on course category
    let durationText = lead.duration || "";
    if (!durationText) {
      durationText = "3 Months";
      if (lead.courseCategory === '1y') {
        durationText = "1 Year";
      } else if (lead.courseCategory === '6m') {
        durationText = "6 Months";
      } else if (lead.courseCategory === '2m') {
        durationText = "2 Months";
      } else if (lead.courseId === 'adca') {
        durationText = "6-12 Months";
      }
    }
    document.getElementById('fee-slip-duration').value = durationText;
    document.getElementById('fee-slip-dob').value = lead.dob || "";
    document.getElementById('fee-slip-payment-status').value = lead.paymentStatus || "Online";
    document.getElementById('fee-slip-mobile').value = lead.mobile || "";

    // Pre-fill fees
    document.getElementById('fee-slip-total-fee').value = lead.totalFee || 0;
    document.getElementById('fee-slip-paid-fee').value = lead.paidFee || 0;
    document.getElementById('fee-slip-due-fee').value = lead.dueFee || 0;

    // Photo population inside modal
    const photoBox = document.getElementById('modal-fee-photo-target');
    if (photoBox) {
      if (lead.photo) {
        photoBox.innerHTML = `<img src="${lead.photo}" alt="Student Photo" style="width:100%; height:100%; object-fit:cover;">`;
      } else {
        photoBox.innerHTML = '<span>PHOTO</span>';
        const sb = getSupabase();
        if (sb && lead.sno) {
          sb.from('admissions').select('photo').eq('sno', lead.sno).single()
            .then(({ data, error }) => {
              if (!error && data && data.photo) {
                lead.photo = data.photo;
                photoBox.innerHTML = `<img src="${data.photo}" alt="Student Photo" style="width:100%; height:100%; object-fit:cover;">`;
              }
            });
        }
      }
    }

    // Signature population inside modal
    const sigTextDisplay = document.getElementById('fee-slip-sig-text-display');
    const sigImgDisplay = document.getElementById('fee-slip-sig-image-display');
    if (lead.signatureImg) {
      if (sigImgDisplay) {
        sigImgDisplay.src = lead.signatureImg;
        sigImgDisplay.style.display = 'block';
      }
      if (sigTextDisplay) sigTextDisplay.style.display = 'none';
    } else {
      if (sigImgDisplay) sigImgDisplay.style.display = 'none';
      if (sigTextDisplay) {
        sigTextDisplay.textContent = lead.signatureText || "";
        sigTextDisplay.style.display = 'block';
      }
      const sb = getSupabase();
      if (sb && lead.sno && (!lead.signatureImg || lead.signatureImg === "")) {
        sb.from('admissions').select('signatureimg').eq('sno', lead.sno).single()
          .then(({ data, error }) => {
            if (!error && data && data.signatureimg) {
              lead.signatureImg = data.signatureimg;
              if (sigImgDisplay) {
                sigImgDisplay.src = data.signatureimg;
                sigImgDisplay.style.display = 'block';
              }
              if (sigTextDisplay) sigTextDisplay.style.display = 'none';
            }
          });
      }
    }

    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }

  // Bind real-time calculations inside the modal
  const modalTotalFee = document.getElementById('fee-slip-total-fee');
  const modalPaidFee = document.getElementById('fee-slip-paid-fee');
  const modalDueFee = document.getElementById('fee-slip-due-fee');

  function calculateModalDueFee() {
    if (modalTotalFee && modalPaidFee && modalDueFee) {
      const total = parseFloat(modalTotalFee.value) || 0;
      const paid = parseFloat(modalPaidFee.value) || 0;
      modalDueFee.value = Math.max(0, total - paid);
    }
  }

  if (modalTotalFee) modalTotalFee.addEventListener('input', calculateModalDueFee);
  if (modalPaidFee) modalPaidFee.addEventListener('input', calculateModalDueFee);

  // Bind cancel click
  const btnFeeSlipCancel = document.getElementById('btn-fee-slip-cancel');
  if (btnFeeSlipCancel) {
    btnFeeSlipCancel.addEventListener('click', () => {
      const modal = document.getElementById('fee-slip-modal');
      if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    });
  }

  // Bind form submit for saving and printing
  const feeSlipForm = document.getElementById('fee-slip-input-form');
  if (feeSlipForm) {
    feeSlipForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const sno = document.getElementById('fee-slip-sno').value.trim();
      const dateStr = document.getElementById('fee-slip-date').value.trim();
      const nameVal = document.getElementById('fee-slip-name').value.trim();
      const fatherVal = document.getElementById('fee-slip-father').value.trim();
      const courseVal = document.getElementById('fee-slip-course').value.trim();
      const durationVal = document.getElementById('fee-slip-duration').value.trim();
      const dobVal = document.getElementById('fee-slip-dob').value.trim();
      const paymentStatusVal = document.getElementById('fee-slip-payment-status').value;
      const mobileVal = document.getElementById('fee-slip-mobile').value.trim();

      const totalFeeVal = parseFloat(document.getElementById('fee-slip-total-fee').value) || 0;
      const paidFeeVal = parseFloat(document.getElementById('fee-slip-paid-fee').value) || 0;
      const dueFeeVal = Math.max(0, totalFeeVal - paidFeeVal);

      const errMsg = document.getElementById('fee-slip-error-msg');
      if (errMsg) errMsg.style.display = 'none';

      if (!sno || !dateStr || !nameVal || !fatherVal || !courseVal || !durationVal || !dobVal || !mobileVal) {
        showFeeError("Please fill in all required fields.");
        return;
      }

      // Update leads state in localStorage
      const targetSno = feeSlipForm.getAttribute('data-target-lead-sno');
      let leads = [];
      try {
        leads = JSON.parse(localStorage.getItem('abc_leads')) || [];
      } catch (err) {
        leads = [];
      }

      const leadIdx = leads.findIndex(l => l && l.sno === targetSno);
      let targetLead = null;
      if (leadIdx > -1) {
        leads[leadIdx].sno = sno;
        leads[leadIdx].date = dateStr;
        leads[leadIdx].name = nameVal;
        leads[leadIdx].father = fatherVal;
        leads[leadIdx].courseName = courseVal;
        leads[leadIdx].duration = durationVal;
        leads[leadIdx].dob = dobVal;
        leads[leadIdx].paymentStatus = paymentStatusVal;
        leads[leadIdx].mobile = mobileVal;
        leads[leadIdx].totalFee = totalFeeVal;
        leads[leadIdx].paidFee = paidFeeVal;
        leads[leadIdx].dueFee = dueFeeVal;

        targetLead = leads[leadIdx];
        safeLocalStorageSet('abc_leads', JSON.stringify(leads));
        
        // Sync updated fee slip record to Supabase
        saveToSupabase(targetLead);
      }

      if (!targetLead) {
        showFeeError("Student record not found.");
        return;
      }

      // Populate print elements (null-safe)
      setElText('print-fee-sno', sno);
      setElText('print-fee-date', dateStr);
      setElText('print-fee-name', nameVal);
      setElText('print-fee-father', fatherVal);
      setElText('print-fee-course', courseVal);
      setElText('print-fee-duration', durationVal);
      setElText('print-fee-dob', dobVal);
      setElText('print-fee-payment-status', paymentStatusVal);
      setElText('print-fee-mobile', mobileVal);
      setElText('print-fee-total', `₹${totalFeeVal.toLocaleString('en-IN')}/-`);
      setElText('print-fee-paid', `₹${paidFeeVal.toLocaleString('en-IN')}/-`);
      
      const printDue = document.getElementById('print-fee-due');
      if (printDue) {
        printDue.textContent = `\u20B9${dueFeeVal.toLocaleString('en-IN')}/-`;
        if (dueFeeVal > 0) {
          printDue.style.color = '#ef4444';
        } else {
          printDue.style.color = '#0d9488';
        }
      }

      // Photo for print
      const printPhotoTarget = document.getElementById('print-fee-photo-target');
      if (printPhotoTarget) {
        if (targetLead.photo) {
          printPhotoTarget.innerHTML = `<img src="${targetLead.photo}" alt="Student Photo" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
          printPhotoTarget.innerHTML = '<span>PHOTO</span>';
        }
      }

      // Signatures for print
      const printSigText = document.getElementById('print-fee-sig-text-display');
      const printSigImg = document.getElementById('print-fee-sig-image-display');
      if (targetLead.signatureImg) {
        if (printSigImg) {
          printSigImg.src = targetLead.signatureImg;
          printSigImg.style.display = 'block';
        }
        if (printSigText) printSigText.style.display = 'none';
      } else {
        if (printSigImg) printSigImg.style.display = 'none';
        if (printSigText) {
          printSigText.textContent = targetLead.signatureText || "";
          printSigText.style.display = 'block';
        }
      }

      // Hide modal
      const modal = document.getElementById('fee-slip-modal');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }

      // Temporarily swap display panels to print the receipt
      const printView = document.getElementById('fee-slip-printable-view');
      if (printView) {
        const panels = document.querySelectorAll('.admission-portal-card');
        const originalDisplays = [];
        panels.forEach(p => {
          originalDisplays.push({ element: p, display: p.style.display });
          p.style.display = 'none';
        });

        printView.style.display = 'block';
        document.body.classList.add('print-fee-active');

        setTimeout(() => {
          window.print();

          // Restore
          originalDisplays.forEach(item => {
            item.element.style.display = item.display;
          });
          printView.style.display = 'none';
          document.body.classList.remove('print-fee-active');

          // Re-render dashboard table
          renderRecords();
        }, 150);
      }
    });
  }

  function showFeeError(msg) {
    const errMsg = document.getElementById('fee-slip-error-msg');
    if (errMsg) {
      errMsg.textContent = msg;
      errMsg.style.display = 'block';
    }
  }

  function updateLeadInLocalStorage(updatedLead) {
    let currentLeads = [];
    try {
      currentLeads = JSON.parse(localStorage.getItem('abc_leads'));
      if (!Array.isArray(currentLeads)) currentLeads = [];
    } catch (e) {
      currentLeads = [];
    }
    
    const index = currentLeads.findIndex(l => l && l.sno === updatedLead.sno);
    if (index !== -1) {
      currentLeads[index] = updatedLead;
      safeLocalStorageSet('abc_leads', JSON.stringify(currentLeads));
      
      // Sync update to Supabase
      saveToSupabase(updatedLead);
    }
  }

  // --- Student Notes Portal Implementation ---
  
  // Back navigation
  if (btnBackNotes) {
    btnBackNotes.addEventListener('click', () => switchPanel(panelSelection));
  }

  // Go to Notes Portal
  if (btnSelectNotes) {
    btnSelectNotes.addEventListener('click', () => {
      updateFolderCounts();
      backToNotesFolders();
      renderNotes();
      switchPanel(panelNotes);
    });
  }

  const notesSearchBox = document.getElementById('notes-search-box');
  const notesFilterSelect = document.getElementById('notes-filter-select');
  const notesListTarget = document.getElementById('notes-list-target');

  if (notesSearchBox) {
    notesSearchBox.addEventListener('input', () => {
      renderNotes();
    });
  }

  if (notesFilterSelect) {
    notesFilterSelect.addEventListener('change', () => {
      renderNotes();
    });
  }

  // Folder Navigation & Image Zoom Modal handlers
  window.selectNotesFolder = (folderName) => {
    const filterSelect = document.getElementById('notes-filter-select');
    const folderGrid = document.getElementById('notes-folders-grid');
    const listView = document.getElementById('notes-list-view');
    const nameTag = document.getElementById('notes-folder-name-tag');

    if (filterSelect) {
      filterSelect.value = folderName;
    }
    if (folderGrid) folderGrid.style.display = "none";
    if (listView) listView.style.display = "block";
    
    if (nameTag) {
      if (folderName === 'basics') {
        nameTag.textContent = 'Basics';
        nameTag.style.color = 'var(--primary)';
      } else if (folderName === 'tally') {
        nameTag.textContent = 'Tally';
        nameTag.style.color = 'var(--secondary)';
      } else {
        nameTag.textContent = folderName.charAt(0).toUpperCase() + folderName.slice(1).replace(/_/g, ' ');
        nameTag.style.color = 'var(--primary)';
      }
    }

    renderNotes();
  };

  window.backToNotesFolders = () => {
    const filterSelect = document.getElementById('notes-filter-select');
    const folderGrid = document.getElementById('notes-folders-grid');
    const listView = document.getElementById('notes-list-view');

    if (filterSelect) {
      filterSelect.value = "all";
    }
    if (folderGrid) folderGrid.style.display = "grid";
    if (listView) listView.style.display = "none";

    updateFolderCounts();
  };

  window.zoomImageItem = (src, caption) => {
    const zoomModal = document.getElementById('image-zoom-modal');
    const zoomImg = document.getElementById('zoomed-image-target');
    const zoomCaption = document.getElementById('zoomed-image-caption');
    if (!zoomModal || !zoomImg) return;

    zoomImg.src = src;
    if (zoomCaption) zoomCaption.textContent = caption || "Image View";

    zoomModal.style.display = "flex";
    setTimeout(() => {
      zoomModal.classList.add('active');
      zoomModal.style.opacity = "1";
      zoomModal.style.pointerEvents = "auto";
    }, 10);
    document.body.style.overflow = "hidden";
  };

  function updateFolderCounts() {
    const foldersGrid = document.getElementById('notes-folders-grid');
    if (!foldersGrid) return;

    const notes = getNotesFromStorage();
    
    // Gather all folders. We always include basics and tally
    const folders = [
      { id: 'basics', title: 'Basics Folder', description: 'Computer fundamentals, operating systems, and basic concepts.', themeColor: 'var(--primary)' },
      { id: 'tally', title: 'Tally Folder', description: 'Tally Prime ERP worksheets, bill samples, and case study files.', themeColor: 'var(--secondary)' }
    ];

    // Find any other categories in note database
    notes.forEach(note => {
      if (note.category && !folders.find(f => f.id === note.category)) {
        const formattedTitle = note.category.charAt(0).toUpperCase() + note.category.slice(1).replace(/_/g, ' ');
        folders.push({
          id: note.category,
          title: formattedTitle + ' Folder',
          description: `${formattedTitle} resources, study guides, and worksheets.`,
          themeColor: folders.length % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'
        });
      }
    });

    // Populate Filter select box options
    const filterSelect = document.getElementById('notes-filter-select');
    if (filterSelect) {
      filterSelect.innerHTML = '<option value="all">All Subjects</option>' + 
        folders.map(f => `<option value="${f.id}">${f.title}</option>`).join('');
    }

    // Populate Folder select options in Add Modal
    const folderSelect = document.getElementById('modal-note-folder');
    if (folderSelect) {
      folderSelect.innerHTML = folders.map(f => `<option value="${f.id}">${f.title}</option>`).join('') +
        '<option value="new_folder">+ Add New Folder...</option>';
    }

    // Now render grid HTML
    foldersGrid.innerHTML = folders.map(f => {
      const count = notes.filter(n => n.category === f.id).length;
      const badgeClass = f.themeColor === 'var(--primary)' ? 'badge-primary' : 'badge-secondary';
      
      return `
        <div onclick="window.selectNotesFolder('${f.id}')" style="background: var(--neutral-lighter); border: 1px solid var(--neutral-border); border-radius: var(--radius-lg); padding: 2rem; cursor: pointer; text-align: center; box-shadow: var(--shadow-sm); transition: all var(--transition-normal); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)'; this.style.borderColor='${f.themeColor}';" onmouseout="this.style.transform='none'; this.style.boxShadow='var(--shadow-sm)'; this.style.borderColor='var(--neutral-border)';">
          <div style="font-size: 3.5rem; line-height: 1; user-select: none;">&#128193;</div>
          <div>
            <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--neutral-darker); margin-bottom: 0.25rem;">${f.title}</h4>
            <p style="font-size: 0.82rem; color: var(--neutral-gray); line-height: 1.4; margin-bottom: 0.75rem;">${f.description}</p>
            <span class="badge ${badgeClass}" style="font-size: 0.75rem; padding: 0.3rem 0.75rem; border-radius: 20px;">${count} Note${count !== 1 ? 's' : ''}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Zoom Modal close handlers
  const closeZoomBtn = document.getElementById('close-zoom-modal');
  const zoomModalEl = document.getElementById('image-zoom-modal');
  if (closeZoomBtn && zoomModalEl) {
    closeZoomBtn.addEventListener('click', hideZoomModal);
    zoomModalEl.addEventListener('click', (e) => {
      if (e.target === zoomModalEl || e.target === closeZoomBtn) {
        hideZoomModal();
      }
    });
  }

  function hideZoomModal() {
    const zoomModal = document.getElementById('image-zoom-modal');
    if (!zoomModal) return;
    zoomModal.classList.remove('active');
    zoomModal.style.opacity = "0";
    zoomModal.style.pointerEvents = "none";
    setTimeout(() => {
      zoomModal.style.display = "none";
    }, 300);
    document.body.style.overflow = "";
  }

  // Add Note Modal Controls
  const addNoteModal = document.getElementById('add-note-modal');
  const btnAddNoteTrigger = document.getElementById('btn-add-note-trigger');
  const btnAddNoteCancel = document.getElementById('btn-add-note-cancel');
  const addNoteForm = document.getElementById('add-note-form');
  const modalNoteType = document.getElementById('modal-note-type');
  const fileGroup = document.getElementById('modal-note-file-group');
  const textGroup = document.getElementById('modal-note-text-group');
  const modalNoteFile = document.getElementById('modal-note-file');
  const modalNoteText = document.getElementById('modal-note-text');
  const modalNoteFolder = document.getElementById('modal-note-folder');
  const modalNewFolderGroup = document.getElementById('modal-new-folder-name-group');
  const modalNewFolderName = document.getElementById('modal-new-folder-name');

  if (btnAddNoteTrigger) {
    btnAddNoteTrigger.addEventListener('click', () => {
      const pwd = prompt("Enter Admin Password to Add Note:");
      if (pwd === '8827512123#') {
        openAddNoteModal();
      } else if (pwd !== null) {
        alert("Incorrect password!");
      }
    });
  }

  if (btnAddNoteCancel) {
    btnAddNoteCancel.addEventListener('click', () => {
      closeAddNoteModal();
    });
  }

  if (addNoteForm) {
    addNoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveModalNote();
    });
  }

  if (modalNoteType && fileGroup && textGroup && modalNoteFile && modalNoteText) {
    modalNoteType.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'text') {
        fileGroup.style.display = 'none';
        textGroup.style.display = 'block';
        modalNoteFile.required = false;
        modalNoteText.required = true;
      } else {
        fileGroup.style.display = 'block';
        textGroup.style.display = 'none';
        modalNoteFile.required = true;
        modalNoteText.required = false;
      }
    });
  }

  if (modalNoteFolder && modalNewFolderGroup && modalNewFolderName) {
    modalNoteFolder.addEventListener('change', (e) => {
      if (e.target.value === 'new_folder') {
        modalNewFolderGroup.style.display = 'block';
        modalNewFolderName.required = true;
      } else {
        modalNewFolderGroup.style.display = 'none';
        modalNewFolderName.required = false;
      }
    });
  }

  function openAddNoteModal() {
    if (addNoteModal) {
      document.getElementById('modal-note-title').value = "";
      document.getElementById('modal-note-folder').value = "basics";
      if (modalNewFolderGroup) modalNewFolderGroup.style.display = 'none';
      if (modalNewFolderName) {
        modalNewFolderName.value = "";
        modalNewFolderName.required = false;
      }
      const typeSelect = document.getElementById('modal-note-type');
      typeSelect.value = "pdf";
      const fileInput = document.getElementById('modal-note-file');
      if (fileInput) fileInput.value = "";
      document.getElementById('modal-note-text').value = "";
      
      typeSelect.dispatchEvent(new Event('change'));
      
      addNoteModal.style.display = 'flex';
      setTimeout(() => {
        addNoteModal.classList.add('active');
        addNoteModal.style.opacity = "1";
        addNoteModal.style.pointerEvents = "auto";
      }, 10);
    }
  }

  function closeAddNoteModal() {
    if (addNoteModal) {
      addNoteModal.classList.remove('active');
      addNoteModal.style.opacity = "0";
      addNoteModal.style.pointerEvents = "none";
      setTimeout(() => {
        addNoteModal.style.display = 'none';
      }, 300);
    }
  }

  function saveModalNote() {
    const title = document.getElementById('modal-note-title').value.trim();
    let folder = document.getElementById('modal-note-folder').value;
    const type = document.getElementById('modal-note-type').value;
    const fileInput = document.getElementById('modal-note-file');
    const text = document.getElementById('modal-note-text').value.trim();
    
    if (!title) return;

    if (folder === 'new_folder') {
      const customName = modalNewFolderName ? modalNewFolderName.value.trim() : "";
      if (!customName) {
        alert("Please enter a name for the new folder!");
        return;
      }
      folder = customName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      if (folder === 'basics' || folder === 'tally' || folder === 'all') {
        alert("This folder name is reserved. Please choose another name!");
        return;
      }
    }
    
    const timestamp = new Date().toLocaleString('en-IN');
    
    const proceedWithSave = (fileUrlData) => {
      let notes = getNotesFromStorage();
      const newNote = {
        id: 'note_' + Date.now(),
        title: title,
        category: folder,
        type: type,
        fileUrl: fileUrlData,
        content: type === 'text' ? text : "",
        date: timestamp
      };
      
      notes.push(newNote);
      saveNotesToStorage(notes);
      closeAddNoteModal();
      updateFolderCounts();
      renderNotes();
    };

    if (type !== 'text' && fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("File size is too large! Please choose a file smaller than 2MB to save space.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        proceedWithSave(e.target.result);
      };
      reader.onerror = () => {
        alert("Error reading file!");
      };
      reader.readAsDataURL(file);
    } else {
      proceedWithSave("");
    }
  }

  const DEFAULT_NOTES = [
    // --- Tally Section (Existing Tally notes preserved, reversed order) ---
    {
      id: "note_default_tally_image",
      title: "Tally Invoice Reference Photo",
      category: "tally",
      type: "image",
      fileUrl: "assets/images/tally_image.jpg",
      date: "06/06/2026, 10:33:00 AM"
    },
    {
      id: "note_default_tally_workbook",
      title: "Tally Workbook Case Study - 3 PDF",
      category: "tally",
      type: "pdf",
      fileUrl: "assets/docs/tally_workbook_case_study_3.pdf",
      date: "06/06/2026, 10:32:00 AM"
    },
    {
      id: "note_default_tally_bill",
      title: "Tally Sample Bill Invoice PDF",
      category: "tally",
      type: "pdf",
      fileUrl: "assets/docs/tally_bill_1.pdf",
      date: "06/06/2026, 10:31:00 AM"
    },
    {
      id: "note_default_tally_repaired",
      title: "Tally Repaired Guide PDF",
      category: "tally",
      type: "pdf",
      fileUrl: "assets/docs/tally_repaired.pdf",
      date: "06/06/2026, 10:30:00 AM"
    },

    // --- Basics Section (Reversed so Docs render first, then Images) ---
    // Basics Images (rendered last in UI)
    {
      id: "note_basics_img_10",
      title: "Typing Finger Placement Chart",
      category: "basics",
      type: "image",
      fileUrl: "assets/images/basics_image_10.jpg",
      date: "06/06/2026, 11:37:00 AM"
    },
    {
      id: "note_basics_img_9",
      title: "Basic Internet Security Practice",
      category: "basics",
      type: "image",
      fileUrl: "assets/images/basics_image_9.jpg",
      date: "06/06/2026, 11:37:00 AM"
    },
    {
      id: "note_basics_img_8",
      title: "PowerPoint Presentation Tips",
      category: "basics",
      type: "image",
      fileUrl: "assets/images/basics_image_8.jpg",
      date: "06/06/2026, 11:30:00 AM"
    },
    {
      id: "note_basics_img_7",
      title: "MS Word Toolbar Reference Sheet",
      category: "basics",
      type: "image",
      fileUrl: "assets/images/basics_image_7.jpg",
      date: "06/06/2026, 11:30:00 AM"
    },
    {
      id: "note_basics_img_6",
      title: "Excel Rows and Columns Basics",
      category: "basics",
      type: "image",
      fileUrl: "assets/images/basics_image_6.jpg",
      date: "06/06/2026, 11:30:00 AM"
    },
    {
      id: "note_basics_img_5",
      title: "File Explorer & Folder Operations",
      category: "basics",
      type: "image",
      fileUrl: "assets/images/basics_image_5.jpg",
      date: "06/06/2026, 11:29:00 AM"
    },
    {
      id: "note_basics_img_4",
      title: "Windows Desktop Navigation Guide",
      category: "basics",
      type: "image",
      fileUrl: "assets/images/basics_image_4.jpg",
      date: "06/06/2026, 11:29:00 AM"
    },
    {
      id: "note_basics_img_3",
      title: "Computer Hardware Parts Layout",
      category: "basics",
      type: "image",
      fileUrl: "assets/images/basics_image_3.jpg",
      date: "06/06/2026, 11:29:00 AM"
    },
    {
      id: "note_basics_img_2",
      title: "MS Paint & Draw Basics Chart",
      category: "basics",
      type: "image",
      fileUrl: "assets/images/basics_image_2.jpg",
      date: "06/06/2026, 11:29:00 AM"
    },
    {
      id: "note_basics_img_1",
      title: "Keyboard Shortcuts Quick Reference",
      category: "basics",
      type: "image",
      fileUrl: "assets/images/basics_image_1.jpg",
      date: "06/06/2026, 11:30:00 AM"
    },
    
    // Basics Docs (rendered first in UI)
    {
      id: "note_basics_covid_impacts",
      title: "Impacts of COVID-19 Essay PDF",
      category: "basics",
      type: "pdf",
      fileUrl: "assets/docs/covid_impacts_essay.pdf",
      date: "06/06/2026, 11:32:00 AM"
    },
    {
      id: "note_basics_excel_practice",
      title: "50 MS Excel Assignments Practice Document",
      category: "basics",
      type: "doc",
      fileUrl: "assets/docs/excel_assignments_practice.docx",
      date: "06/06/2026, 11:31:00 AM"
    },
    {
      id: "note_basics_typing_chart",
      title: "Typing Chart Guide PDF",
      category: "basics",
      type: "pdf",
      fileUrl: "assets/docs/typing_chart_guide.pdf",
      date: "06/06/2026, 11:32:00 AM"
    },
    {
      id: "note_basics_shortcut_keys",
      title: "Computer Shortcut Keys Reference PDF",
      category: "basics",
      type: "pdf",
      fileUrl: "assets/docs/computer_shortcut_keys.pdf",
      date: "06/06/2026, 11:32:00 AM"
    },
    {
      id: "note_basics_fundamentals",
      title: "Computer Fundamentals Notes PDF",
      category: "basics",
      type: "pdf",
      fileUrl: "assets/docs/computer_fundamentals_notes.pdf",
      date: "06/06/2026, 11:34:00 AM"
    },
    {
      id: "note_basics_hindi_ebook",
      title: "Computer Hindi eBook PDF",
      category: "basics",
      type: "pdf",
      fileUrl: "assets/docs/computer_hindi_ebook.pdf",
      date: "06/06/2026, 11:32:00 AM"
    }
  ];

  function getNotesFromStorage() {
    try {
      const stored = localStorage.getItem('abc_student_notes_v3');
      if (!stored) {
        safeLocalStorageSet('abc_student_notes_v3', JSON.stringify(DEFAULT_NOTES));
        return DEFAULT_NOTES;
      }
      return JSON.parse(stored);
    } catch (err) {
      return DEFAULT_NOTES;
    }
  }

  function saveNotesToStorage(notes) {
    safeLocalStorageSet('abc_student_notes_v3', JSON.stringify(notes));
  }

  function renderNotes() {
    if (!notesListTarget) return;

    const notes = getNotesFromStorage();
    const searchVal = notesSearchBox ? notesSearchBox.value.toLowerCase().trim() : "";
    const filterVal = notesFilterSelect ? notesFilterSelect.value : "all";

    const filtered = notes.filter(note => {
      const matchSearch = note.title.toLowerCase().includes(searchVal) || (note.content && note.content.toLowerCase().includes(searchVal));
      const matchFilter = filterVal === 'all' || note.category === filterVal;
      return matchSearch && matchFilter;
    });

    // Sort descending (newest first)
    filtered.reverse();

    if (filtered.length === 0) {
      notesListTarget.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; background: var(--neutral-lighter); border: 1px dashed var(--neutral-border); border-radius: var(--radius-lg); color: var(--neutral-gray); grid-column: 1 / -1; width: 100%;">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">\uD83D\uDCDD</div>
          <div style="font-weight: 600;">No files found</div>
          <div style="font-size: 0.82rem; margin-top: 4px;">Files will be loaded when available.</div>
        </div>
      `;
      return;
    }

    notesListTarget.innerHTML = filtered.map(note => {
      const escapedTitle = note.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      if (note.type === 'pdf') {
        return `
          <div class="note-resource-card" onclick="window.openNoteItem('${note.id}')" style="position: relative; background: var(--neutral-lighter); border: 1px solid var(--neutral-border); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; display: flex; align-items: center; gap: 1.25rem; transition: all var(--transition-normal); box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='var(--primary)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='none'; this.style.borderColor='var(--neutral-border)'; this.style.boxShadow='var(--shadow-sm)';">
            <div style="font-size: 2.2rem; color: #ef4444; background: #fee2e2; width: 54px; height: 54px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">📕</div>
            <div style="flex-grow: 1; text-align: left; overflow: hidden; padding-right: 2.5rem;">
               <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--neutral-darker); margin: 0 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapedTitle}">${escapedTitle}</h4>
               <p style="font-size: 0.78rem; color: var(--neutral-gray); margin: 0;">Click to open PDF Document</p>
            </div>
            <button type="button" onclick="event.stopPropagation(); window.downloadNoteItem('${note.id}')" style="position: absolute; top: 0.5rem; right: 2.2rem; background: transparent; border: none; font-size: 1.1rem; color: var(--neutral-gray); cursor: pointer; transition: color var(--transition-normal); padding: 4px;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--neutral-gray)'" title="Download Note">\uD83D\uDCE5</button>
            <button type="button" onclick="event.stopPropagation(); window.deleteNoteItem('${note.id}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: transparent; border: none; font-size: 1.1rem; color: var(--neutral-gray); cursor: pointer; transition: color var(--transition-normal); padding: 4px;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--neutral-gray)'" title="Delete Note">\uD83D\uDDD1</button>
          </div>
        `;
      } else if (note.type === 'doc') {
        return `
          <div class="note-resource-card" onclick="window.openNoteItem('${note.id}')" style="position: relative; background: var(--neutral-lighter); border: 1px solid var(--neutral-border); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; display: flex; align-items: center; gap: 1.25rem; transition: all var(--transition-normal); box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='var(--primary)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='none'; this.style.borderColor='var(--neutral-border)'; this.style.boxShadow='var(--shadow-sm)';">
            <div style="font-size: 2.2rem; color: #2563eb; background: #dbeafe; width: 54px; height: 54px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">📘</div>
            <div style="flex-grow: 1; text-align: left; overflow: hidden; padding-right: 2.5rem;">
               <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--neutral-darker); margin: 0 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapedTitle}">${escapedTitle}</h4>
               <p style="font-size: 0.78rem; color: var(--neutral-gray); margin: 0;">Click to download Word Document</p>
            </div>
            <button type="button" onclick="event.stopPropagation(); window.downloadNoteItem('${note.id}')" style="position: absolute; top: 0.5rem; right: 2.2rem; background: transparent; border: none; font-size: 1.1rem; color: var(--neutral-gray); cursor: pointer; transition: color var(--transition-normal); padding: 4px;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--neutral-gray)'" title="Download Note">\uD83D\uDCE5</button>
            <button type="button" onclick="event.stopPropagation(); window.deleteNoteItem('${note.id}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: transparent; border: none; font-size: 1.1rem; color: var(--neutral-gray); cursor: pointer; transition: color var(--transition-normal); padding: 4px;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--neutral-gray)'" title="Delete Note">\uD83D\uDDD1</button>
          </div>
        `;
      } else if (note.type === 'image') {
        return `
          <div class="note-resource-card" onclick="window.openNoteItem('${note.id}')" style="position: relative; background: var(--neutral-lighter); border: 1px solid var(--neutral-border); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; display: flex; align-items: center; gap: 1.25rem; transition: all var(--transition-normal); box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='var(--secondary)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='none'; this.style.borderColor='var(--neutral-border)'; this.style.boxShadow='var(--shadow-sm)';">
            <div style="width: 54px; height: 54px; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--neutral-border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #f8fafc;">
               <img src="${note.fileUrl}" alt="Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex-grow: 1; text-align: left; overflow: hidden; padding-right: 2.5rem;">
               <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--neutral-darker); margin: 0 0 0.25rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapedTitle}">${escapedTitle}</h4>
               <p style="font-size: 0.78rem; color: var(--neutral-gray); margin: 0;">Click to open Photo</p>
            </div>
            <button type="button" onclick="event.stopPropagation(); window.downloadNoteItem('${note.id}')" style="position: absolute; top: 0.5rem; right: 2.2rem; background: transparent; border: none; font-size: 1.1rem; color: var(--neutral-gray); cursor: pointer; transition: color var(--transition-normal); padding: 4px;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--neutral-gray)'" title="Download Note">\uD83D\uDCE5</button>
            <button type="button" onclick="event.stopPropagation(); window.deleteNoteItem('${note.id}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: transparent; border: none; font-size: 1.1rem; color: var(--neutral-gray); cursor: pointer; transition: color var(--transition-normal); padding: 4px;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--neutral-gray)'" title="Delete Note">\uD83D\uDDD1</button>
          </div>
        `;
      } else {
        const escapedContent = note.content ? note.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : "";
        return `
          <div style="position: relative; background: var(--neutral-lighter); border: 1px solid var(--neutral-border); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
            <h4 style="font-size: 0.98rem; color: var(--neutral-darker); margin: 0 0 0.5rem 0; font-weight: 700; padding-right: 2.5rem;">${escapedTitle}</h4>
            <p style="white-space: pre-wrap; margin: 0 0 0.75rem 0; font-size: 0.85rem; color: var(--neutral-gray);">${escapedContent}</p>
            <button type="button" onclick="event.stopPropagation(); window.downloadNoteItem('${note.id}')" style="position: absolute; top: 0.5rem; right: 2.2rem; background: transparent; border: none; font-size: 1.1rem; color: var(--neutral-gray); cursor: pointer; transition: color var(--transition-normal); padding: 4px;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--neutral-gray)'" title="Download Note">\uD83D\uDCE5</button>
            <button type="button" onclick="event.stopPropagation(); window.deleteNoteItem('${note.id}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: transparent; border: none; font-size: 1.1rem; color: var(--neutral-gray); cursor: pointer; transition: color var(--transition-normal); padding: 4px;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--neutral-gray)'" title="Delete Note">\uD83D\uDDD1</button>
          </div>
        `;
      }
    }).join('');
  }

  function openBase64InNewTab(base64Data, filename) {
    try {
      const parts = base64Data.split(';base64,');
      if (parts.length < 2) {
        window.open(base64Data, '_blank');
        return;
      }
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], {type: contentType});
      const url = URL.createObjectURL(blob);
      if (filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error("Error opening base64 file", err);
      window.open(base64Data, '_blank');
    }
  }

  window.openNoteItem = (id) => {
    const notes = getNotesFromStorage();
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    if (note.fileUrl && note.fileUrl.startsWith('data:')) {
      openBase64InNewTab(note.fileUrl);
    } else if (note.fileUrl) {
      window.open(note.fileUrl, '_blank');
    }
  };

  window.downloadNoteItem = (id) => {
    const notes = getNotesFromStorage();
    const note = notes.find(n => n.id === id);
    if (!note) return;

    if (note.type === 'text') {
      const element = document.createElement('a');
      const file = new Blob([note.content], {type: 'text/plain;charset=utf-8'});
      element.href = URL.createObjectURL(file);
      element.download = `${note.title.replace(/[^a-z0-9_-]/gi, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else if (note.fileUrl && note.fileUrl.startsWith('data:')) {
      let extension = 'bin';
      if (note.type === 'pdf') extension = 'pdf';
      else if (note.type === 'doc') extension = 'docx';
      else if (note.type === 'image') {
        const mime = note.fileUrl.split(';')[0].split(':')[1];
        extension = mime.split('/')[1] || 'jpg';
      }
      openBase64InNewTab(note.fileUrl, `${note.title.replace(/[^a-z0-9_-]/gi, '_')}.${extension}`);
    } else {
      window.open(note.fileUrl, '_blank');
    }
  };

  window.deleteNoteItem = (id) => {
    const pwd = prompt("Enter Admin Password to Delete Note:");
    if (pwd === '8827512123#') {
      if (confirm("Are you sure you want to delete this note?")) {
        let notes = getNotesFromStorage();
        notes = notes.filter(n => n.id !== id);
        saveNotesToStorage(notes);
        updateFolderCounts();
        renderNotes();
      }
    } else if (pwd !== null) {
      alert("Incorrect password!");
    }
  };

  // Check URL query parameters to auto-switch panel
  const notesUrlParams = new URLSearchParams(window.location.search);
  const panelParam = notesUrlParams.get('panel');
  if (panelParam === 'notes') {
    updateFolderCounts();
    backToNotesFolders();
    const folderParam = notesUrlParams.get('folder');
    if (folderParam === 'basics' || folderParam === 'tally') {
      selectNotesFolder(folderParam);
    } else {
      renderNotes();
    }
    switchPanel(panelNotes);
  }

  // Trigger Supabase database sync on page load
  syncFromSupabase(renderRecords);
});


