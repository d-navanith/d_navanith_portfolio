/* ==========================================================================
   DINITHA NAVANITH — CLIENT-SIDE INTERACTIONS
   Smooth Page Reveals • Case Studies • Tactile Feedback • Responsive Navigation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initVaporizeSplashScreen();
  initScrollProgress();
  initCustomCursor();
  initScrollReveal();
  initNavScrollSpy();
  initModalListeners();
});

/* ---------------- 0. Vaporize Text Effect Splash Screen ---------------- */
function initVaporizeSplashScreen() {
  const splash = document.getElementById('splashScreen');
  const canvas = document.getElementById('splashCanvas');
  const skipBtn = document.getElementById('skipSplashBtn');
  if (!splash || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const texts = ["Dinitha Navanith", "UI/UX Designer", "Software Engineer"];
  let currentTextIndex = 0;
  let animationState = "fadingIn"; // "fadingIn" -> "waiting" -> "vaporizing"
  let vaporizeProgress = 0;
  let fadeOpacity = 0;
  let particles = [];
  let textBoundaries = { left: 0, right: 0, width: 0 };
  let animationFrameId = null;
  let isFinished = false;

  const vaporizeDuration = 1600; // ms per text vaporization
  const fadeInDuration = 600;    // ms per text fade in
  const waitDuration = 350;      // ms pause before vaporizing
  const spread = 5;
  const direction = "left-to-right";

  // Prevent background scrolling while splash is active
  document.body.style.overflow = 'hidden';

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    sampleCurrentText();
  }

  function getFontSize() {
    const w = window.innerWidth;
    if (w < 480) return Math.floor(w / 11);
    if (w < 768) return Math.floor(w / 13);
    if (w < 1200) return 56;
    return 66;
  }

  function updateDots(idx) {
    for (let i = 0; i < texts.length; i++) {
      const dot = document.getElementById(`dot${i}`);
      if (dot) {
        if (i === idx) dot.classList.add('active');
        else dot.classList.remove('active');
      }
    }
  }

  function sampleCurrentText() {
    const currentText = texts[currentTextIndex];
    if (!currentText) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const fontSize = getFontSize();
    const font = `700 ${fontSize * dpr}px 'Plus Jakarta Sans', sans-serif`;

    ctx.fillStyle = '#ffffff';
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textX = canvas.width / 2;
    const textY = canvas.height / 2;
    const metrics = ctx.measureText(currentText);
    const textWidth = metrics.width;
    const textLeft = textX - textWidth / 2;

    textBoundaries = {
      left: textLeft,
      right: textLeft + textWidth,
      width: textWidth
    };

    ctx.fillText(currentText, textX, textY);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    particles = [];

    const sampleRate = Math.max(1, Math.round(dpr * 1.2));

    for (let y = 0; y < canvas.height; y += sampleRate) {
      for (let x = 0; x < canvas.width; x += sampleRate) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 0) {
          const originalAlpha = (alpha / 255) * 0.95;
          particles.push({
            x,
            y,
            originalX: x,
            originalY: y,
            color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${originalAlpha})`,
            opacity: 0,
            originalAlpha,
            velocityX: 0,
            velocityY: 0,
            angle: 0,
            speed: 0,
            shouldFadeQuickly: Math.random() > 0.8
          });
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function calculateSpread(fontSize) {
    if (fontSize <= 20) return 0.2;
    if (fontSize >= 100) return 1.5;
    return 0.5 + (fontSize - 50) * 0.02;
  }

  function updateParticles(deltaTime) {
    let allVaporized = true;
    const fontSize = getFontSize();
    const multipliedSpread = calculateSpread(fontSize) * spread;
    const progress = Math.min(100, vaporizeProgress);

    const vaporizeX = direction === "left-to-right"
      ? textBoundaries.left + (textBoundaries.width * progress) / 100
      : textBoundaries.right - (textBoundaries.width * progress) / 100;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const shouldVaporize = direction === "left-to-right"
        ? p.originalX <= vaporizeX
        : p.originalX >= vaporizeX;

      if (shouldVaporize) {
        if (p.speed === 0) {
          p.angle = Math.random() * Math.PI * 2;
          p.speed = (Math.random() * 1.2 + 0.5) * multipliedSpread;
          p.velocityX = Math.cos(p.angle) * p.speed;
          p.velocityY = Math.sin(p.angle) * p.speed;
        }

        if (p.shouldFadeQuickly) {
          p.opacity = Math.max(0, p.opacity - deltaTime * 1.5);
        } else {
          const dx = p.originalX - p.x;
          const dy = p.originalY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const damping = Math.max(0.95, 1 - dist / (120 * multipliedSpread));
          const randomSpread = multipliedSpread * 3;
          const sx = (Math.random() - 0.5) * randomSpread;
          const sy = (Math.random() - 0.5) * randomSpread;

          p.velocityX = (p.velocityX + sx + dx * 0.002) * damping;
          p.velocityY = (p.velocityY + sy + dy * 0.002) * damping;

          p.x += p.velocityX * deltaTime * 24;
          p.y += p.velocityY * deltaTime * 14;

          const fadeRate = 0.3 * (2000 / vaporizeDuration);
          p.opacity = Math.max(0, p.opacity - deltaTime * fadeRate);
        }

        if (p.opacity > 0.01) {
          allVaporized = false;
        }
      } else {
        allVaporized = false;
      }
    }

    return allVaporized;
  }

  function renderParticles() {
    ctx.save();
    ctx.scale(dpr, dpr);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity > 0) {
        const c = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.fillStyle = c;
        ctx.fillRect(p.x / dpr, p.y / dpr, 1.2, 1.2);
      }
    }
    ctx.restore();
  }

  function finishSplash() {
    if (isFinished) return;
    isFinished = true;

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    splash.classList.add('splash-hidden');
    document.body.style.overflow = '';

    setTimeout(() => {
      splash.style.display = 'none';
    }, 900);
  }

  let lastTime = performance.now();

  function animate(now) {
    if (isFinished) return;

    const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (animationState) {
      case "fadingIn": {
        fadeOpacity += (deltaTime * 1000) / fadeInDuration;
        const currentOpacity = Math.min(1, fadeOpacity);

        ctx.save();
        ctx.scale(dpr, dpr);
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x = p.originalX;
          p.y = p.originalY;
          p.opacity = currentOpacity * p.originalAlpha;
          const c = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
          ctx.fillStyle = c;
          ctx.fillRect(p.x / dpr, p.y / dpr, 1.2, 1.2);
        }
        ctx.restore();

        if (fadeOpacity >= 1) {
          animationState = "waiting";
          setTimeout(() => {
            if (isFinished) return;
            animationState = "vaporizing";
            vaporizeProgress = 0;
          }, waitDuration);
        }
        break;
      }

      case "waiting": {
        renderParticles();
        break;
      }

      case "vaporizing": {
        vaporizeProgress += (deltaTime * 100) / (vaporizeDuration / 1000);
        const allVaporized = updateParticles(deltaTime);
        renderParticles();

        if (vaporizeProgress >= 100 && allVaporized) {
          currentTextIndex++;
          if (currentTextIndex >= texts.length) {
            finishSplash();
            return;
          } else {
            updateDots(currentTextIndex);
            sampleCurrentText();
            animationState = "fadingIn";
            fadeOpacity = 0;
          }
        }
        break;
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Bind Events
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      finishSplash();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !isFinished) {
      finishSplash();
    }
  });

  window.addEventListener('resize', () => {
    if (!isFinished) {
      resizeCanvas();
    }
  });

  // Start sequence
  updateDots(0);
  resizeCanvas();
  animationFrameId = requestAnimationFrame(animate);
}

/* ---------------- 1. Top Scroll Progress Beam ---------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ---------------- 2. Custom Magnetic Follower Cursor ---------------- */
function initCustomCursor() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorText = document.getElementById('cursorText');

  if (!cursorDot || !cursorRing) return;

  // Disable on touchscreen devices
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });

  function renderCursor() {
    dotX += (mouseX - dotX) * 0.75;
    dotY += (mouseY - dotY) * 0.75;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Attach hover badge detection
  const interactiveElements = document.querySelectorAll('a, button, .project-editorial-card, .journey-card, .skill-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('cursor-active');
      const label = el.getAttribute('data-cursor');
      if (label && cursorText) {
        cursorText.textContent = label;
      }
    });

    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('cursor-active');
      if (cursorText) {
        cursorText.textContent = '';
      }
    });
  });
}

/* ---------------- 3. Smooth Scroll Reveal Animations ---------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ---------------- 4. Active Nav Item ScrollSpy ---------------- */
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.pill-nav .nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------------- 5. Toggle "See all projects" Tray ---------------- */
function toggleAllProjects() {
  const tray = document.getElementById('latestProjectsTray');
  const btnText = document.getElementById('seeAllBtnText');
  const btnIcon = document.getElementById('seeAllBtnIcon');

  if (!tray) return;

  const isOpen = tray.classList.contains('tray-open');

  if (isOpen) {
    tray.classList.remove('tray-open');
    if (btnText) btnText.textContent = 'See all projects';
    if (btnIcon) {
      btnIcon.classList.remove('fa-arrow-up');
      btnIcon.classList.add('fa-arrow-down');
    }
  } else {
    tray.classList.add('tray-open');
    if (btnText) btnText.textContent = 'Hide additional projects';
    if (btnIcon) {
      btnIcon.classList.remove('fa-arrow-down');
      btnIcon.classList.add('fa-arrow-up');
    }
    // Trigger scroll reveal for newly exposed cards
    const newCards = tray.querySelectorAll('.project-editorial-card');
    newCards.forEach(c => c.classList.add('is-revealed'));
  }
}

/* ---------------- 6. Project Case Studies & Modal Drawer ---------------- */
const caseStudyData = {
  carpool: {
    title: 'Carpool: A Smarter Way to Travel Together',
    subtitle: 'Campus Ride-Sharing Mobile Experience & Web Platform',
    role: 'Lead UI/UX Designer & Frontend Engineer',
    stack: 'React, Node.js, Express, MySQL, Figma',
    period: '2024 · ICBT Project',
    summary: 'Carpool was engineered to eliminate transportation bottlenecks experienced by university undergraduates. By integrating secure route matching, verified student profiles, and real-time seat reservations, Carpool reduces transit friction and commuting expenses.',
    highlights: [
      'Engineered 34+ high-fidelity mobile & desktop frames in Figma.',
      'Reduced driver-passenger matching steps from 7 friction points down to 3 intuitive taps.',
      'Designed responsive booking telemetry and driver verification badges.',
      'Built live route selection with interactive campus departure milestones.'
    ],
    github: 'https://github.com/d-navanith/icbt-carpool-ride-row'
  },
  student: {
    title: 'Student Enrolment Desktop Management System',
    subtitle: 'Academic Records, Course Registration & Administrative Flow',
    role: 'Systems Architecture & Java / MySQL Engineering',
    stack: 'Java, MySQL, JDBC, Desktop UI/UX, Swing/JavaFX',
    period: '2023 – 2024 · Academic Project',
    summary: 'A desktop enterprise software designed to streamline student registration, transcript generation, tuition payments, and curriculum track assignments. Emphasizes atomic relational database transactions and intuitive tabular administration.',
    highlights: [
      'Normalized multi-table relational schema handling complex foreign key constraints.',
      'Created intuitive tabular filter dashboards for rapid student query lookup.',
      'Automated semester tuition statement calculations and student profile verification.',
      'Zero-latency desktop interface eliminating slow web-based legacy portal delays.'
    ],
    github: 'https://github.com/d-navanith'
  },
  fitness: {
    title: 'Fitness Tracker: Small Steps, Big Progress',
    subtitle: 'Holistic Biometric Telemetry & Habit Analytics Application',
    role: 'Full-Stack Developer & UI Designer',
    stack: 'PHP, MySQL, JavaScript, Chart.js, HTML5/CSS3',
    period: '2024 · Personal & Academic Work',
    summary: 'Fitness Tracker transforms complex nutritional calculations and workout routines into clear visual progress indicators. Designed to help individuals sustain long-term fitness habits through weekly telemetry and calorie goal pacing.',
    highlights: [
      'Visualized calorie deficits, workout streaks, and macronutrient ratios with dynamic Chart.js.',
      'Engineered interactive BMI calculators and hydration milestone checkpoints.',
      'Designed a clean, light-mode dashboard prioritizing daily actionable targets.',
      'Structured MySQL database with persistent workout session logs.'
    ],
    github: 'https://github.com/d-navanith/fitness_tracker'
  },
  mondy: {
    title: 'Mondy Cinema: More Than Movies, An Experience',
    subtitle: 'Cinematic Movie Discovery & Interactive Seat Reservation Portal',
    role: 'Frontend Experience Designer & Backend Engineer',
    stack: 'PHP, MySQL, JavaScript ES6, YouTube API, CSS Grid',
    period: '2024 · Production Web App',
    summary: 'Mondy Cinema delivers an immersive digital theatre booking experience. Users can explore movie trailers, filter showing times, select theatre seats with real-time visual seat matrices, and complete ticket bookings.',
    highlights: [
      'Built interactive theater seat matrix showing live availability and VIP tiers.',
      'Integrated cinema trailer player modal directly within movie overview cards.',
      'Designed booking confirmation receipt engine with reservation tracking IDs.',
      'Crafted cinematic responsive layouts for mobile ticket booking on the go.'
    ],
    github: 'https://github.com/d-navanith/MONDY-CINEMA'
  },
  marketpulse: {
    title: 'MarketPulse AI: Autonomous Telegram Intelligence Bot',
    subtitle: 'AI Financial Briefings, Sentiment Synthesis & Scheduled Cron Runner',
    role: 'AI Engineer & Workflow Architect',
    stack: 'Python, Google Gemini 1.5 API, n8n Workflow Automation, Telegram API',
    period: '2024 · Latest AI Work',
    summary: 'An automated intelligence bot that scrapes daily market metrics, analyzes news sentiment with Gemini API, formats structured executive summaries, and delivers them directly into subscriber Telegram channels on a scheduled cron.',
    highlights: [
      'Orchestrated autonomous multi-step pipelines via n8n and Python scripts.',
      'Implemented Google Gemini API prompt chains for zero-hallucination summaries.',
      'Integrated error recovery and structured Markdown formatters for Telegram.',
      'Operates autonomously without manual human intervention.'
    ],
    github: 'https://github.com/d-navanith/marketpulse-ai-telegram-bot'
  },
  roadster: {
    title: 'Roadster Rush: 2D Dynamic Arcade Engine',
    subtitle: 'HTML5 Canvas Arcade Engine with Physics & Particle Effects',
    role: 'Creative Coder & Game Engine Developer',
    stack: 'JavaScript ES6+, HTML5 Canvas, Web Audio API, RequestAnimationFrame',
    period: '2024 · Latest Creative Coding',
    summary: 'A responsive 2D arcade car racing game built from scratch without bulky external game libraries. Features precise bounding-box collision detection, asphalt particle trails, acceleration physics, and audio synthesis.',
    highlights: [
      'Zero dependencies: Pure vanilla JavaScript canvas rendering loop running at 60 FPS.',
      'Dynamic collision math with responsive keyboard and touch controls.',
      'Progressive speed acceleration and obstacle generation logic.',
      'Retro arcade aesthetic with high-score tracking in local storage.'
    ],
    github: 'https://github.com/d-navanith/roadster_rush_car_game'
  },
  rpa: {
    title: 'Web-to-Excel & Desktop RPA Automation',
    subtitle: 'Automated Financial Data Ingestion & Desktop Maintenance Bot',
    role: 'Automation Specialist & Script Developer',
    stack: 'Power Automate Desktop, Python, openpyxl, OS Subprocess API',
    period: '2024 · Latest RPA Engineering',
    summary: 'Robotic Process Automation bot engineered to scrape live foreign exchange exchange rates, parse fluctuating currency tables, populate formatted Excel workbooks, and automate filesystem archive cleaning on routine schedules.',
    highlights: [
      'Eliminated 3 hours of repetitive daily manual reporting data entry.',
      'Formatted clean multi-tab Excel workbooks with automated sum formulas.',
      'Configured scheduled triggers with automated desktop error alerting.',
      'Packaged standalone desktop executables for seamless deployment.'
    ],
    github: 'https://github.com/d-navanith'
  }
};

function openCaseStudy(key) {
  const modal = document.getElementById('caseStudyModal');
  const modalContent = document.getElementById('modalContent');
  const data = caseStudyData[key];

  if (!modal || !modalContent || !data) return;

  modalContent.innerHTML = `
    <h3>${data.title}</h3>
    <p style="font-size: 16px; color: #2563eb; font-weight: 600; margin-bottom: 20px;">${data.subtitle}</p>
    
    <div class="modal-meta-grid">
      <div>
        <strong>Role</strong>
        <span>${data.role}</span>
      </div>
      <div>
        <strong>Technology Stack</strong>
        <span>${data.stack}</span>
      </div>
      <div>
        <strong>Timeline</strong>
        <span>${data.period}</span>
      </div>
    </div>

    <p>${data.summary}</p>

    <h4 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 24px 0 12px;">Key Accomplishments</h4>
    <ul style="padding-left: 20px; margin-bottom: 24px; color: #475569;">
      ${data.highlights.map(h => `<li style="margin-bottom: 8px;">${h}</li>`).join('')}
    </ul>

    <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="modal-link-btn">
      <span>View Source on GitHub</span>
      <i class="fa-solid fa-arrow-up-right-from-square"></i>
    </a>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCaseStudy(event) {
  const modal = document.getElementById('caseStudyModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function initModalListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCaseStudy();
    }
  });
}
