/* ==========================================================================
   DINITHA NAVANITH — CLIENT-SIDE INTERACTIONS
   Smooth Page Reveals • Case Studies • Tactile Feedback • Responsive Navigation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCustomCursor();
  initScrollReveal();
  initNavScrollSpy();
  initModalListeners();
});

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
