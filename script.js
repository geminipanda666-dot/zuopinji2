/**
 * Animation and Film Portfolio - Homepage Script
 * Coordinates Apple TV+ carousel switching, horizontal shelf scrolling, and scroll-nav updates.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hide Loader after small delay
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('opacity-0');
      setTimeout(() => loader.remove(), 700);
    }, 500);
  }

  // 2. Fetch Projects database
  const projects = window.portfolioProjects || [];
  if (!projects.length) {
    console.error('Portfolio projects database not loaded or empty.');
    return;
  }

  // Find Featured subset for hero-dots
  const featuredWorks = projects.filter(p => p.group === 'Featured Works');

  // Let's set initial Hero state to the first Featured Work
  let currentHeroProject = featuredWorks[0] || projects[0];

  // 3. Initialize Hero UI
  initHero(currentHeroProject);
  renderCarouselDots(featuredWorks, currentHeroProject.id);

  // 4. Render Horizontal Shelves
  renderShelf(projects, 'Featured Works', 'scroller-featured');

  // Mark initial active card
  highlightActiveCard(currentHeroProject.id);

  // 5. Header Scroll Interaction
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 6. Smooth anchor scrolling for header items
  document.querySelectorAll('header nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = header.offsetHeight;
          let targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
          if (targetId === '#hero-section') {
            targetPosition = 0;
          }
          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
          });
          
          // Temporary immediate style update before scroll spy fires
          document.querySelectorAll('header nav a').forEach(a => {
            a.classList.remove('active');
            a.classList.add('text-white/50');
            a.classList.remove('text-white');
          });
          this.classList.add('active');
          this.classList.remove('text-white/50');
          this.classList.add('text-white');
        }
      }
    });
  });

  // 7. Initialize Interactive Widescreen Showcase Instances
  initGenericShowcase({
    player: 'widescreen-video-1',
    cover: 'widescreen-cover-1',
    playBtn: 'widescreen-play-btn-1',
    title: 'widescreen-title-1',
    desc: 'widescreen-desc-1',
    overlay: 'widescreen-overlay-1',
    info: 'widescreen-info-1',
    cardsSelector: '.switcher-card-1',
    switcherContainer: 'switcher-container-1',
    gal1: 'gallery-img-1-1',
    gal2: 'gallery-img-1-2',
    gal3: 'gallery-img-1-3',
    gal4: 'gallery-img-1-4'
  });

  initGenericShowcase({
    player: 'widescreen-video-2',
    cover: 'widescreen-cover-2',
    playBtn: 'widescreen-play-btn-2',
    title: 'widescreen-title-2',
    desc: 'widescreen-desc-2',
    overlay: 'widescreen-overlay-2',
    info: 'widescreen-info-2',
    cardsSelector: '.switcher-card-2',
    switcherContainer: 'switcher-container-2',
    gal1: 'gallery-img-2-1',
    gal2: 'gallery-img-2-2',
    gal3: 'gallery-img-2-3',
    gal4: 'gallery-img-2-4'
  });

  initGenericShowcase({
    player: 'widescreen-video-3',
    cover: 'widescreen-cover-3',
    playBtn: 'widescreen-play-btn-3',
    title: 'widescreen-title-3',
    desc: 'widescreen-desc-3',
    overlay: 'widescreen-overlay-3',
    info: 'widescreen-info-3',
    cardsSelector: '.switcher-card-3',
    switcherContainer: 'switcher-container-3',
    gal1: 'gallery-img-3-1',
    gal2: 'gallery-img-3-2',
    gal3: 'gallery-img-3-3',
    gal4: 'gallery-img-3-4'
  });

  // --- 8. Storyboards Section Initialization (第五页) ---
  const storyboards = window.portfolioSections?.storyboards || [];
  const storyboardMainImg = document.getElementById('storyboard-main-img');
  const storyboardFilmstrip = document.getElementById('storyboard-filmstrip');
  const storyboardProjectList = document.getElementById('storyboard-project-list');
  const storyboardCount = document.getElementById('storyboard-count');

  if (storyboards.length && storyboardMainImg && storyboardFilmstrip && storyboardProjectList) {
    let activeProjIndex = 0;
    let activeFrameIndex = 0;

    const updateStoryboardUI = () => {
      const proj = storyboards[activeProjIndex];
      if (!proj || !proj.images || !proj.images.length) return;
      if (activeFrameIndex >= proj.images.length) {
        activeFrameIndex = 0;
      }
      storyboardMainImg.src = proj.images[activeFrameIndex];
      storyboardCount.textContent = `${String(activeFrameIndex + 1).padStart(2, '0')} / ${String(proj.images.length).padStart(2, '0')}`;

      // Render filmstrip thumbnails (preserves grid column slot sizing without stretching)
      storyboardFilmstrip.innerHTML = '';
      proj.images.forEach((imgSrc, i) => {
        const thumb = document.createElement('div');
        thumb.className = `filmstrip-thumb aspect-[16/9] border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${i === activeFrameIndex ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${imgSrc}" class="w-full h-full object-cover select-none" alt="Frame ${i+1}">`;
        thumb.addEventListener('click', () => {
          activeFrameIndex = i;
          updateStoryboardUI();
        });
        storyboardFilmstrip.appendChild(thumb);
      });

      // Render directory list (4 storyboard projects)
      storyboardProjectList.innerHTML = '';
      storyboards.forEach((p, idx) => {
        const btn = document.createElement('button');
        btn.className = `storyboard-project-btn ${idx === activeProjIndex ? 'active' : ''}`;
        btn.innerHTML = `
          <span>${p.title}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-40"><path d="m9 18 6-6-6-6"/></svg>
        `;
        btn.addEventListener('click', () => {
          activeProjIndex = idx;
          activeFrameIndex = 0;
          updateStoryboardUI();
        });
        storyboardProjectList.appendChild(btn);
      });
    };

    updateStoryboardUI();

    // Click on main image opens the Lightbox
    document.getElementById('storyboard-main-container').addEventListener('click', () => {
      const proj = storyboards[activeProjIndex];
      openLightbox(proj.images, activeFrameIndex, proj.title);
    });
  }

  // --- 9. Visual Studies Section Initialization (第六页) ---
  const visualStudies = window.portfolioSections?.visualStudies || [];
  const vsMainImg = document.getElementById('visual-studies-main-img');
  const vsMainContainer = document.getElementById('visual-studies-main-container');
  const vsSecondaryGrid = document.getElementById('visual-studies-secondary-grid');
  const vsScroller = document.getElementById('visual-studies-scroller');

  if (visualStudies.length && vsMainImg && vsSecondaryGrid && vsScroller) {
    let activeIndex = 0;

    const updateVisualStudiesUI = () => {
      const activeItem = visualStudies[activeIndex];
      vsMainImg.src = activeItem.src;
      vsMainImg.alt = activeItem.alt;

      // Toggle white sketch styling dynamically to respect user's aesthetic rules
      if (activeItem.isWhiteSketch) {
        vsMainContainer.classList.add('white-sketch-container');
      } else {
        vsMainContainer.classList.remove('white-sketch-container');
      }

      // Render 2x2 Grid of secondary images (excluding the active one, choosing exactly 4)
      vsSecondaryGrid.innerHTML = '';
      const secondaryItems = visualStudies.filter((_, idx) => idx !== activeIndex).slice(0, 4);
      secondaryItems.forEach((item) => {
        const actualIdx = visualStudies.findIndex(vs => vs.id === item.id);
        const card = document.createElement('div');
        const isWhite = item.isWhiteSketch;
        card.className = `aspect-[16/9] w-full rounded-xl overflow-hidden bg-zinc-950/80 border border-white/5 relative group cursor-pointer transition-all duration-300 hover:border-white/20 hover:scale-[1.01] ${isWhite ? 'p-2.5 bg-[#121212] border-white/10' : ''}`;
        
        card.innerHTML = `
          <img src="${item.thumbnail}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 ${isWhite ? 'object-contain bg-[#ededed] rounded-sm' : ''}" alt="${item.alt}">
          <div class="absolute inset-0 bg-black/30 group-hover:bg-black/5 transition-colors duration-300"></div>
          <div class="absolute bottom-2.5 left-3.5 right-3.5 text-[9px] font-mono tracking-wide text-white/40 truncate opacity-0 group-hover:opacity-100 transition-opacity">
            SWAP TO MAIN
          </div>
        `;
        card.addEventListener('click', () => {
          activeIndex = actualIdx;
          updateVisualStudiesUI();
        });
        vsSecondaryGrid.appendChild(card);
      });

      // Render horizontal track (all 6 items)
      vsScroller.innerHTML = '';
      visualStudies.forEach((item, idx) => {
        const thumb = document.createElement('div');
        const isActive = idx === activeIndex;
        const isWhite = item.isWhiteSketch;
        thumb.className = `flex-shrink-0 w-[180px] sm:w-[220px] aspect-[16/9] rounded-xl overflow-hidden bg-zinc-950/80 border cursor-pointer transition-all duration-300 ${isActive ? 'border-white/50 scale-[1.02] opacity-100' : 'border-white/5 opacity-50 hover:opacity-85'} ${isWhite ? 'p-1.5 bg-[#121212]' : ''}`;
        thumb.innerHTML = `
          <img src="${item.thumbnail}" class="w-full h-full object-cover ${isWhite ? 'object-contain bg-[#ededed] rounded-sm' : ''}" alt="${item.alt}">
        `;
        thumb.addEventListener('click', () => {
          activeIndex = idx;
          updateVisualStudiesUI();
        });
        vsScroller.appendChild(thumb);
      });
    };

    updateVisualStudiesUI();
  }

  // --- 10. Hand Drawings Section Initialization (第七页) ---
  const handDrawings = window.portfolioSections?.handDrawings || [];
  const hdScroller = document.getElementById('hand-drawing-scroller');

  if (handDrawings.length && hdScroller) {
    const hdImgLarge = document.getElementById('hd-featured-img-large');
    const hdImgSmall1 = document.getElementById('hd-featured-img-small-1');
    const hdImgSmall2 = document.getElementById('hd-featured-img-small-2');

    if (hdImgLarge && handDrawings[0]) hdImgLarge.src = handDrawings[0].src;
    if (hdImgSmall1 && handDrawings[1]) hdImgSmall1.src = handDrawings[1].src;
    if (hdImgSmall2 && handDrawings[2]) hdImgSmall2.src = handDrawings[2].src;

    // Render remaining items inside horizontal scroller (indices 3, 4, 5)
    hdScroller.innerHTML = '';
    const remainingDrawings = handDrawings.slice(3);
    remainingDrawings.forEach((item, index) => {
      const idxInAll = index + 3;
      const thumb = document.createElement('div');
      thumb.className = `flex-shrink-0 w-[240px] sm:w-[280px] aspect-[16/9] rounded-xl overflow-hidden bg-zinc-950 border border-white/5 cursor-zoom-in group relative transition-all duration-300 hover:border-white/20 hover:scale-[1.01]`;
      thumb.innerHTML = `
        <img src="${item.thumbnail}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" alt="${item.alt}">
        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
      `;
      thumb.addEventListener('click', () => {
        openLightbox(handDrawings.map(hd => hd.src), idxInAll, handDrawings[idxInAll].alt);
      });
      hdScroller.appendChild(thumb);
    });

    // Attach Lightbox on featured items
    document.querySelectorAll('.hand-drawing-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'), 10);
        if (!isNaN(index) && handDrawings[index]) {
          openLightbox(handDrawings.map(hd => hd.src), index, handDrawings[index].alt);
        }
      });
    });
  }

  // --- 11. Global Lightbox Engine ---
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxIndex = document.getElementById('lightbox-index');
  const lightboxTitle = document.getElementById('lightbox-title');

  let lightboxImagesList = [];
  let currentLightboxIdx = 0;
  let lightboxBaseTitle = '';

  const openLightbox = (imagesList, startIndex, baseTitle = '') => {
    if (!imagesList || !imagesList.length) return;
    lightboxImagesList = imagesList;
    currentLightboxIdx = startIndex;
    lightboxBaseTitle = baseTitle;

    updateLightboxContent();

    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Stop page scroll
  };

  const closeLightbox = () => {
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');
    document.body.style.overflow = ''; // Restore page scroll
  };

  const updateLightboxContent = () => {
    const src = lightboxImagesList[currentLightboxIdx];
    lightboxImg.src = src;
    lightboxIndex.textContent = `FRAME ${String(currentLightboxIdx + 1).padStart(2, '0')} / ${String(lightboxImagesList.length).padStart(2, '0')}`;
    lightboxTitle.textContent = lightboxBaseTitle;

    if (lightboxImagesList.length <= 1) {
      lightboxPrev.classList.add('hidden');
      lightboxNext.classList.add('hidden');
    } else {
      lightboxPrev.classList.remove('hidden');
      lightboxNext.classList.remove('hidden');
    }
  };

  const nextLightboxImage = () => {
    if (!lightboxImagesList.length) return;
    currentLightboxIdx = (currentLightboxIdx + 1) % lightboxImagesList.length;
    updateLightboxContent();
  };

  const prevLightboxImage = () => {
    if (!lightboxImagesList.length) return;
    currentLightboxIdx = (currentLightboxIdx - 1 + lightboxImagesList.length) % lightboxImagesList.length;
    updateLightboxContent();
  };

  if (lightboxModal && lightboxClose && lightboxPrev && lightboxNext) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevLightboxImage);
    lightboxNext.addEventListener('click', nextLightboxImage);

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (lightboxModal.classList.contains('hidden')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      }
    });
  }

  // --- 13. Scroll Spy Navigation Support ---
  const navLinks = document.querySelectorAll('header nav a');
  const sections = Array.from(navLinks).map(link => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      return document.querySelector(targetId);
    }
    return null;
  }).filter(Boolean);

  const updateScrollSpy = () => {
    const scrollPosition = window.scrollY + 140;
    let activeSectionId = '';
    
    for (let i = 0; i < sections.length; i++) {
      const currentSection = sections[i];
      const nextSection = sections[i + 1];
      const top = currentSection.offsetTop;
      const bottom = nextSection ? nextSection.offsetTop : document.documentElement.scrollHeight;
      
      if (scrollPosition >= top - 60 && scrollPosition < bottom - 60) {
        activeSectionId = '#' + currentSection.getAttribute('id');
        break;
      }
    }

    if (window.scrollY < 100 && sections.length) {
      activeSectionId = '#' + sections[0].getAttribute('id');
    }

    if (activeSectionId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === activeSectionId) {
          link.classList.add('active');
          link.classList.remove('text-white/50');
          link.classList.add('text-white');
        } else {
          link.classList.remove('active');
          link.classList.add('text-white/50');
          link.classList.remove('text-white');
        }
      });
    }
  };

  window.addEventListener('scroll', updateScrollSpy);
  updateScrollSpy(); // Trigger initial state
  
  // 14. Initialize Profile & Contact Section
  initProfile();
});

/**
 * Initialize Hero display fields on load
 */
function initHero(project) {
  const bg1 = document.getElementById('hero-bg-1');
  const bg2 = document.getElementById('hero-bg-2');
  const titleLogo = document.getElementById('hero-title-logo');
  const category = document.getElementById('hero-category');
  const year = document.getElementById('hero-year');
  const duration = document.getElementById('hero-duration');
  const description = document.getElementById('hero-description');
  const ctaBtn = document.getElementById('hero-cta-btn');
  const role = document.getElementById('hero-role');

  if (bg1) bg1.src = project.heroImage;
  if (bg2) bg2.src = project.heroImage;
  
  if (titleLogo) {
    titleLogo.style.display = '';
    titleLogo.src = project.titleLogo;
    titleLogo.alt = project.titleText;
  }
  if (category) category.textContent = project.category;
  if (year) year.textContent = project.year;
  if (duration) duration.textContent = project.duration;
  if (description) description.textContent = project.description;
  if (ctaBtn) {
    ctaBtn.href = project.detailUrl;
    ctaBtn.setAttribute('data-id', project.id);
  }
  if (role) role.textContent = project.role;
}

/**
 * Render Carousel Rounded Dots for the Featured subset
 */
function renderCarouselDots(featuredProjects, activeId) {
  const container = document.getElementById('hero-carousel-dots');
  if (!container) return;

  container.innerHTML = '';
  featuredProjects.forEach((proj, index) => {
    const dot = document.createElement('button');
    dot.className = `dot-indicator h-2.5 w-2.5 rounded-full bg-white/20 hover:bg-white/50 cursor-pointer transition-all duration-300 ${proj.id === activeId ? 'active bg-white w-7' : ''}`;
    dot.setAttribute('title', proj.titleText);
    dot.addEventListener('click', () => {
      // Trigger smooth transition
      switchHero(proj.id);
    });
    container.appendChild(dot);
  });
}

/**
 * Renders a horizontal film shelf using the projects array
 */
function renderShelf(projects, groupName, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const shelfProjects = projects.filter(p => p.group === groupName);
  
  container.innerHTML = '';
  shelfProjects.forEach(proj => {
    const card = document.createElement('div');
    card.className = `project-card flex-shrink-0 w-[280px] h-[158px] rounded-xl overflow-hidden relative border border-white/5 bg-zinc-900 group`;
    card.setAttribute('data-card-id', proj.id);

    // Build card content
    card.innerHTML = `
      <img src="${proj.coverImage}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none" alt="${proj.titleText}" loading="lazy">
      <!-- cover shading gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-90 transition-opacity group-hover:opacity-75 pointer-events-none"></div>
      
      <!-- card footer specs -->
      <div class="absolute bottom-3 left-4 right-4 flex flex-col pointer-events-none">
        <span class="text-xs font-semibold text-white/90 truncate group-hover:text-white transition-colors">${proj.titleText}</span>
        <div class="flex items-center gap-2 mt-1 text-[9px] font-mono uppercase tracking-widest text-white/40">
          <span>${proj.tags[0] || 'CG'}</span>
          <span class="w-1 h-1 rounded-full bg-white/20"></span>
          <span>${proj.year}</span>
        </div>
      </div>
    `;

    // Click handler to update Hero section
    card.addEventListener('click', (e) => {
      // Switch the hero banner contents
      switchHero(proj.id);
    });

    container.appendChild(card);
  });

  // Enable trackpad horizontal drag / scroll helper
  container.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}

/**
 * Highlight the currently active card across all shelves
 */
function highlightActiveCard(id) {
  document.querySelectorAll('.project-card').forEach(card => {
    const cardId = card.getAttribute('data-card-id');
    if (cardId === id) {
      card.classList.add('active-hero');
    } else {
      card.classList.remove('active-hero');
    }
  });
}

/**
 * Transition Hero Banner content smoothly with crossfading preloading
 */
function switchHero(projectId) {
  const projects = window.portfolioProjects || [];
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  const bg1 = document.getElementById('hero-bg-1');
  const bg2 = document.getElementById('hero-bg-2');
  const titleLogo = document.getElementById('hero-title-logo');
  const titleWrapper = document.getElementById('hero-title-wrapper');
  const category = document.getElementById('hero-category');
  const year = document.getElementById('hero-year');
  const duration = document.getElementById('hero-duration');
  const description = document.getElementById('hero-description');
  const ctaBtn = document.getElementById('hero-cta-btn');
  const role = document.getElementById('hero-role');

  if (!bg1 || !bg2) return;

  // 1. Temporarily dim Hero text elements with simple scale down
  const textElements = [
    titleWrapper, 
    category && category.parentElement && !category.parentElement.classList.contains('hidden') ? category.parentElement : null, 
    description, 
    ctaBtn ? ctaBtn.parentElement : null, 
    role && role.parentElement && !role.parentElement.classList.contains('hidden') ? role.parentElement : null
  ].filter(Boolean);
  textElements.forEach(el => {
    if (el) {
      el.style.opacity = '0.1';
      el.style.transform = 'translateY(6px)';
      el.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  });

  // 2. Perform crossfade calculation
  const activeBg = (window.getComputedStyle(bg1).opacity === '1') ? bg1 : bg2;
  const nextBg = (activeBg === bg1) ? bg2 : bg1;

  let applied = false;
  const applySwitch = () => {
    if (applied) return;
    applied = true;

    nextBg.src = project.heroImage;
    activeBg.style.opacity = '0';
    nextBg.style.opacity = '1';

    // 3. Update the data once crossfade starts
    setTimeout(() => {
      if (titleLogo) {
        titleLogo.style.display = '';
        titleLogo.src = project.titleLogo;
        titleLogo.alt = project.titleText;
      }
      if (category) category.textContent = project.category;
      if (year) year.textContent = project.year;
      if (duration) duration.textContent = project.duration;
      if (description) description.textContent = project.description;
      if (ctaBtn) {
        ctaBtn.href = project.detailUrl;
        ctaBtn.setAttribute('data-id', project.id);
      }
      if (role) role.textContent = project.role;

      // 4. Fade text elements back in
      textElements.forEach(el => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });

      // Highlight the active card inside sliders
      highlightActiveCard(project.id);

      // Re-highlight the carousel indicators
      const featuredWorks = projects.filter(p => p.group === 'Featured Works');
      renderCarouselDots(featuredWorks, project.id);
    }, 120);
  };

  // Preload next image, but fallback to immediate update if cached or network delay
  const img = new Image();
  img.onload = applySwitch;
  img.onerror = applySwitch;
  img.src = project.heroImage;
  if (img.complete) {
    applySwitch();
  }
  setTimeout(applySwitch, 150);
}

/**
 * Handle horizontal scroll buttons for project shelves
 */
window.scrollShelf = function(scrollerId, direction) {
  const scroller = document.getElementById(scrollerId);
  if (!scroller) return;

  const scrollAmount = 450;
  if (direction === 'left') {
    scroller.scrollLeft -= scrollAmount;
  } else {
    scroller.scrollLeft += scrollAmount;
  }
};

/**
 * Setup Interactive Widescreen 16:9 Showcase Player (Generic Version)
 */
function initGenericShowcase(config) {
  const player = document.getElementById(config.player);
  const cover = document.getElementById(config.cover);
  const playBtn = document.getElementById(config.playBtn);
  const title = document.getElementById(config.title);
  const desc = document.getElementById(config.desc);
  const overlay = document.getElementById(config.overlay);
  const info = document.getElementById(config.info);
  const cards = Array.from(document.querySelectorAll(config.cardsSelector));
  const gal1 = document.getElementById(config.gal1);
  const gal2 = document.getElementById(config.gal2);
  const gal3 = document.getElementById(config.gal3);
  const gal4 = document.getElementById(config.gal4);

  if (!player || !cover || !playBtn || !title || !cards.length) return;

  let currentIndex = 0;
  let activeVideoUrl = cards[0].getAttribute('data-video');

  // Activate specific card by index
  function activateCard(index, smoothScroll = true) {
    if (index < 0 || index >= cards.length) return;
    currentIndex = index;
    const card = cards[currentIndex];

    // 1. Reset all cards styling within this set
    cards.forEach((c, idx) => {
      const badge = c.querySelector('span');
      if (idx === currentIndex) {
        c.classList.remove('border-transparent');
        c.classList.add('border-white/95');
        if (badge) {
          badge.classList.remove('text-white/50');
          badge.classList.add('text-[#ff3b30]');
        }
      } else {
        c.classList.remove('border-white/95');
        c.classList.add('border-transparent');
        if (badge) {
          badge.classList.remove('text-[#ff3b30]');
          badge.classList.add('text-white/50');
        }
      }
    });

    // 2. Stop currently playing video, reset view
    player.pause();
    player.classList.add('hidden');
    player.removeAttribute('controls');
    
    cover.classList.remove('hidden');
    playBtn.classList.remove('hidden');
    if (overlay) overlay.classList.remove('opacity-0');
    if (info) info.classList.remove('opacity-0');

    // 3. Update player content
    const cardTitle = card.getAttribute('data-title');
    const cardDesc = card.getAttribute('data-desc');
    const cardCover = card.getAttribute('data-cover');
    activeVideoUrl = card.getAttribute('data-video');

    title.textContent = cardTitle;
    if (desc) desc.textContent = cardDesc;
    cover.src = cardCover;

    // 4. Update gallery thumbs
    const g1 = card.getAttribute('data-gallery-1');
    const g2 = card.getAttribute('data-gallery-2');
    const g3 = card.getAttribute('data-gallery-3');
    const g4 = card.getAttribute('data-gallery-4');
    if (gal1 && g1) gal1.src = g1;
    if (gal2 && g2) gal2.src = g2;
    if (gal3 && g3) gal3.src = g3;
    if (gal4 && g4) gal4.src = g4;

    // 5. Scroll active card smoothly into visible area
    if (smoothScroll && card.scrollIntoView) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }

  // Add click listeners to switcher cards
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      activateCard(idx);
    });
  });

  // Helper to smoothly scroll the window viewport without stutter or delay
  const scrollWindowBy = (deltaY) => {
    window.scrollBy({
      top: deltaY,
      left: 0,
      behavior: 'auto'
    });
  };

  // Helper to normalize deltaY across various browsers and input devices
  const getNormalizedDeltaY = (e) => {
    let dy = e.deltaY;
    if (e.deltaMode === 1) {
      // DOM_DELTA_LINE (Firefox default for mouse wheel)
      dy *= 33;
    } else if (e.deltaMode === 2) {
      // DOM_DELTA_PAGE
      dy *= window.innerHeight;
    }
    return dy;
  };

  // Enable mouse wheel vertical scrolling to switch cards
  const switcherContainer = config.switcherContainer
    ? document.getElementById(config.switcherContainer)
    : (cards[0] ? cards[0].parentElement : null);

  if (switcherContainer) {
    let isWheelThrottled = false;
    let accumulatedDeltaY = 0;
    let inBoundaryCooldown = false;
    let boundaryCooldownTimer = null;

    switcherContainer.addEventListener('wheel', (e) => {
      const rawDy = getNormalizedDeltaY(e);
      if (Math.abs(rawDy) < 0.5) return;

      const isScrollingDown = rawDy > 0;
      const isScrollingUp = rawDy < 0;

      // Check section viewport positioning to ensure natural page scrolling when showcase is entering or leaving
      const showcaseSection = switcherContainer.closest('section') || switcherContainer;
      const rect = showcaseSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // If the showcase is scrolled too high (past viewport top) and user scrolls up:
      // Seamlessly scroll the page back up into view first
      if (rect.top < -40 && isScrollingUp) {
        e.preventDefault();
        scrollWindowBy(rawDy);
        return;
      }

      // If the showcase is too low (entering from bottom) and user scrolls down:
      // Seamlessly continue scrolling the page down to center the showcase first
      if (rect.top > viewportHeight * 0.65 && isScrollingDown) {
        e.preventDefault();
        scrollWindowBy(rawDy);
        return;
      }

      // Case 1: At bottommost card and scrolling down -> Seamlessly scroll page down (no cyclic loop, no block)
      if (currentIndex >= cards.length - 1 && isScrollingDown) {
        e.preventDefault();
        accumulatedDeltaY = 0;
        if (!inBoundaryCooldown) {
          scrollWindowBy(rawDy);
        }
        return;
      }

      // Case 2: At topmost card and scrolling up -> Seamlessly scroll page up (no cyclic loop, no block)
      if (currentIndex <= 0 && isScrollingUp) {
        e.preventDefault();
        accumulatedDeltaY = 0;
        if (!inBoundaryCooldown) {
          scrollWindowBy(rawDy);
        }
        return;
      }

      // Case 3: Within valid episode switching range (between cards)
      e.preventDefault();
      accumulatedDeltaY += rawDy;

      if (isWheelThrottled) return;

      // Threshold check to filter out tiny vibrations and register clean episode switch
      if (Math.abs(accumulatedDeltaY) >= 18) {
        isWheelThrottled = true;

        if (accumulatedDeltaY > 0 && currentIndex < cards.length - 1) {
          const nextIndex = currentIndex + 1;
          activateCard(nextIndex);
          // If we just hit the last card, provide a brief 140ms cooldown to smoothly transition gesture
          if (nextIndex === cards.length - 1) {
            inBoundaryCooldown = true;
            clearTimeout(boundaryCooldownTimer);
            boundaryCooldownTimer = setTimeout(() => {
              inBoundaryCooldown = false;
            }, 140);
          }
        } else if (accumulatedDeltaY < 0 && currentIndex > 0) {
          const prevIndex = currentIndex - 1;
          activateCard(prevIndex);
          // If we just hit the first card, provide a brief 140ms cooldown to smoothly transition gesture
          if (prevIndex === 0) {
            inBoundaryCooldown = true;
            clearTimeout(boundaryCooldownTimer);
            boundaryCooldownTimer = setTimeout(() => {
              inBoundaryCooldown = false;
            }, 140);
          }
        }

        accumulatedDeltaY = 0;

        setTimeout(() => {
          isWheelThrottled = false;
          accumulatedDeltaY = 0;
        }, 180);
      }
    }, { passive: false });
  }

  // Play button handler
  playBtn.addEventListener('click', () => {
    // Hide cover, overlay, info and play btn
    cover.classList.add('hidden');
    playBtn.classList.add('hidden');
    if (overlay) overlay.classList.add('opacity-0');
    if (info) info.classList.add('opacity-0');

    // Setup and show video player
    player.referrerPolicy = 'no-referrer';
    let targetSrc = activeVideoUrl;
    if (targetSrc && targetSrc.includes('%E7%9B%B4%E9%93%BE/%E6%B4%9B%E5%85%8B%E7%8E%8B%E5%9B%BD')) {
      targetSrc = targetSrc.replace('%E7%9B%B4%E9%93%BE/%E6%B4%9B%E5%85%8B%E7%8E%8B%E5%9B%BD', '%E7%9B%B4%E9%93%BE/%E6%B4%9B%E5%85%8B/%E6%B4%9B%E5%85%8B%E7%8E%8B%E5%9B%BD');
    }
    player.src = targetSrc;
    player.style.objectFit = 'contain';
    player.classList.remove('hidden');
    player.setAttribute('controls', 'true');
    player.play().catch(err => {
      console.warn("Video play failed or interrupted:", err);
    });
  });

  // Restore player cover when video ends
  player.addEventListener('ended', () => {
    player.classList.add('hidden');
    player.removeAttribute('controls');
    cover.classList.remove('hidden');
    playBtn.classList.remove('hidden');
    if (overlay) overlay.classList.remove('opacity-0');
    if (info) info.classList.remove('opacity-0');
  });
}

/**
 * Initialize Profile (About & Contact) sections dynamically
 * from configurations in data.js to support easy future modifications.
 */
function initProfile() {
  const profile = window.profileData;
  const skills = window.coreSkills || [];
  const awards = window.awards || [];
  const contact = window.contactData;

  if (!profile) return;

  // 1. First Layer: Personal Profile & Portrait Photo
  const photoEl = document.getElementById('profile-photo');
  const eyebrowEl = document.getElementById('profile-eyebrow');
  const roleEl = document.getElementById('profile-role');
  const paragraphsContainer = document.getElementById('profile-paragraphs');

  if (photoEl) photoEl.src = profile.photo;
  if (eyebrowEl) eyebrowEl.textContent = profile.eyebrow;
  if (roleEl) roleEl.textContent = profile.role;

  if (paragraphsContainer && profile.paragraphs) {
    paragraphsContainer.innerHTML = '';
    profile.paragraphs.forEach(pText => {
      const p = document.createElement('p');
      p.className = 'text-sm leading-relaxed text-white/60';
      p.textContent = pText;
      paragraphsContainer.appendChild(p);
    });
  }

  // 2. Second Layer: Core Skills & Awards
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer) {
    skillsContainer.innerHTML = '';
    skills.forEach(skill => {
      // Style bracketed text differently (e.g., in a slightly darker gray)
      // to highlight the main software name.
      const styledSkill = skill.replace(/[（(](.*?)[）)]/g, (match, p1) => {
        return `<span class="text-white/40 font-light text-xs ml-1.5">(${p1})</span>`;
      });

      const skillItem = document.createElement('div');
      skillItem.className = 'flex items-center gap-2.5 py-1';
      skillItem.innerHTML = `
        <span class="w-1.5 h-1.5 rounded-full bg-white/45 flex-shrink-0"></span>
        <span class="text-white/85 leading-normal font-medium">${styledSkill}</span>
      `;
      skillsContainer.appendChild(skillItem);
    });
  }

  const awardsContainer = document.getElementById('awards-container');
  if (awardsContainer) {
    awardsContainer.innerHTML = '';
    awards.forEach((award, index) => {
      const awardRow = document.createElement('div');
      // No top border for the first item
      const borderClass = index === 0 ? '' : 'border-t border-white/5';
      awardRow.className = `flex flex-col sm:flex-row sm:items-center justify-between py-3.5 ${borderClass} transition-all duration-300 hover:bg-white/[0.015] px-2 rounded-lg group`;
      
      awardRow.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center justify-center w-8 h-8 flex-shrink-0 text-zinc-400 group-hover:text-zinc-200 transition-colors" title="获奖荣誉">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16.956 2.057c.355 .124 .829 .375 1.303 .796a3.77 3.77 0 0 1 1.246 2.204c.173 .989 -.047 1.894 -.519 2.683l-.123 .194q -.097 .147 -.196 .272q .066 .234 .117 .471q .26 -.178 .545 -.307c.851 -.389 1.727 -.442 2.527 -.306q .226 .04 .346 .076a1 1 0 0 1 .689 .712l.029 .13q .015 .08 .03 .18a4.45 4.45 0 0 1 -.324 2.496a3.94 3.94 0 0 1 -1.71 1.85l-.242 .12a4.23 4.23 0 0 1 -2.234 .349a9 9 0 0 1 -.443 1.023c.37 .016 .748 .093 1.128 .24c.732 .28 1.299 .758 1.711 1.367a3.95 3.95 0 0 1 .654 1.613a1 1 0 0 1 -.356 .917a3.8 3.8 0 0 1 -.716 .443c-.933 .455 -1.978 .588 -3.043 .179l-.032 -.015l-.205 -.086a3.6 3.6 0 0 1 -1.33 -1.069l-.143 -.197a4 4 0 0 1 -.26 -.433a6 6 0 0 1 -.927 .511q .18 .262 .337 .56a7.4 7.4 0 0 1 .66 1.747a1 1 0 0 1 -1.95 .444l-.028 -.11a6 6 0 0 0 -.449 -1.143c-.342 -.645 -.71 -.968 -1.048 -.968s-.706 .323 -1.048 .969a5.6 5.6 0 0 0 -.367 .874l-.082 .269l-.028 .11a1 1 0 0 1 -1.95 -.444a7.3 7.3 0 0 1 .66 -1.747q .158 -.298 .337 -.561a6.4 6.4 0 0 1 -.93 -.508a4 4 0 0 1 -.256 .43c-.366 .541 -.855 .98 -1.473 1.267l-.238 .1c-.994 .382 -1.97 .292 -2.855 -.091l-.188 -.087a3.8 3.8 0 0 1 -.716 -.443a1 1 0 0 1 -.356 -.917a3.95 3.95 0 0 1 .654 -1.613a3.6 3.6 0 0 1 1.71 -1.368c.38 -.146 .758 -.223 1.13 -.24a9 9 0 0 1 -.445 -1.023a4.23 4.23 0 0 1 -2.233 -.348a4 4 0 0 1 -.916 -.587l-.207 -.191a4 4 0 0 1 -.724 -.977l-.105 -.216a4.45 4.45 0 0 1 -.265 -2.806a1 1 0 0 1 .69 -.712q .119 -.036 .345 -.076c.801 -.135 1.678 -.082 2.53 .308q .283 .129 .545 .304q .048 -.235 .112 -.47a5 5 0 0 1 -.194 -.272c-.556 -.832 -.83 -1.806 -.642 -2.877l.05 -.242a3.75 3.75 0 0 1 1.027 -1.803l.169 -.159a4 4 0 0 1 1.303 -.796a1 1 0 0 1 .975 .178c.2 .168 .462 .446 .719 .83c.556 .833 .83 1.807 .642 2.878a3.77 3.77 0 0 1 -1.246 2.204c-.303 .27 -.607 .47 -.879 .61a7.5 7.5 0 0 0 -.255 1.971c0 3.502 2.285 6.272 5 6.272s5 -2.77 5 -6.276a7.6 7.6 0 0 0 -.253 -1.967a4.3 4.3 0 0 1 -.881 -.61a3.77 3.77 0 0 1 -1.246 -2.204c-.188 -1.07 .086 -2.045 .642 -2.877c.257 -.385 .52 -.663 .72 -.831a1 1 0 0 1 .974 -.178" />
            </svg>
          </span>
          <span class="text-sm text-white/85 group-hover:text-white transition-colors font-medium">${award.title}</span>
        </div>
        <span class="text-xs text-white/40 mt-1 sm:mt-0 font-light tracking-wide group-hover:text-white/60 transition-colors">${award.level}</span>
      `;
      awardsContainer.appendChild(awardRow);
    });
  }

  // 3. Third Layer: Contact CTA & Links (Display only, non-navigating)
  const emailBtn = document.getElementById('email-btn');
  const githubBtn = document.getElementById('github-btn');

  if (emailBtn) {
    emailBtn.removeAttribute('href');
    emailBtn.style.cursor = 'default';
    emailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }
  if (githubBtn) {
    githubBtn.removeAttribute('href');
    githubBtn.removeAttribute('target');
    githubBtn.removeAttribute('rel');
    githubBtn.style.cursor = 'default';
    githubBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  // 4. Scroll-Based Smooth Entrance Transitions with IntersectionObserver
  const animatedElements = document.querySelectorAll('.profile-fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Check for prefers-reduced-motion
          const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (isReduced) {
            entry.target.style.transition = 'opacity 0.5s ease';
            entry.target.style.transform = 'none';
          }
          entry.target.classList.add('animate-active');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    animatedElements.forEach(el => el.classList.add('animate-active'));
  }
}

