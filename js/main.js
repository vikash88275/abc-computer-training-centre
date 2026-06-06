/* 
========================================================================
   ABC Computer Training Centre - Premium Global JS Utilities
   Developer: Antigravity
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- Global DOM Selectors ---
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const backToTopBtn = document.querySelector('.float-top');
  const revealElements = document.querySelectorAll('.reveal');

  // --- Sticky Navigation & Back To Top ---
  const handleScroll = () => {
    const scrollPos = window.scrollY;

    // Toggle Sticky Header
    if (scrollPos > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Toggle Back To Top Button
    if (scrollPos > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Dynamic Section Highlighting (Only for pages with section scrolling)
    highlightActiveSection();
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial invocation

  // Scroll to Top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Mobile Hamburger Menu Toggle ---
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Lock scroll when menu is active
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Active Link Highlighting (Matches Current HTML Filename) ---
  const highlightActiveLink = () => {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split("/").pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === pageName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  highlightActiveLink();

  // --- Scroll Active Section Highlighting ---
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      
      const targetLink = document.querySelector(`.nav-menu a[href*='index.html#${sectionId}']`) || 
                         document.querySelector(`.nav-menu a[href*='#${sectionId}']`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  }

  // --- Intersection Observer (Scroll reveals) ---
  const currentPath = window.location.pathname;
  const pageName = currentPath.split("/").pop() || 'index.html';

  if (pageName !== 'index.html' && pageName !== '') {
    // On inner pages, make content visible instantly for better UX and zero blank screens
    revealElements.forEach(el => {
      el.classList.add('active');
    });
  } else if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.05, // Trigger reveal quicker when elements enter the screen
      rootMargin: '0px 0px 80px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    revealElements.forEach(el => {
      el.classList.add('active');
    });
  }

  // --- WhatsApp & Direct Call Widget Click Tracking ---
  const whatsappBtn = document.querySelector('.float-whatsapp');
  const callBtn = document.querySelector('.float-call');

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      console.log('WhatsApp inquiry clicked');
    });
  }
  if (callBtn) {
    callBtn.addEventListener('click', () => {
      console.log('Direct call clicked');
    });
  }

  // --- Auto-sliding Hero Carousel Slider ---
  const sliderContainer = document.querySelector('.hero-slider-container');
  if (sliderContainer) {
    const wrapper = sliderContainer.querySelector('.hero-slider-wrapper');
    const slides = sliderContainer.querySelectorAll('.hero-slide');
    const prevBtn = sliderContainer.querySelector('.slider-control.prev');
    const nextBtn = sliderContainer.querySelector('.slider-control.next');
    const indicators = sliderContainer.querySelectorAll('.slider-indicators .indicator');
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 4000; // Slide every 4 seconds

    const getItemsPerView = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };

    const getMaxSlideIndex = () => {
      return slides.length - getItemsPerView();
    };

    const showSlide = (index) => {
      const maxIndex = getMaxSlideIndex();
      
      if (index > maxIndex) {
        currentSlide = 0;
      } else if (index < 0) {
        currentSlide = maxIndex;
      } else {
        currentSlide = index;
      }

      // Perform horizontal slide translate
      const itemsPerView = getItemsPerView();
      const offset = -currentSlide * (100 / itemsPerView);
      wrapper.style.transform = `translateX(${offset}%)`;

      // Update indicators active state and hide/show dynamically
      indicators.forEach((indicator, i) => {
        if (i === currentSlide) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }

        // Hide indicators that go past the max index (since they wouldn't slide further)
        if (i > maxIndex) {
          indicator.style.display = 'none';
        } else {
          indicator.style.display = 'block';
        }
      });
    };

    const nextSlide = () => {
      showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      showSlide(currentSlide - 1);
    };

    const startSlideShow = () => {
      stopSlideShow();
      slideInterval = setInterval(nextSlide, intervalTime);
    };

    const stopSlideShow = () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startSlideShow();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startSlideShow();
      });
    }

    indicators.forEach((indicator, i) => {
      indicator.addEventListener('click', () => {
        showSlide(i);
        startSlideShow();
      });
    });

    // Touch events for mobile swiping
    let startX = 0;
    sliderContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopSlideShow();
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) nextSlide();
        else prevSlide();
      }
      startSlideShow();
    }, { passive: true });

    // Recalculate positions on window resize
    window.addEventListener('resize', () => {
      showSlide(currentSlide);
    });

    // Initialize slideshow
    startSlideShow();
  }
});

