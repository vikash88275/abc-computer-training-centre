/* 
========================================================================
   ABC Computer Training Centre - Dynamic Placements Database & Filter Engine
   Developer: Antigravity
========================================================================
*/

const PLACEMENTS_DATA = [
  {
    name: "Amit Sharma",
    category: "govt",
    course: "DCA & CPCT",
    badge: "Assistant Grade-3",
    placedAt: "MP Revenue Dept.",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_1.jpg",
    quote: "Secured an Assistant Grade-3 posting in the MP Revenue Department. Vikash Sir's regular speed-typing mock tests and keyboard drills in Dabra helped me clear CPCT on my very first try!"
  },
  {
    name: "Priya Patel",
    category: "accounts",
    course: "Tally Prime & GST",
    badge: "GST Accountant",
    placedAt: "Gwalior Logistics Ltd.",
    location: "Gwalior",
    photo: "assets/images/placements/placed_student_2.jpg",
    quote: "Currently managing tax returns, billing, and balance sheets at Gwalior Logistics Ltd. Learning Tally directly under Vikash Sir's instruction made my operational fundamentals robust."
  },
  {
    name: "Sanjay Kushwah",
    category: "govt",
    course: "PGDCA & Steno",
    badge: "Civil Court Clerk",
    placedAt: "Civil Courts",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_3.jpg",
    quote: "Selected as an IT clerk at the Dabra civil courts. The Makhanlal National University diploma issued by ABC Computer Training Centre is 100% valid and verified in all govt. processes."
  },
  {
    name: "Neelesh Gupta",
    category: "it",
    course: "ADCA & Coding",
    badge: "Junior Programmer",
    placedAt: "Bhopal IT Park",
    location: "Bhopal",
    photo: "assets/images/placements/placed_student_4.jpg",
    quote: "Got selected as a junior web developer at Bhopal IT Park. The coding fundamentals in C++ and Python taught by Vikash Sir helped me clear my technical interviews effortlessly."
  },
  {
    name: "Rohit Yadav",
    category: "accounts",
    course: "DCA & Tally",
    badge: "Billing Coordinator",
    placedAt: "Wholesale Agency",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_5.jpg",
    quote: "Clearing standard vouchers and ledger books felt so natural after the extensive practice Vikash Sir gives on the terminals. Currently heading billing processes at a wholesale dealer."
  },
  {
    name: "Rahul Kushwah",
    category: "govt",
    course: "PGDCA & CPCT",
    badge: "Assistant Grade-2",
    placedAt: "MP Education Board",
    location: "Bhopal",
    photo: "assets/images/placements/placed_student_6.jpg",
    quote: "Selected as an Assistant Grade-2 officer. Regular problem-solving worksheets and deep typing assessments at ABC Computer Training Centre build unmatched confidence to clear government recruitment exams."
  },
  {
    name: "Prashant Sharma",
    category: "accounts",
    course: "Tally Prime",
    badge: "Senior Accountant",
    placedAt: "Dabra Traders",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_7.jpg",
    quote: "The practical ledger management and GST reconciliation skills taught at ABC helped me handle corporate accounts. I was placed immediately after completing Tally."
  },
  {
    name: "Rajesh Kushwah",
    category: "govt",
    course: "ITI Steno & DCA",
    badge: "Stenographer",
    placedAt: "Gwalior High Court",
    location: "Gwalior",
    photo: "assets/images/placements/placed_student_8.jpg",
    quote: "Clearing court typing tests requires extreme accuracy. Vikash Sir's specialized Remington Gail keyboard layout exercises gave me the exact edge I needed."
  },
  {
    name: "Ankit Gupta",
    category: "it",
    course: "Coding Masterclass",
    badge: "Web Developer",
    placedAt: "Tech Solutions",
    location: "Indore",
    photo: "assets/images/placements/placed_student_9.jpg",
    quote: "Learned Java and Python logical operations here. The backend and database projects I completed in the center were the highlight of my interview portfolio."
  },
  {
    name: "Deepak Sen",
    category: "accounts",
    course: "DCA & Tally",
    badge: "Tally Operator",
    placedAt: "Gwalior Steel Works",
    location: "Gwalior",
    photo: "assets/images/placements/placed_student_10.jpg",
    quote: "Managing stock data and multiple godowns configuration in Tally was made incredibly simple by the practical classroom case studies."
  },
  {
    name: "Manoj Pathak",
    category: "govt",
    course: "DCA Certificate",
    badge: "Constable Clerk",
    placedAt: "MP Police Dept.",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_11.jpg",
    quote: "My DCA diploma from ABC was recognized instantly during police department document verifications. Hands-on practice here was truly game-changing."
  },
  {
    name: "Jitendra Lodhi",
    category: "accounts",
    course: "Tally Prime",
    badge: "GST Billing Exec.",
    placedAt: "Mahadev Enterprises",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_12.jpg",
    quote: "Learned the complete tax structures, CGST/SGST ledger configurations, and billing mechanisms in detail, helping me land this retail accounts job."
  },
  {
    name: "Rakesh Rawat",
    category: "govt",
    course: "DCA & CPCT",
    badge: "Data Entry Operator",
    placedAt: "Dabra Tehsil Office",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_13.jpg",
    quote: "Got placed in the local sub-registrar office. Speed typing drills on Remington Gail keyboard layout made me clear the tests with ease."
  },
  {
    name: "Kavita Sahu",
    category: "accounts",
    course: "MS Office Advanced",
    badge: "Office Admin",
    placedAt: "Balaji Seeds Dabra",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_14.jpg",
    quote: "Mastered Excel spreadsheet formulations, mail merge operations, and presentations, which are essential for day-to-day office administration."
  },
  {
    name: "Manish Jain",
    category: "accounts",
    course: "Tally Prime & GST",
    badge: "Accounts Executive",
    placedAt: "Dabra Cotton Mill",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_15.jpg",
    quote: "Currently managing complete inventory logs and monthly GST returns filing. The practical coaching method at ABC makes you fully independent."
  },
  {
    name: "Sunil Kushwah",
    category: "govt",
    course: "DCA Diploma",
    badge: "Panchayat Secretary",
    placedAt: "MP Rural Dev.",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_16.jpg",
    quote: "The government recognized DCA diploma provided at the center helped me secure my posting as Panchayat Secretary during district counseling."
  },
  {
    name: "Arvind Baghel",
    category: "accounts",
    course: "Tally Prime ERP",
    badge: "Asst. Accountant",
    placedAt: "Shivhare Transport",
    location: "Gwalior",
    photo: "assets/images/placements/placed_student_17.jpg",
    quote: "Learned voucher systems and debit/credit note configurations. Very thankful for Vikash Sir's individual guidance model on ledger accounts."
  },
  {
    name: "Vikas Sahu",
    category: "it",
    course: "Coding Masterclass",
    badge: "Software Trainee",
    placedAt: "Indore Web Devs",
    location: "Indore",
    photo: "assets/images/placements/placed_student_18.jpg",
    quote: "The logic-building exercises and algorithms classes in C++ helped me clear programming interview rounds at Indore tech firms."
  },
  {
    name: "Sachin Yadav",
    category: "govt",
    course: "PGDCA & CPCT",
    badge: "Assistant Grade-3",
    placedAt: "MP Excise Dept.",
    location: "Gwalior",
    photo: "assets/images/placements/placed_student_19.jpg",
    quote: "Cleared both Hindi and English sections of CPCT on the first attempt due to daily speed building assessments in the laboratory."
  },
  {
    name: "Devendra Kushwah",
    category: "accounts",
    course: "Tally Prime ERP",
    badge: "Tally Specialist",
    placedAt: "Krishna Auto Parts",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_20.jpg",
    quote: "Covers standard sales transactions, returns, and inventory matching. The classroom setup simulates actual workspace environments."
  },
  {
    name: "Manoj Kushwah",
    category: "govt",
    course: "DCA & Steno",
    badge: "Court Clerk",
    placedAt: "Dabra Civil Court",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_21.jpg",
    quote: "Secured my job as clerk. Valid certificates and standard typing layouts matching government standards are the main reasons I chose ABC."
  },
  {
    name: "Dheeraj Sen",
    category: "accounts",
    course: "MS Office Advanced",
    badge: "Data Operator",
    placedAt: "Dabra Civil Hospital",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_22.jpg",
    quote: "Managing patient databases and records spreadsheets is easy. The intensive data entry drills at ABC made my speed very fast."
  },
  {
    name: "Gagan Lodhi",
    category: "it",
    course: "ADCA & Coding",
    badge: "Web Developer",
    placedAt: "Gwalior Tech Park",
    location: "Gwalior",
    photo: "assets/images/placements/placed_student_23.jpg",
    quote: "Got placed as web layout builder. Mastering HTML, CSS, and basic programming scripts directly under Vikash Sir gave me excellent skills."
  },
  {
    name: "Sandeep Jatav",
    category: "govt",
    course: "DCA Diploma",
    badge: "Office Assistant",
    placedAt: "MP Forest Dept.",
    location: "Gwalior",
    photo: "assets/images/placements/placed_student_24.jpg",
    quote: "The government verification process of DCA diploma from ABC was smooth. The institute's affiliation credentials are 100% genuine."
  },
  {
    name: "Kiran Pal",
    category: "accounts",
    course: "Tally & GST",
    badge: "Billing Manager",
    placedAt: "Dabra Fertilizers",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_25.jpg",
    quote: "Managing daily sales entries, purchase logs, and credit limits of distributors is very structured thanks to Tally Prime training."
  },
  {
    name: "Shivani Sharma",
    category: "govt",
    course: "PGDCA & CPCT",
    badge: "Assistant Grade-3",
    placedAt: "Gwalior Municipal",
    location: "Gwalior",
    photo: "assets/images/placements/placed_student_26.jpg",
    quote: "Highly recommended for competitive CPCT prep. The customized software tests in Dabra lab simulate the actual board exams."
  },
  {
    name: "Shivam Sharma",
    category: "accounts",
    course: "Tally Prime ERP",
    badge: "Junior Accountant",
    placedAt: "Garg & Associates",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_27.jpg",
    quote: "Handling tax invoices and bank ledger reconciliations with speed. The personalized coaching from Vikash Sir is simply top-notch."
  },
  {
    name: "Jyoti Rawat",
    category: "govt",
    course: "DCA Certificate",
    badge: "Revenue Asst.",
    placedAt: "MP Revenue Gwalior",
    location: "Gwalior",
    photo: "assets/images/placements/placed_student_28.jpg",
    quote: "The DCA training gave me complete computer operating expertise. Valid credentials helped secure my patwari support posting."
  },
  {
    name: "Ajay Kushwah",
    category: "accounts",
    course: "DCA & Tally",
    badge: "Inventory Head",
    placedAt: "Dabra Trading Co.",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_29.jpg",
    quote: "From basic operating to complete accounting ledgers. The course timeline is completely practical with daily hands-on machine practice."
  },
  {
    name: "Mamta Rajoria",
    category: "govt",
    course: "PGDCA Diploma",
    badge: "Clerical Assistant",
    placedAt: "MP Govt Welfare",
    location: "Bhopal",
    photo: "assets/images/placements/placed_student_30.jpg",
    objectPosition: "center 20%",
    quote: "The postgraduate diploma is widely accepted across all state ministries. It helped me land my clerical post in the ministry."
  },
  {
    name: "Sonu Sen",
    category: "it",
    course: "Coding Masterclass",
    badge: "Frontend Dev.",
    placedAt: "Bhopal IT Hub",
    location: "Bhopal",
    photo: "assets/images/placements/placed_student_31.jpg",
    quote: "Loved the coding algorithms here. The logic building exercises in JavaScript and C++ helped me clear coding interviews easily."
  },
  {
    name: "Preeti Sahu",
    category: "accounts",
    course: "Tally Prime Specialist",
    badge: "Billing Exec.",
    placedAt: "Dabra Medicals",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_32.jpg",
    quote: "Mastered medical item logs, batches, expiries, and taxation billing in Tally, securing this job immediately after my course."
  },
  {
    name: "Dinesh Yadav",
    category: "govt",
    course: "DCA & CPCT",
    badge: "Assistant Grade-3",
    placedAt: "Krishi Mandi Dabra",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_33.jpg",
    quote: "Got placed in the local mandi administration. Having solid computer steno and CPCT typing qualifications made selection rapid."
  },
  {
    name: "Pradeep Kushwah",
    category: "accounts",
    course: "Tally Prime ERP",
    badge: "Billing Assistant",
    placedAt: "Shrinath Agency",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_34.jpg",
    quote: "Extremely detailed Tally instruction covering GST returns and voucher posting, giving me perfect accounting skills."
  },
  {
    name: "Hariom Kushwah",
    category: "govt",
    course: "PGDCA Diploma",
    badge: "Clerical Post",
    placedAt: "MP Public Works",
    location: "Dabra",
    photo: "assets/images/placements/placed_student_35.jpg",
    quote: "Secured PWD clerical slot. The credentials are university recognized, valid for all competitive examinations."
  },
  {
    name: "Vijay Sharma",
    category: "it",
    course: "ADCA Diploma",
    badge: "Support Engineer",
    placedAt: "Indore Tech Hub",
    location: "Indore",
    photo: "assets/images/placements/placed_student_36.jpg",
    quote: "ADCA covers basic operating, web design, and hardware office tools. Handled technical client support queries effortlessly."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const placementContainer = document.querySelector('.placement-grid-render');
  const filterBtns = document.querySelectorAll('.placement-filter-btn');

  // Load and Render placements dynamically
  if (placementContainer) {
    renderPlacements(PLACEMENTS_DATA);

    // Categories Filtering Handler
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');
        let filteredData = PLACEMENTS_DATA;

        if (filterVal !== 'all') {
          filteredData = PLACEMENTS_DATA.filter(item => item.category === filterVal);
        }

        renderPlacements(filteredData);
      });
    });
  }

  // --- Render Cards dynamically ---
  function renderPlacements(data) {
    if (!placementContainer) return;

    if (data.length === 0) {
      placementContainer.innerHTML = `
        <div class="col-span-full text-center" style="grid-column: span 3; padding: 3rem 0;">
          <h3 style="font-size: 1.5rem; color: var(--neutral-gray);">No placement records found.</h3>
        </div>
      `;
      return;
    }

    placementContainer.innerHTML = data.map(item => {
      // Map badge color categories
      let badgeClass = "badge-primary";
      if (item.category === "accounts") badgeClass = "badge-secondary";
      if (item.category === "it") badgeClass = "badge-accent";

      return `
        <div class="highlight-card reveal active placement-item" data-category="${item.category}" style="background:var(--neutral-lighter); border: 1px solid var(--neutral-border); padding: 2rem; border-radius: var(--radius-lg); text-align: left; display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-shadow: var(--shadow-sm); transition: all var(--transition-normal);">
          <div>
            <div style="width: 100%; height: 240px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.5rem; border: 1px solid var(--neutral-border);">
              <img src="${item.photo}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover; object-position:${item.objectPosition || 'center 15%'};" loading="lazy">
            </div>
            <span class="badge ${badgeClass}" style="font-size: 0.75rem; text-transform: uppercase;">${item.badge}</span>
            <h3 style="font-size: 1.35rem; margin-top: 0.5rem; margin-bottom: 0.25rem;">${item.name}</h3>
            <p style="font-size: 0.85rem; color: var(--secondary); font-weight: 600; margin-bottom: 1rem;">Course Completed: ${item.course}</p>
            <p style="color: var(--neutral-gray); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem;">
              "${item.quote}"
            </p>
          </div>
          <div style="border-top: 1px solid var(--neutral-border); padding-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.82rem; color: var(--neutral-gray);">💼 Placed: <strong>${item.placedAt}</strong></span>
            <span style="font-size: 1.2rem;">📍 ${item.location}</span>
          </div>
        </div>
      `;
    }).join('');
  }
});
