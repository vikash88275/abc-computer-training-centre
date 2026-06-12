/* 
========================================================================
   ABC Computer Training Centre - Fee Slip Retrieval Engine
   Developer: Antigravity
========================================================================
*/

// --- Supabase Config & Initialization ---
const supabaseUrl = 'https://zoonzlmmlheapqentzld.supabase.co';
const supabaseKey = 'sb_publishable_aOXny0qKbF3Z2xrHBFkQSw_XXetTODe';
let supabase = null;
if (window.supabase) {
  supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
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
    } else {
      console.error('localStorage.setItem failed:', e);
    }
    return false;
  }
}

async function syncFromSupabase() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('admissions').select('*');
    if (error) throw error;
    if (data && Array.isArray(data)) {
      let localLeads = [];
      try {
        localLeads = JSON.parse(localStorage.getItem('abc_leads')) || [];
      } catch (e) {}

      const merged = [...localLeads];
      data.forEach(remoteLead => {
        const idx = merged.findIndex(l => l && l.sno === remoteLead.sno);
        if (idx !== -1) {
          const remoteTime = remoteLead.timestamp ? new Date(remoteLead.timestamp).getTime() : 0;
          const localTime = merged[idx].timestamp ? new Date(merged[idx].timestamp).getTime() : 0;
          if (remoteTime >= localTime) {
            merged[idx] = remoteLead;
          }
        } else {
          merged.push(remoteLead);
        }
      });

      safeLocalStorageSet('abc_leads', JSON.stringify(merged));
      console.log("Supabase leads synced to local storage successfully for slip retrieval.");
    }
  } catch (err) {
    console.error("Error syncing leads from Supabase for slip:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Trigger Supabase sync on load
  syncFromSupabase();
  const searchView = document.getElementById('slip-search-view');
  const cardView = document.getElementById('slip-card-view');
  const retrieveForm = document.getElementById('slip-retrieve-form');
  const errorMsg = document.getElementById('slip-error-msg');
  const btnBack = document.getElementById('btn-back-slip');
  const btnPrint = document.getElementById('btn-print-slip');

  if (retrieveForm) {
    retrieveForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const studentName = document.getElementById('slip-name').value.trim();
      const birthPassword = document.getElementById('slip-password').value.trim();

      if (!studentName || !birthPassword) {
        showError("Please fill in both student name and password (date of birth).");
        return;
      }

      const formattedSearchPassword = normalizeDateInput(birthPassword);
      let match = null;
      let isRemote = false;

      if (supabase) {
        showError("Searching online records...");
        try {
          const { data, error } = await supabase
            .from('admissions')
            .select('*')
            .ilike('name', studentName);
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            match = data.find(lead => {
              if (!lead || !lead.dob) return false;
              const leadDobNormalized = normalizeDateInput(lead.dob);
              return leadDobNormalized === formattedSearchPassword;
            });
            if (match) {
              isRemote = true;
            }
          }
        } catch (err) {
          console.error("Error searching Supabase for fee slip:", err);
        }
      }

      if (!match) {
        // Fetch leads from localStorage as fallback
        let currentLeads = [];
        try {
          currentLeads = JSON.parse(localStorage.getItem('abc_leads'));
          if (!Array.isArray(currentLeads)) {
            currentLeads = [];
          }
        } catch (err) {
          currentLeads = [];
        }
        match = currentLeads.find(lead => {
          if (!lead || !lead.name || !lead.dob) return false;
          const leadName = lead.name.toLowerCase().trim();
          const searchNameLower = studentName.toLowerCase().trim();
          const leadDobNormalized = normalizeDateInput(lead.dob);
          return leadName === searchNameLower && leadDobNormalized === formattedSearchPassword;
        });
      }

      if (match) {
        if (errorMsg) errorMsg.style.display = 'none';

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
            console.error("Failed to update fee slip match in local storage:", e);
          }
        }

        populateFeeSlip(match);
        if (searchView) searchView.style.display = 'none';
        if (cardView) cardView.style.display = 'block';
      } else {
        showError("No record found with this name and password. Please check your details or visit the center.");
      }
    });
  }

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (cardView) cardView.style.display = 'none';
      if (searchView) searchView.style.display = 'block';
      if (retrieveForm) retrieveForm.reset();
      if (errorMsg) errorMsg.style.display = 'none';
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.style.display = 'block';
    }
  }

  function normalizeDateInput(dateStr) {
    if (!dateStr) return "";
    const trimmed = dateStr.trim();
    const yyyymmddMatch = trimmed.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
    if (yyyymmddMatch) {
      return `${yyyymmddMatch[3]}/${yyyymmddMatch[2]}/${yyyymmddMatch[1]}`;
    }
    const ddmmyyyyMatch = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (ddmmyyyyMatch) {
      return `${ddmmyyyyMatch[1]}/${ddmmyyyyMatch[2]}/${ddmmyyyyMatch[3]}`;
    }
    return trimmed.replace(/-/g, '/');
  }

  function populateFeeSlip(lead) {
    // Basic text mappings
    document.getElementById('slip-sno-val').textContent = lead.sno || "";
    document.getElementById('slip-date-val').textContent = lead.date || "";
    document.getElementById('slip-name-val').textContent = lead.name || "";
    document.getElementById('slip-father-val').textContent = lead.father || "";
    document.getElementById('slip-course-val').textContent = lead.courseName || "";
    document.getElementById('slip-dob-val').textContent = lead.dob || "";
    const slipPaymentStatus = document.getElementById('slip-payment-status-val');
    if (slipPaymentStatus) {
      const currentMode = lead.paymentStatus || "";
      const isModeValid = (currentMode === 'Online' || currentMode === 'Offline');

      if (isModeValid) {
        slipPaymentStatus.textContent = currentMode;
      } else {
        // Render Online/Offline interactive selection buttons that are hidden during print
        slipPaymentStatus.innerHTML = `
          <span class="payment-mode-text print-only"></span>
          <div class="payment-selector-widget no-print" style="display: inline-flex; gap: 0.5rem; align-items: center;">
            <button type="button" class="btn-mode-select" data-val="Online" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--primary); border-radius: 4px; background: transparent; color: var(--primary); cursor: pointer; font-weight: 600;">Online</button>
            <button type="button" class="btn-mode-select" data-val="Offline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--neutral-gray); border-radius: 4px; background: transparent; color: var(--neutral-gray); cursor: pointer; font-weight: 600;">Offline</button>
          </div>
        `;

        // Attach click handlers to the buttons
        const textSpan = slipPaymentStatus.querySelector('.payment-mode-text');
        const buttons = slipPaymentStatus.querySelectorAll('.btn-mode-select');

        buttons.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedVal = btn.getAttribute('data-val');
            
            // Set text for print
            if (textSpan) textSpan.textContent = selectedVal;
            
            // Set text in cell
            slipPaymentStatus.textContent = selectedVal;
            
            // Update the lead in localStorage
            lead.paymentStatus = selectedVal;
            updateLeadInLocalStorage(lead);
          });
        });
      }
    }
    document.getElementById('slip-mobile-val').textContent = lead.mobile || "";

    // Determine course duration text based on course category
    let durationText = "3 Months";
    if (lead.courseCategory === '1y') {
      durationText = "1 Year";
    } else if (lead.courseCategory === '6m') {
      durationText = "6 Months";
    } else if (lead.courseCategory === '2m') {
      durationText = "2 Months";
    } else if (lead.courseId === 'adca') {
      durationText = "6-12 Months";
    }
    document.getElementById('slip-duration-val').textContent = durationText;

    // Fees summary
    const totalFeeNum = lead.totalFee ? Number(lead.totalFee) : 0;
    const paidFeeNum = lead.paidFee ? Number(lead.paidFee) : 0;
    const dueFeeNum = lead.dueFee ? Number(lead.dueFee) : 0;

    document.getElementById('slip-fee-total').textContent = `₹${totalFeeNum.toLocaleString('en-IN')}/-`;
    document.getElementById('slip-fee-paid').textContent = `₹${paidFeeNum.toLocaleString('en-IN')}/-`;
    
    const dueElement = document.getElementById('slip-fee-due');
    if (dueElement) {
      dueElement.textContent = `₹${dueFeeNum.toLocaleString('en-IN')}/-`;
      if (dueFeeNum > 0) {
        dueElement.style.color = '#ef4444'; // Red
      } else {
        dueElement.style.color = '#0d9488'; // Teal/Green
      }
    }

    // Photo population
    const photoBox = document.getElementById('slip-photo-target');
    if (photoBox) {
      if (lead.photo) {
        photoBox.innerHTML = `<img src="${lead.photo}" alt="Student Photo" style="width:100%; height:100%; object-fit:cover;">`;
      } else {
        photoBox.innerHTML = '<span>PHOTO</span>';
        if (supabase && lead.sno) {
          supabase.from('admissions').select('photo').eq('sno', lead.sno).single()
            .then(({ data, error }) => {
              if (!error && data && data.photo) {
                lead.photo = data.photo;
                photoBox.innerHTML = `<img src="${data.photo}" alt="Student Photo" style="width:100%; height:100%; object-fit:cover;">`;
              }
            });
        }
      }
    }

    // Signature mapping
    const sigTextDisplay = document.getElementById('slip-sig-text-display');
    const sigImgDisplay = document.getElementById('slip-sig-image-display');

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
      if (supabase && lead.sno && (!lead.signatureImg || lead.signatureImg === "")) {
        supabase.from('admissions').select('signatureImg').eq('sno', lead.sno).single()
          .then(({ data, error }) => {
            if (!error && data && data.signatureImg) {
              lead.signatureImg = data.signatureImg;
              if (sigImgDisplay) {
                sigImgDisplay.src = data.signatureImg;
                sigImgDisplay.style.display = 'block';
              }
              if (sigTextDisplay) sigTextDisplay.style.display = 'none';
            }
          });
      }
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
      localStorage.setItem('abc_leads', JSON.stringify(currentLeads));
    }
  }
});
