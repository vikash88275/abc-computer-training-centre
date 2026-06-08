/* 
========================================================================
   ABC Computer Training Centre - Category Filtered Lightbox Gallery Engine
   Developer: Antigravity
========================================================================
*/

const GALLERY_DATA = [
  // --- Row 1: 4 Premium Photos ---
  {
    id: 1,
    title: "Active Learning & Mentorship",
    category: "students",
    type: "image",
    image: "assets/images/media__1780286584118.jpg",
    desc: "Director Vikash Sahu MCT with dedicated students during a fast-paced coding and practical typing session inside our high-tech laboratory."
  },
  {
    id: 2,
    title: "Student Honors & Achievements",
    category: "events",
    type: "image",
    image: "assets/images/media__1780286584127.jpg",
    desc: "Celebrating milestones and honoring DCA/PGDCA academic excellence and career success under Vikash Sir's direct guidance."
  },
  {
    id: 3,
    title: "Advanced Programming Lecture",
    category: "classroom",
    type: "image",
    image: "assets/images/media__1780286584141.jpg",
    desc: "Vikash Sir explaining logical database models and coding algorithms on the whiteboard to students engaged at their respective system bays."
  },
  {
    id: 4,
    title: "Hands-on Project Guidance",
    category: "lab",
    type: "image",
    image: "assets/images/media__1780286584147.jpg",
    desc: "Practical learning sessions in progress, where concepts are immediately implemented on real-time projects with personalized mentorship."
  },
  
  // --- Row 2: 4 Premium Videos (thumbnails rendered statically from image posters) ---
  {
    id: 5,
    title: "Mentorship & Lab Practice Video",
    category: "students",
    type: "video",
    image: "assets/images/computer_lab_classroom.png",
    video: "assets/videos/student_mentorship.mp4",
    desc: "Watch Director Vikash Sahu mentoring students as they develop coding skills and logical workflows in the lab."
  },
  {
    id: 6,
    title: "Institute Facility & Lab Tour",
    category: "lab",
    type: "video",
    image: "assets/images/media__1780286584147.jpg",
    video: "assets/videos/practical_lab_tour.mp4",
    desc: "A virtual walkthrough showcasing our high-tech computer systems, spacious coaching layouts, and advanced cooling benches."
  },
  {
    id: 7,
    title: "CPCT High-Speed Typing Class",
    category: "students",
    type: "video",
    image: "assets/images/media__1780286584141.jpg",
    video: "assets/videos/typing_class_session.mp4",
    desc: "Students practicing intensive typing tutorials (Hindi & English) for state-level CPCT certifications and government jobs."
  },
  {
    id: 8,
    title: "Batch Felicitation & Awards",
    category: "events",
    type: "video",
    image: "assets/images/event_image_1.jpg",
    video: "assets/videos/certification_ceremony.mp4",
    desc: "Highlighting the award ceremony honoring top performing accounting students and certification distributions."
  },
  {
    id: 9,
    title: "Institute Location Route Video",
    category: "events",
    type: "video",
    image: "assets/images/basics_image_1.jpg",
    video: "assets/videos/map_video.mp4",
    desc: "A video guide showing the route and entrance details of ABC Computer Training Centre in Kamleshwar Colony."
  },
  {
    id: 10,
    title: "Lab Location Guidance Tour",
    category: "lab",
    type: "video",
    image: "assets/images/basics_image_2.jpg",
    video: "assets/videos/a.mp4",
    desc: "Watch a video tour showing the lab facilities and landmark guidance near the institute."
  },
  {
    id: 11,
    title: "Students Lab Check-in",
    category: "students",
    type: "video",
    image: "assets/images/basics_image_3.jpg",
    video: "assets/videos/video_2026-06-05_17-30-51.mp4",
    desc: "Real-time walkthrough of students arriving and checking into their designated computer systems for practical classes."
  },
  {
    id: 12,
    title: "Student Entrance Guidance",
    category: "students",
    type: "video",
    image: "assets/images/basics_image_4.jpg",
    video: "assets/videos/video_2026-06-05_17-31-02.mp4",
    desc: "Entrance walk showing students standard check-in points and facilities."
  },
  {
    id: 13,
    title: "Lab Equipment & Infrastructure",
    category: "lab",
    type: "video",
    image: "assets/images/basics_image_5.jpg",
    video: "assets/videos/video_2026-06-05_17-31-31.mp4",
    desc: "Walkthrough displaying our laboratory equipment, seating capacity, and individual workstations."
  },
  {
    id: 15,
    title: "Logic & Algorithm Lectures",
    category: "classroom",
    type: "image",
    image: "assets/images/media__1780219504885.jpg",
    desc: "Interactive whiteboard session explaining computer programming logic, database designs, and syntax structures."
  },
  {
    id: 16,
    title: "CPCT & Steno Group Theory",
    category: "classroom",
    type: "image",
    image: "assets/images/media__1780219504890.jpg",
    desc: "Classroom lecture preparing students for government steno exam syllabus, keyboard theory, and shorthand fundamentals."
  },
  {
    id: 17,
    title: "Accounting & GST Classes",
    category: "classroom",
    type: "image",
    image: "assets/images/media__1780219504898.jpg",
    desc: "Whiteboard session illustrating financial accounting ledgers, Tally Prime configuration, and taxation structures."
  },
  {
    id: 18,
    title: "Student Certification Felicitation",
    category: "events",
    type: "image",
    image: "assets/images/event_image_1.jpg",
    desc: "Director Vikash Sahu presenting certification awards to students for successful completion of their computer training courses."
  },
  {
    id: 19,
    title: "DCA & PGDCA Batch Celebration",
    category: "events",
    type: "image",
    image: "assets/images/event_image_2.jpg",
    desc: "A group of successful students celebrating their academic milestones and diploma awards under our faculty's mentorship."
  },
  {
    id: 20,
    title: "Honoring Career Achievers",
    category: "events",
    type: "image",
    image: "assets/images/event_image_3.jpg",
    desc: "Celebrating students who successfully cleared competitive government typing exams and secured clerical postings."
  },
  {
    id: 21,
    title: "Interactive Alumni Gathering",
    category: "events",
    type: "image",
    image: "assets/images/event_image_4.jpg",
    desc: "Former students returning to share their corporate work experience and guide the new batches in career planning."
  },
  {
    id: 22,
    title: "CPCT Certification Ceremony",
    category: "events",
    type: "image",
    image: "assets/images/event_image_5.jpg",
    desc: "Congratulating our students who passed the high-speed Remington typing exam for MP government clerk jobs."
  },
  {
    id: 23,
    title: "Batch Completion Felicitation",
    category: "events",
    type: "image",
    image: "assets/images/event_image_6.jpg",
    desc: "Felicitation ceremony highlighting the hard work, regular lab attendance, and success of our computer students."
  },
  {
    id: 24,
    title: "Special Academic Guidance Session",
    category: "events",
    type: "image",
    image: "assets/images/event_image_7.jpg",
    desc: "Special seminar by Vikash Sir discussing exam strategies for upcoming Makhanlal University DCA/PGDCA board tests."
  },
  {
    id: 25,
    title: "Career & Placement Seminar",
    category: "events",
    type: "image",
    image: "assets/images/event_image_8.jpg",
    desc: "Seminar detailing steno, accountancy, and coding job opportunities available across government and private sectors."
  },
  {
    id: 26,
    title: "Institute Foundation Celebration",
    category: "events",
    type: "image",
    image: "assets/images/event_image_9.jpg",
    desc: "Celebrating years of educational integrity, student excellence, and technical empowerment in the Dabra community."
  },
  {
    id: 27,
    title: "Student Farewell & Success Meet",
    category: "events",
    type: "image",
    image: "assets/images/event_image_10.jpg",
    desc: "Farewell batch meet celebrating completed courses and welcoming student entries into their respective career paths."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.querySelector('.gallery-render-target');
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const lightbox = document.querySelector('#lightbox');
  
  let currentActiveIndex = 0;
  let activeGalleryList = [...GALLERY_DATA];

  // Initialize Gallery rendering if grid exists
  if (galleryGrid) {
    const isTeaser = galleryGrid.getAttribute('data-teaser') === 'true';
    activeGalleryList = isTeaser ? GALLERY_DATA.slice(0, 4) : GALLERY_DATA;
    
    renderGallery(activeGalleryList);

    // Filter Buttons
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');
        if (filterVal === 'all') {
          activeGalleryList = GALLERY_DATA;
        } else {
          activeGalleryList = GALLERY_DATA.filter(item => item.category === filterVal);
        }
        
        renderGallery(activeGalleryList);
      });
    });
  }

  function renderGallery(items) {
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = items.map((item, idx) => `
      <div class="gallery-item reveal active" data-index="${idx}">
        <div class="gallery-img-box">
          ${item.type === 'video' ? `
            <img src="${item.image}" alt="${item.title}" class="gallery-poster-fallback" loading="lazy">
            <video src="${item.video}#t=0.5" muted playsinline preload="metadata" class="gallery-video-preview" style="display: none; width: 100%; height: 100%; object-fit: cover; transition: var(--transition-slow);"></video>
            <div class="video-play-indicator">
              <svg viewBox="0 0 24 24" style="width: 28px; height: 28px; fill: white;"><path d="M8 5v14l11-7z"/></svg>
            </div>
          ` : `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          `}
        </div>
        <div class="gallery-overlay">
          <span>${item.type.toUpperCase()} / ${item.category.toUpperCase()}</span>
          <h3>${item.title}</h3>
        </div>
      </div>
    `).join('');

    // Attach load listener for video previews (shows real video frame on desktop, keeps image poster on mobile)
    const previews = galleryGrid.querySelectorAll('.gallery-video-preview');
    previews.forEach(vid => {
      if (vid.readyState >= 2) {
        vid.style.display = 'block';
        if (vid.previousElementSibling) vid.previousElementSibling.style.display = 'none';
      } else {
        vid.addEventListener('loadeddata', () => {
          vid.style.display = 'block';
          if (vid.previousElementSibling) vid.previousElementSibling.style.display = 'none';
        });
      }
    });

    // Attach lightbox triggers
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
    galleryItems.forEach(el => {
      el.addEventListener('click', () => {
        const index = parseInt(el.getAttribute('data-index'), 10);
        openLightbox(index);
      });
    });
  }

  // --- Lightbox Engine ---
  function openLightbox(index) {
    if (!lightbox) return;

    currentActiveIndex = index;
    updateLightboxContent();

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hook events
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    closeBtn.onclick = closeLightbox;
    prevBtn.onclick = showPrev;
    nextBtn.onclick = showNext;

    // Keyboard controls
    document.onkeydown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    // Close on background click
    lightbox.onclick = (e) => {
      if (e.target === lightbox) closeLightbox();
    };
  }

  function updateLightboxContent() {
    const item = activeGalleryList[currentActiveIndex];
    if (!item) return;

    const lightboxImgBox = lightbox.querySelector('.lightbox-content');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');

    if (item.type === 'video') {
      lightboxImgBox.innerHTML = `
        <video controls autoplay playsinline webkit-playsinline style="width: 100%; max-height: 75vh; display: block; background: #000; outline: none; border-radius: var(--radius-sm);">
          <source src="${item.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
      
      const vid = lightboxImgBox.querySelector('video');
      if (vid) {
        // Safe play sequence with fallback
        setTimeout(() => {
          try {
            const playPromise = vid.play();
            if (playPromise !== undefined && typeof playPromise.then === 'function') {
              playPromise.catch((err) => {
                console.warn("Unmuted autoplay blocked. Retrying muted...", err);
                vid.muted = true;
                const retryPromise = vid.play();
                if (retryPromise !== undefined && typeof retryPromise.then === 'function') {
                  retryPromise.catch((err2) => {
                    console.error("Muted autoplay also blocked:", err2);
                  });
                }
              });
            }
          } catch (e) {
            console.error("Autoplay script error caught:", e);
          }
        }, 100);
      }
    } else {
      lightboxImgBox.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
      `;
    }
    
    lightboxTitle.innerHTML = `
      <strong>${item.title}</strong>
      <p style="font-size: 0.85rem; color: #94A3B8; margin-top: 0.25rem;">${item.desc}</p>
    `;
  }

  function showPrev() {
    currentActiveIndex = (currentActiveIndex - 1 + activeGalleryList.length) % activeGalleryList.length;
    updateLightboxContent();
  }

  function showNext() {
    currentActiveIndex = (currentActiveIndex + 1) % activeGalleryList.length;
    updateLightboxContent();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    document.onkeydown = null;
    
    // Stop video immediately by clearing lightbox content
    const lightboxImgBox = lightbox.querySelector('.lightbox-content');
    if (lightboxImgBox) lightboxImgBox.innerHTML = '';
  }
});
