/*
 * All editable content lives in config.js. This file handles the behavior.
 */
const config = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : {
  startMessage: "Click here to enter",
  name: "YOUR NAME",
  bioMessages: ["Add your bio here — edit config.js."],
  socials: [],
  badges: [],
  appearance: { accentColor: '#00CED1' },
  media: { backgroundVideo: 'assets/background.mp4', backgroundMusic: '' }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function placeholderImage(label) {
  const text = escapeHtml(label || 'Asset').slice(0, 18);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">` +
    `<rect width="100%" height="100%" fill="#101018"/>` +
    `<circle cx="75" cy="58" r="30" fill="none" stroke="#00CED1" stroke-width="3"/>` +
    `<text x="75" y="122" fill="#00CED1" font-family="monospace" font-size="13" text-anchor="middle">${text}</text>` +
    `</svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

let hasUserInteracted = false;

function initMedia() {
  const backgroundVideo = document.getElementById('background');
  if (!backgroundVideo) {
    console.error("Background video not found");
    return;
  }
  backgroundVideo.muted = true;
  backgroundVideo.play().catch(err => {
    console.error("Failed to play background video:", err);
  });
}

function startTabTitleAnimation() {
  const settings = (config.tabTitle && typeof config.tabTitle === 'object') ? config.tabTitle : {};
  const fallback = [config.name]
    .concat(Array.isArray(config.bioMessages) ? config.bioMessages : [])
    .map(value => String(value || '').trim())
    .filter(Boolean);

  const messages = (Array.isArray(settings.messages) && settings.messages.length
    ? settings.messages
    : fallback)
    .map(value => String(value || '').trim())
    .filter(Boolean);

  if (!messages.length) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.title = messages[0];
    return;
  }

  const typeSpeed = Math.max(30, Number(settings.typeSpeed) || 90);
  const eraseSpeed = Math.max(20, Number(settings.eraseSpeed) || 45);
  const holdTime = Math.max(300, Number(settings.holdTime) || 1600);

  let messageIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const message = messages[messageIndex];
    charIndex += deleting ? -1 : 1;
    document.title = message.slice(0, charIndex);

    let delay = deleting ? eraseSpeed : typeSpeed;
    if (!deleting && charIndex >= message.length) {
      deleting = true;
      delay = holdTime;
    } else if (deleting && charIndex <= 0) {
      deleting = false;
      messageIndex = (messageIndex + 1) % messages.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 600);
}

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const backgroundMusic = document.getElementById('background-music');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  const backgroundVideo = document.getElementById('background');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  const profileBlock = document.getElementById('profile-block');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const badgeGroup = document.getElementById('badge-group');
  const socialLinks = document.getElementById('social-links');

  function renderBadges() {
    badgeGroup.innerHTML = config.badges.map(badge => `
      <div class="badge-container">
        <img src="${escapeHtml(badge.icon)}" alt="${escapeHtml(badge.label)}" class="badge">
        <span class="tooltip">${escapeHtml(badge.label)}</span>
      </div>
    `).join('');
  }

  function renderSocials() {
    socialLinks.innerHTML = config.socials.map(social => `
      <a href="${escapeHtml(social.href)}" target="_blank" rel="noopener noreferrer">
        <img src="${escapeHtml(social.icon)}" alt="${escapeHtml(social.label)}" class="social-icon">
      </a>
    `).join('');
  }

  function addImageFallbacks() {
    document.addEventListener('error', (event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = 'true';
      img.src = placeholderImage(img.alt || 'Asset');
    }, true);
  }

  function syncMediaSources() {
    const media = config.media || {};

    const videoSource = backgroundVideo.querySelector('source');
    if (videoSource && media.backgroundVideo) {
      videoSource.src = media.backgroundVideo;
      backgroundVideo.load();
    }

    const musicSource = backgroundMusic && backgroundMusic.querySelector('source');
    if (musicSource) {
      if (media.backgroundMusic) {
        musicSource.src = media.backgroundMusic;
      } else {
        musicSource.removeAttribute('src');
      }
      backgroundMusic.load();
    }
  }

  function hideMissingVideo() {
    document.body.classList.add('no-video');
    backgroundVideo.style.display = 'none';
  }

  backgroundVideo.addEventListener('error', hideMissingVideo);
  backgroundVideo.querySelectorAll('source').forEach(source => {
    source.addEventListener('error', hideMissingVideo);
  });

  addImageFallbacks();
  renderBadges();
  renderSocials();
  syncMediaSources();

  if (config.appearance && config.appearance.accentColor) {
    document.documentElement.style.setProperty('--primary-color', config.appearance.accentColor);
  }

  let socialIcons = document.querySelectorAll('.social-icon');
  let badges = document.querySelectorAll('.badge');

  
  const cursor = document.querySelector('.custom-cursor');
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    if (cursor) cursor.style.display = 'none';
  } else if (cursor) {
    // The Chroma .ani files are sprite sheets rendered as 30 PNG frames.
    const FRAME_SIZE = 32;
    const FRAME_COUNT = 30;
    const FRAME_MS = 60;
    const INTERACTIVE = 'a, button, #start-screen, .profile-picture, .volume-icon';

    let frameIndex = -1;
    let linkMode = null;
    const startedAt = performance.now();

    function updateCursor(event, isLink) {
      if (isLink !== linkMode) {
        linkMode = isLink;
        cursor.classList.toggle('link', isLink);
      }

      const hotspotX = isLink ? 13 : 0;
      const hotspotY = isLink ? 4 : 0;
      cursor.style.left = (event.clientX - hotspotX) + 'px';
      cursor.style.top = (event.clientY - hotspotY) + 'px';
      cursor.style.display = 'block';
    }

    document.addEventListener('mousemove', (event) => {
      const target = event.target && event.target.closest ? event.target : null;
      updateCursor(event, !!(target && target.closest(INTERACTIVE)));
    }, { passive: true });

    document.addEventListener('mousedown', () => cursor.classList.add('pressed'));
    document.addEventListener('mouseup', () => cursor.classList.remove('pressed'));
    document.addEventListener('mouseleave', () => { cursor.style.display = 'none'; });
    document.addEventListener('mouseenter', (event) => updateCursor(event, false));

    function animateCursor(now) {
      const frame = Math.floor(((now - startedAt) / FRAME_MS) % FRAME_COUNT);
      if (frame !== frameIndex) {
        frameIndex = frame;
        cursor.style.backgroundPosition = (-frame * FRAME_SIZE) + 'px 0';
      }
      requestAnimationFrame(animateCursor);
    }

    requestAnimationFrame(animateCursor);
    document.body.classList.add('custom-cursor-ready');
  }


  const startMessage = config.startMessage;
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
    }
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    setTimeout(typeWriterStart, 100);
  }


  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
  }, 500);



  startScreen.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    if (config.media && config.media.backgroundMusic) {
      backgroundMusic.muted = false;
      backgroundMusic.play().catch(err => {
        console.error("Failed to play music after start screen click:", err);
      });
    }
    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
        profileBlock.classList.add('profile-appear');
        profileContainer.classList.add('orbit');
      }}
    );
    typeWriterName();
    typeWriterBio();
  });

  startScreen.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startScreen.classList.add('hidden');
    if (config.media && config.media.backgroundMusic) {
      backgroundMusic.muted = false;
      backgroundMusic.play().catch(err => {
        console.error("Failed to play music after start screen touch:", err);
      });
    }
    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
        profileBlock.classList.add('profile-appear');
        profileContainer.classList.add('orbit');
      }}
    );
    typeWriterName();
    typeWriterBio();
  });


  const name = config.name;
  let nameText = '';
  let nameIndex = 0;
  let isNameDeleting = false;
  let nameCursorVisible = true;

  function typeWriterName() {
    if (!isNameDeleting && nameIndex < name.length) {
      nameText = name.slice(0, nameIndex + 1);
      nameIndex++;
    } else if (isNameDeleting && nameIndex > 0) {
      nameText = name.slice(0, nameIndex - 1);
      nameIndex--;
    } else if (nameIndex === name.length) {
      isNameDeleting = true;
      setTimeout(typeWriterName, 10000);
      return;
    } else if (nameIndex === 0) {
      isNameDeleting = false;
    }
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileName.classList.add('glitch');
      setTimeout(() => profileName.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterName, isNameDeleting ? 150 : 300);
  }

  setInterval(() => {
    nameCursorVisible = !nameCursorVisible;
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
  }, 500);


  const bioMessages = config.bioMessages;
  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = 0;
  let isBioDeleting = false;
  let bioCursorVisible = true;

  function typeWriterBio() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(typeWriterBio, 2000);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = (bioMessageIndex + 1) % bioMessages.length;
    }
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileBio.classList.add('glitch');
      setTimeout(() => profileBio.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterBio, isBioDeleting ? 75 : 150);
  }

  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
  }, 500);


  let currentAudio = backgroundMusic;
  let isMuted = false;

  volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeIcon.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMuted = !isMuted;
    currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeSlider.addEventListener('input', () => {
    currentAudio.volume = volumeSlider.value;
    isMuted = false;
    currentAudio.muted = false;
    volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });


  transparencySlider.addEventListener('input', () => {
    const opacity = transparencySlider.value;
    if (opacity == 0) {
      profileBlock.style.background = 'rgba(0, 0, 0, 0)';
      profileBlock.style.borderOpacity = '0';
      profileBlock.style.borderColor = 'transparent';
      profileBlock.style.backdropFilter = 'none';
    
      profileBlock.style.pointerEvents = 'auto';
      socialIcons.forEach(icon => {
        icon.style.pointerEvents = 'auto';
        icon.style.opacity = '1';
      });
      badges.forEach(badge => {
        badge.style.pointerEvents = 'auto';
        badge.style.opacity = '1';
      });
      profilePicture.style.pointerEvents = 'auto';
      profilePicture.style.opacity = '1';
      profileName.style.opacity = '1';
      profileBio.style.opacity = '1';
    } else {
      profileBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
      profileBlock.style.borderOpacity = opacity;
      profileBlock.style.borderColor = '';
      profileBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
      profileBlock.style.pointerEvents = 'auto';
      socialIcons.forEach(icon => {
        icon.style.pointerEvents = 'auto';
        icon.style.opacity = '1';
      });
      badges.forEach(badge => {
        badge.style.pointerEvents = 'auto';
        badge.style.opacity = '1';
      });
      profilePicture.style.pointerEvents = 'auto';
      profilePicture.style.opacity = '1';
      profileName.style.opacity = '1';
      profileBio.style.opacity = '1';
    }
  });


  // Theme switching removed — the site now uses one fixed look.

  profilePicture.addEventListener('mouseenter', () => {
    glitchOverlay.style.opacity = '1';
    setTimeout(() => {
      glitchOverlay.style.opacity = '0';
    }, 500);
  });


  profilePicture.addEventListener('click', () => {
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

  profilePicture.addEventListener('touchstart', (e) => {
    e.preventDefault();
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

 
  typeWriterStart();
  startTabTitleAnimation();
});