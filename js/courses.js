/* 
========================================================================
   ABC Computer Training Centre - Course Catalog Dynamic Engine
   Developer: Antigravity
========================================================================
*/

const COURSES_DATA = [
  {
    id: "dca",
    name: "DCA (Diploma in Computer Applications)",
    category: "diploma",
    duration: "1 Year (12 Months)",
    eligibility: "12th Pass (Any Stream)",
    fee: "₹7,500 (Full Year)",
    image: "assets/images/dca_course.png", // Premium dynamic digital illustration
    shortDesc: "Government recognized 1-year diploma covering essential computer applications, PC packages, databases, and IT trends, affiliated with Makhanlal University.",
    syllabus: [
      "Computer Fundamentals & Information Technology",
      "Operating System Basics (Windows, DOS)",
      "PC Packages (MS Word, MS Excel, MS PowerPoint)",
      "Database Management System (MS Access)",
      "Programming Methodology with C / FoxPro",
      "IT Trends & Technologies",
      "DTP Packages (Pagemaker, Photoshop, CorelDraw)",
      "Internet & Web Designing Basics"
    ],
    certification: "Govt. Recognized & University Affiliated Certificate (Valuable for all Govt. Jobs)"
  },
  {
    id: "pgdca",
    name: "PGDCA (Post Graduate Diploma in Computer Applications)",
    category: "diploma",
    duration: "1 Year (12 Months)",
    eligibility: "Graduate (Any Stream)",
    fee: "₹9,500 (Full Year)",
    image: "assets/images/pgdca_course.png", // Premium database & servers illustration
    shortDesc: "A premium postgraduate diploma designed to make you an expert in IT infrastructure, programming, databases, web development, and financial accounting.",
    syllabus: [
      "Information Technology & PC Packages",
      "Database Management using MS Access",
      "System Analysis and Design",
      "Programming in C / FoxPro",
      "Tally Prime ERP with GST Accounting",
      "Multimedia & Web Page Designing",
      "Core Java / Internet Technologies",
      "Software Engineering & Project Work"
    ],
    certification: "University Affiliated Professional Postgraduate Diploma (Valuable for all Govt. & Corporate Jobs)"
  },
  {
    id: "adca",
    name: "ADCA (Advanced Diploma in Computer Applications)",
    category: "diploma",
    duration: "6 or 12 Months",
    eligibility: "10th/12th Pass",
    fee: "₹6,000 - ₹8,500",
    image: "assets/images/adca_course.png", // Office automation and corporate gradient art
    shortDesc: "The ultimate job-oriented course ('Naukri Dilane Wala Course'). Combines basic computing, advanced accounting, web design, and office automation.",
    syllabus: [
      "Basic Computer Operations & OS Fundamentals",
      "Advanced MS Office (Word, Excel, PowerPoint)",
      "Financial Accounting with Tally + GST",
      "Desktop Publishing (CorelDraw, Photoshop)",
      "Web Design & Development (HTML, CSS, JS)",
      "Data Entry & Office Management Work",
      "CPCT Preparation & Typing Mastery",
      "Project & Practical Assignments"
    ],
    certification: "ISO 9001:2015 Certified Professional Diploma"
  },
  {
    id: "ccc",
    name: "CCC (Course on Computer Concepts)",
    category: "certification",
    duration: "3 Months (90 Days)",
    eligibility: "10th Pass",
    fee: "₹2,500",
    image: "assets/images/ccc_course.png", // Digital literacy & internet security illustration
    shortDesc: "Standard computer literacy course mapped to government standards. Learn operating systems, word processing, spreadsheets, internet, and digital banking.",
    syllabus: [
      "Introduction to Computer & GUI Operating Systems",
      "Elements of Word Processing (MS Word)",
      "Spreadsheets Mastery (MS Excel)",
      "Making Presentations (MS PowerPoint)",
      "Introduction to Internet, WWW and Web Browsers",
      "Communication and Collaboration (Emails)",
      "Digital Financial Services & Cyber Security",
      "Social Networking & E-Governance Services"
    ],
    certification: "National Level Standard Certificate"
  },
  {
    id: "tally",
    name: "Tally Prime ERP + GST Accountancy",
    category: "certification",
    duration: "3 Months (90 Days)",
    eligibility: "10th/12th Pass (Commerce Preferred but open to all)",
    fee: "₹3,500",
    image: "assets/images/tally_course.png", // Accounting ledger & finance illustration
    shortDesc: "Become a professional accountant. Covers financial principles, company creation, inventory control, voucher entry, and full GST calculations.",
    syllabus: [
      "Introduction to Accounting Principles & Terms",
      "Company Creation & Group Ledger Configurations in Tally",
      "Voucher Entries (Receipt, Payment, Contra, Sales, Purchase)",
      "Inventory Management (Stock Groups, Categories, Godowns)",
      "Goods & Services Tax (GST, CGST, SGST, IGST Setup)",
      "Tax Deducted at Source (TDS) & Billing System",
      "Profit & Loss Statements, Balance Sheets, Trial Balance",
      "E-Way Billing & GST Return Filing Overview"
    ],
    certification: "Microsoft Certified Trainer approved Tally Expert Certification"
  },
  {
    id: "msoffice",
    name: "MS Office Suite (Advanced Level)",
    category: "certification",
    duration: "3 Months (90 Days)",
    eligibility: "8th Pass onwards",
    fee: "₹2,000",
    image: "assets/images/msoffice_course.png", // Office productivity spreadsheets illustration
    shortDesc: "Master office productivity. Perfect your skills in Word mail merge, advanced Excel functions (VLOOKUP, Pivot Tables, Macros), and modern PowerPoint slides.",
    syllabus: [
      "MS Word: Advanced Formatting, Mail Merge, Hyperlinks, Multi-page Document Designs",
      "MS Excel: Formulas (SUMIF, VLOOKUP, HLOOKUP, IF, nested loops)",
      "Excel Data Analysis: Pivot Tables, Charts, Sorting, Filtering, Data Validation",
      "MS Excel Automation: Macros, VBA Basics, Dashboard Designs",
      "MS PowerPoint: Slide Masters, Visual Layouts, Animations, Transitions, Slide Shows",
      "MS Access: Database creation, table relationships, queries, forms, and report generation",
      "Outlook & Cloud Collaboration: Email scheduling, Google Drive, shared sheets"
    ],
    certification: "Office Automation Specialist Certificate"
  },
  {
    id: "typing",
    name: "Data Entry & Office Automation",
    category: "short-term",
    duration: "3 Months (90 Days)",
    eligibility: "10th Pass onwards",
    fee: "₹1,500",
    image: "assets/images/data_entry_course.png",
    shortDesc: "Master data entry speed, accuracy, and essential office automation tools. Learn touch typing, advanced Excel data entry, form filling, database management, and CPCT exam preparations.",
    syllabus: [
      "Touch-Typing technique & keyboard layout mastery (Hindi & English)",
      "Advanced data entry speed and accuracy drills",
      "Office automation tools: MS Word templates & Excel database entries",
      "Online form filling, internet browsing, and document uploading",
      "Working with PDF converters, scanners, and print commands",
      "Introduction to database management and data importing/exporting",
      "Remington Gail & Inscript layouts for govt. steno & clerical exams",
      "CPCT layout specifications & mock speed tests"
    ],
    certification: "Data Entry Operator & Office Assistant Certification"
  },
  {
    id: "programming",
    name: "Coding Master: C, C++, Java & Python",
    category: "certification",
    duration: "3 Months (90 Days)",
    eligibility: "12th Pass / College Students",
    fee: "₹4,500",
    image: "assets/images/programming_course.png", // Glow code programming matrix screen
    shortDesc: "The first coding course in Dabra. Learn basic logic building, algorithms, variables, loops, OOPs concepts, database connectivity, and build real applications.",
    syllabus: [
      "Logic Building, Flowcharts, and Algorithm Foundations",
      "C Programming: Data Types, Loops, Functions, Arrays, Pointers",
      "C++: Object-Oriented Programming (Classes, Objects, Inheritance, Polymorphism)",
      "Core Java: JVM, Exception Handling, Collections Framework, GUI basics",
      "Python: Clean syntax, scripting, data handling, modules, and API basics",
      "Data Structures Foundations: Stacks, Queues, Linked Lists",
      "Database Connectivity with MySQL/Access",
      "Small Software Development Capstone Project"
    ],
    certification: "Professional Software Developer Foundation Certificate"
  },
  {
    id: "basic",
    name: "Basic Computer & Internet Operations",
    category: "short-term",
    duration: "2 Months (60 Days)",
    eligibility: "Open to kids, students, and elders",
    fee: "₹1,200",
    image: "assets/images/basic_course.png", // Friendly internet browsing illustration
    shortDesc: "Build your digital base. Start operating computers confidently, use standard Windows features, browse the web, send emails, and secure your accounts.",
    syllabus: [
      "Introduction to Computer hardware, keyboard, and mouse operation",
      "Working with Windows OS (Control Panel, File Explorer, Settings)",
      "Accessory applications: Paint, Notepad, Wordpad",
      "Text typing basics and folder structures",
      "Web browsing safety (Chrome, Firefox) and online searches",
      "E-mail accounts management: Sending, receiving, attachments",
      "Introduction to Online Utilities: Payments, utility bills, MP Online portals",
      "Essential cyber safety & social media awareness"
    ],
    certification: "Digital Literacy Foundation Certificate"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const coursesContainer = document.querySelector('.courses-render-target');
  const courseFilterBtns = document.querySelectorAll('.courses-filter-btn');
  const courseSearchInput = document.querySelector('#course-search');
  const modal = document.querySelector('#course-modal');

  let currentActiveIndex = 0;
  let activeCoursesList = [...COURSES_DATA];

  // Load courses grid dynamically if on Courses Page or Home Page Preview
  if (coursesContainer) {
    // Check if this is the homepage preview (we render only first 6)
    const isPreview = coursesContainer.getAttribute('data-preview') === 'true';
    renderCourses(isPreview ? COURSES_DATA.slice(0, 6) : COURSES_DATA);
    
    // Wire category filtering
    courseFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        courseFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.getAttribute('data-filter');
        filterAndRender(filterVal, courseSearchInput ? courseSearchInput.value : '');
      });
    });

    // Wire live searching
    if (courseSearchInput) {
      courseSearchInput.addEventListener('input', () => {
        const activeBtn = document.querySelector('.courses-filter-btn.active');
        const filterVal = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
        filterAndRender(filterVal, courseSearchInput.value);
      });
    }
  }

  // --- Dynamic Filtering Logic ---
  function filterAndRender(category, query) {
    let filtered = COURSES_DATA;
    
    if (category !== 'all') {
      filtered = filtered.filter(c => c.category === category);
    }
    
    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.shortDesc.toLowerCase().includes(q) || 
        c.syllabus.some(s => s.toLowerCase().includes(q))
      );
    }
    
    renderCourses(filtered);
  }

  // --- HTML Rendering Engine ---
  function renderCourses(data) {
    if (data.length === 0) {
      coursesContainer.innerHTML = `
        <div class="col-span-full text-center" style="grid-column: span 3; padding: 3rem 0;">
          <h3 style="font-size: 1.5rem; color: var(--neutral-gray);">No courses found.</h3>
          <p style="color: var(--neutral-gray); margin-top: 0.5rem;">Try adjusting your filters or search keywords.</p>
        </div>
      `;
      return;
    }

    coursesContainer.innerHTML = data.map(course => {
      return `
        <div class="course-card reveal active">
          <div class="course-img-wrap">
            <span class="course-category-tag">${course.category.toUpperCase()}</span>
            <span class="course-duration-tag">${course.duration}</span>
            <img src="${course.image}" alt="${course.name}" class="course-img" style="width: 100%; height: 100%; object-fit: cover; transition: var(--transition-slow); display: block;">
          </div>
          <div class="course-content">
            <h3 class="course-title">${course.name}</h3>
            <p class="course-desc">${course.shortDesc}</p>
            <div class="course-footer" style="justify-content: flex-end;">
              <a href="#" class="course-link" data-id="${course.id}">
                Learn More 
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; display: inline; margin-left: 2px;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Rebind Modal click listeners
    const modalTriggers = coursesContainer.querySelectorAll('.course-link');
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const id = trigger.getAttribute('data-id');
        showCourseModal(id);
      });
    });
  }

  // --- Dynamic Detail Modal Controller ---
  function showCourseModal(id) {
    const course = COURSES_DATA.find(c => c.id === id);
    if (!course || !modal) return;

    const modalBox = modal.querySelector('.course-modal-box');
    modalBox.innerHTML = `
      <span class="course-modal-close">&times;</span>
      <h2 class="course-modal-title">${course.name}</h2>
      <div class="course-modal-meta">
        <span class="meta-pill">⏱️ Duration: <strong>${course.duration}</strong></span>
        <span class="meta-pill">🎓 Eligibility: <strong>${course.eligibility}</strong></span>
      </div>
      <p style="color: var(--neutral-gray); margin-bottom: 2rem; font-size: 1.05rem;">${course.shortDesc}</p>
      
      <h3 class="course-section-title">Key Syllabus Highlights</h3>
      <ul class="syllabus-list">
        ${course.syllabus.map(s => `<li>${s}</li>`).join('')}
      </ul>
      
      <h3 class="course-section-title">Certification Status</h3>
      <div style="background: var(--neutral-light); border: 1px solid var(--neutral-border); padding: 1.25rem; border-radius: var(--radius-md); font-size: 0.95rem; color: var(--neutral-darker); margin-bottom: 2.5rem; display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.5rem;">📜</span>
        <div>
          <strong>${course.certification}</strong>
          <span style="display: block; font-size: 0.8rem; color: var(--neutral-gray); margin-top: 0.25rem;">Affiliated and government recognized to secure state and national government jobs.</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="admission.html?course=${course.id}" class="btn btn-primary" style="flex: 1; text-align: center;">Enroll Now</a>
        <a href="https://wa.me/918827512123?text=Hello%20Sir%2C%20I%20want%20to%20know%20more%20about%20the%20${encodeURIComponent(course.name)}%20course%20at%20ABC%20Computer%20Centre." target="_blank" class="btn btn-secondary" style="flex: 1; text-align: center; gap: 0.5rem; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: #25D366;"><path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.122 8.122 0 0 1-1.24-4.38c0-4.49 3.65-8.15 8.15-8.15 2.18 0 4.22.85 5.75 2.38 1.53 1.53 2.38 3.57 2.38 5.75 0 4.49-3.66 8.16-8.17 8.16zm4.48-6.12c-.24-.12-1.45-.72-1.68-.8-.23-.08-.39-.12-.56.12-.17.24-.66.83-.8 1-.15.17-.29.19-.53.07-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.29.37-.43.12-.14.17-.24.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.85-.2-.5-.42-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.17.2-.59.2-1.09.14-1.19-.06-.1-.23-.17-.47-.29z"/></svg>
          Ask on WhatsApp
        </a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Wire Close Events
    const closeBtn = modal.querySelector('.course-modal-close');
    closeBtn.addEventListener('click', hideCourseModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideCourseModal();
    });
  }

  function hideCourseModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
});
