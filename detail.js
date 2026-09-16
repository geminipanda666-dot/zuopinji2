/**
 * Animation and Film Portfolio - Cinematic Details Page Script
 * Orchestrates dynamic project fetching, background ambient video playing,
 * Netflix-style blur-effects, right-side sliding film popup player, and blank-area dismissal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Get project ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  // 2. Fetch projects database
  const projects = window.portfolioProjects || [];
  const project = projects.find(p => p.id === projectId);

  // 3. Fallback handle if project is invalid
  if (!projectId || !project) {
    showErrorScreen();
    return;
  }

  // 4. Render Project metadata & details
  renderProjectDetails(project);

  // 5. Setup Ambient Background Media
  setupAmbientBackground(project);

  // 6. Interactive Video Player Hub
  setupVideoPlayer(project);

  // 7. Interactive Blank-Space dismissal logic (removed as per user request to disable click outside dismissal)
  // setupBlankDismissal();
});

/**
 * Handle invalid or missing project parameters
 */
function showErrorScreen() {
  const wrapper = document.getElementById('detail-content-wrapper');
  const errorScreen = document.getElementById('error-screen');
  const bgMedia = document.getElementById('bg-media-container');

  if (wrapper) wrapper.classList.add('hidden');
  if (bgMedia) bgMedia.classList.add('hidden');
  if (errorScreen) errorScreen.classList.remove('hidden');
}

/**
 * Populate detailed movie card properties
 */
function renderProjectDetails(project) {
  const category = document.getElementById('detail-category');
  const titleLogo = document.getElementById('detail-title-logo');
  const year = document.getElementById('detail-year');
  const duration = document.getElementById('detail-duration');
  const roles = document.getElementById('detail-roles');
  const description = document.getElementById('detail-description');
  const softwareContainer = document.getElementById('detail-software-container');
  const stillsGrid = document.getElementById('stills-grid');

  if (category) category.textContent = project.category;
  
  if (titleLogo) {
    titleLogo.src = project.titleLogo;
    titleLogo.alt = project.titleText;
    
    // Add text fallback in case titleLogo image url fails or loads empty
    titleLogo.onerror = () => {
      titleLogo.style.display = 'none';
      const textTitle = document.createElement('h1');
      textTitle.className = 'text-4xl font-bold font-serif tracking-tight text-white cinematic-text-shadow';
      textTitle.textContent = project.titleText;
      titleLogo.parentNode.appendChild(textTitle);
    };
  }

  if (year) year.textContent = project.year;
  if (duration) duration.textContent = project.duration;
  if (roles) roles.textContent = project.role;
  if (description) description.textContent = project.description;

  // Render software used tags
  if (softwareContainer && project.software) {
    softwareContainer.innerHTML = '';
    project.software.forEach(soft => {
      const badge = document.createElement('span');
      badge.className = 'px-3 py-1 text-[10px] font-mono tracking-wider font-medium text-white/80 bg-white/10 rounded-full border border-white/5';
      badge.textContent = soft;
      softwareContainer.appendChild(badge);
    });
  }

  // Render project stills in 2x2 grid
  if (stillsGrid && project.stillImages) {
    stillsGrid.innerHTML = '';
    
    // Use up to 4 stills
    const stillsToRender = project.stillImages.slice(0, 4);
    
    stillsToRender.forEach((imgUrl, index) => {
      const item = document.createElement('div');
      item.className = 'relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-zinc-900 group cursor-pointer';
      
      item.innerHTML = `
        <img src="${imgUrl}" referrerpolicy="no-referrer" class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 pointer-events-none" alt="Still ${index + 1}" loading="lazy">
        <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 pointer-events-none"></div>
      `;
      
      // Bind click to open immersive lightbox and prevent bubbling
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(imgUrl, stillsToRender, index);
      });
      
      stillsGrid.appendChild(item);
    });
  }
}

/**
 * Opens an immersive full-screen cinematic lightbox for previewing stills
 */
function openLightbox(currentImgUrl, allStills, currentIndex) {
  let lightbox = document.getElementById('stills-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'stills-lightbox';
    lightbox.className = 'fixed inset-0 z-[300] bg-black/95 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-300 flex flex-col items-center justify-center p-4';
    lightbox.innerHTML = `
      <!-- Close button -->
      <button id="lightbox-close" class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/75 hover:text-white hover:bg-white/15 flex items-center justify-center text-2xl transition-all cursor-pointer z-[310]">
        &times;
      </button>
      
      <!-- Nav Arrows -->
      <button id="lightbox-prev" class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/75 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all cursor-pointer z-[310]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button id="lightbox-next" class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/75 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all cursor-pointer z-[310]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      <!-- Main Image Wrapper -->
      <div class="relative max-w-5xl w-full max-h-[75vh] flex items-center justify-center select-none" id="lightbox-content-wrapper">
        <img id="lightbox-img" referrerpolicy="no-referrer" class="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/10 shadow-2xl transition-all duration-300" src="" alt="Lightbox Still">
      </div>

      <!-- Footer Info -->
      <div class="mt-6 flex flex-col items-center gap-2">
        <span id="lightbox-index" class="text-xs font-mono tracking-widest text-white/50">1 / 4</span>
        <span class="text-[10px] font-mono tracking-widest text-white/30 uppercase">Cinematic Still Preview</span>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    // Stop propagation inside lightbox clicks
    lightbox.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxIndex = document.getElementById('lightbox-index');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let activeIndex = currentIndex;

  const updateLightboxContent = (index) => {
    activeIndex = index;
    lightboxImg.style.opacity = '0';
    lightboxImg.src = allStills[activeIndex];
    lightboxIndex.textContent = `${activeIndex + 1} / ${allStills.length}`;
    
    lightboxImg.onload = () => {
      lightboxImg.style.opacity = '1';
    };
  };

  const closeLightbox = () => {
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0', 'pointer-events-none');
    document.removeEventListener('keydown', handleKeyDown);
  };

  closeBtn.onclick = closeLightbox;
  lightbox.onclick = closeLightbox;

  const contentWrapper = document.getElementById('lightbox-content-wrapper');
  contentWrapper.onclick = (e) => e.stopPropagation();

  prevBtn.onclick = (e) => {
    e.stopPropagation();
    const newIndex = (activeIndex - 1 + allStills.length) % allStills.length;
    updateLightboxContent(newIndex);
  };

  nextBtn.onclick = (e) => {
    e.stopPropagation();
    const newIndex = (activeIndex + 1) % allStills.length;
    updateLightboxContent(newIndex);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  };
  document.addEventListener('keydown', handleKeyDown);

  updateLightboxContent(currentIndex);
  lightbox.classList.remove('opacity-0', 'pointer-events-none');
  lightbox.classList.add('opacity-100');
}

/**
 * Configure ambient poster image as cinematic background
 */
function setupAmbientBackground(project) {
  const bgImage = document.getElementById('bg-image');
  const bgVideo = document.getElementById('bg-video');

  if (bgVideo) {
    bgVideo.pause();
    bgVideo.removeAttribute('src');
    bgVideo.remove();
  }

  const posterSrc = project.heroImage || project.coverImage || '';
  if (bgImage && posterSrc) {
    bgImage.src = posterSrc;
    bgImage.style.opacity = '1';
    bgImage.classList.remove('opacity-0');
  }
}

/**
 * Setup film playing popup box and blurry transitions
 */
function setupVideoPlayer(project) {
  const playCta = document.getElementById('play-cta-btn');
  const navPlay = document.getElementById('nav-btn-play');
  const videoPanel = document.getElementById('video-panel');
  const videoOverlay = document.getElementById('video-overlay');
  const playerNode = document.getElementById('player-node');
  const closeVideoBtn = document.getElementById('close-video-btn');
  const contentWrapper = document.getElementById('detail-content-wrapper');
  const iframeNode = videoPanel ? videoPanel.querySelector('iframe') : null;

  const getPlayer = () => document.getElementById('player-node') || (videoPanel ? videoPanel.querySelector('video') : null);

  // If the loaded project has a specific videoUrl, update the video source
  if (project && project.videoUrl) {
    const player = getPlayer();
    if (player) {
      const sourceNode = player.querySelector('source');
      if (sourceNode) {
        sourceNode.src = project.videoUrl;
      }
      player.src = project.videoUrl;
      player.load();
    }
  }

  const openPlayer = () => {
    // 1. Slide in panel & overlay active
    if (videoPanel) videoPanel.classList.add('open');
    if (videoOverlay) videoOverlay.classList.add('active');
    
    // 2. Play video
    const player = getPlayer();
    if (player) {
      if (!player.src || player.src !== project.videoUrl) {
        player.src = project.videoUrl;
        player.load();
      }
      player.play().catch(err => console.log('Player play error: ', err));
    }

    // 3. Blur descriptive text card
    if (contentWrapper) contentWrapper.classList.add('blur-content');
  };

  const closePlayer = () => {
    // 1. Slide out panel & overlay inactive
    if (videoPanel) videoPanel.classList.remove('open');
    if (videoOverlay) videoOverlay.classList.remove('active');

    // 2. Pause video
    const player = getPlayer();
    if (player) {
      player.pause();
    }

    // 3. Unblur card text
    if (contentWrapper) contentWrapper.classList.remove('blur-content');
  };

  // Bind play trigger events
  if (playCta) playCta.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid triggering return-to-home!
    openPlayer();
  });
  
  if (navPlay) navPlay.addEventListener('click', (e) => {
    e.stopPropagation();
    openPlayer();
  });

  // Bind close triggers
  if (closeVideoBtn) closeVideoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closePlayer();
  });
  
  if (videoOverlay) videoOverlay.addEventListener('click', (e) => {
    e.stopPropagation();
    closePlayer();
  });

  // Clicking the outer area of videoPanel closes player, clicking inner video card stops propagation
  if (videoPanel) {
    videoPanel.addEventListener('click', (e) => {
      if (e.target === videoPanel) {
        e.stopPropagation();
        closePlayer();
      }
    });

    const panelInner = videoPanel.querySelector('.video-panel-inner');
    if (panelInner) {
      panelInner.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }
}

