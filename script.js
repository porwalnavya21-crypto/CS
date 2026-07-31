(() => {
  'use strict';

  /* =========================================================
     THEME TOGGLE (in-memory, no persistence)
  ========================================================= */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  let isDark = false;

  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', String(isDark));
  });

  /* =========================================================
     NAVBAR: scroll shadow + active tab + progress bar
  ========================================================= */
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const sections = tabs
    .map(t => document.getElementById(t.dataset.tab))
    .filter(Boolean);

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 12);
    backToTop.classList.toggle('show', y > 600);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';

    let currentId = sections[0] ? sections[0].id : null;
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120) currentId = sec.id;
    }
    tabs.forEach(t => t.classList.toggle('active-tab', t.dataset.tab === currentId));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* =========================================================
     MOBILE MENU
  ========================================================= */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* =========================================================
     HERO TERMINAL TYPING EFFECT
  ========================================================= */
  const typedLine = document.getElementById('typedLine');
  const cursorBlink = document.getElementById('cursorBlink');
  const missionText = 'Teach fundamentals that outlast frameworks.';
  let charIndex = 0;

  function typeMission() {
    if (charIndex <= missionText.length) {
      typedLine.textContent = missionText.slice(0, charIndex);
      charIndex++;
      setTimeout(typeMission, 38);
    }
  }
  setTimeout(typeMission, 500);

  /* =========================================================
     REVEAL ON SCROLL (generic)
  ========================================================= */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function observeReveal(el, delay = 0) {
    el.classList.add('reveal');
    el.style.transitionDelay = delay + 'ms';
    revealObserver.observe(el);
  }

  /* =========================================================
     COUNTER ANIMATION
  ========================================================= */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* =========================================================
     COURSE DATA + RENDER
  ========================================================= */
  const courseData = {
    btech: [
      { tag: 'YEAR 1–2', title: 'Data Structures & Algorithms', desc: 'Arrays to graphs — with weekly competitive problem sets.', hours: '4 cr' , labs:'Lab: 2/wk'},
      { tag: 'YEAR 1–2', title: 'Object-Oriented Programming', desc: 'Design principles through Java and a semester-long build.', hours: '3 cr', labs:'Lab: 1/wk' },
      { tag: 'YEAR 2', title: 'Operating Systems', desc: 'Processes, scheduling, memory — implemented on a teaching OS.', hours: '4 cr', labs:'Lab: 2/wk' },
      { tag: 'YEAR 2', title: 'Database Management Systems', desc: 'Relational theory, SQL, and a normalized schema project.', hours: '3 cr', labs:'Lab: 1/wk' },
      { tag: 'YEAR 2–3', title: 'Computer Networks', desc: 'From physical layer to sockets, with a working chat protocol.', hours: '3 cr', labs:'Lab: 1/wk' },
      { tag: 'YEAR 3', title: 'Artificial Intelligence & ML', desc: 'Search, classical ML, and an intro to neural networks.', hours: '4 cr', labs:'Lab: 2/wk' },
      { tag: 'YEAR 3', title: 'Computer Architecture', desc: 'Pipelining, caches, and instruction sets, down to gates.', hours: '3 cr', labs:'Lab: 1/wk' },
      { tag: 'YEAR 4', title: 'Cybersecurity Fundamentals', desc: 'Threat modeling, cryptography basics, and a capture-the-flag.', hours: '3 cr', labs:'Lab: 1/wk' },
      { tag: 'YEAR 4', title: 'Cloud Computing', desc: 'Containers, orchestration, and deploying a real service.', hours: '3 cr', labs:'Lab: 1/wk' },
    ],
    mtech: [
      { tag: 'SEM 1', title: 'Advanced Algorithms', desc: 'Approximation, randomized and online algorithms.', hours: '4 cr', labs:'Seminar' },
      { tag: 'SEM 1', title: 'Distributed Systems', desc: 'Consensus, replication, and fault tolerance at scale.', hours: '4 cr', labs:'Lab: 1/wk' },
      { tag: 'SEM 2', title: 'Deep Learning', desc: 'CNNs, transformers, and training at limited compute budgets.', hours: '4 cr', labs:'Lab: 2/wk' },
      { tag: 'SEM 2', title: 'Compiler Design', desc: 'From lexer to code generation, building a working compiler.', hours: '3 cr', labs:'Lab: 1/wk' },
      { tag: 'SEM 2–3', title: 'Applied Cryptography', desc: 'Protocol design and formal security proofs.', hours: '3 cr', labs:'Seminar' },
      { tag: 'SEM 3', title: 'Thesis / Research Project', desc: 'Independent research under a faculty advisor.', hours: '8 cr', labs:'Self-paced' },
    ]
  };

  const courseGrid = document.getElementById('courseGrid');
  const trackBtns = document.querySelectorAll('.track-btn');

  function renderCourses(track) {
    courseGrid.innerHTML = '';
    courseData[track].forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <span class="course-tag">${c.tag}</span>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <div class="course-meta"><span>${c.hours}</span><span>${c.labs}</span></div>
      `;
      courseGrid.appendChild(card);
      observeReveal(card, (i % 3) * 80);
    });
  }
  renderCourses('btech');

  trackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      trackBtns.forEach(b => { b.classList.remove('active-track'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active-track');
      btn.setAttribute('aria-selected', 'true');
      renderCourses(btn.dataset.track);
    });
  });

  /* =========================================================
     FACULTY DATA + RENDER
  ========================================================= */
  const facultyData = [
    { initials: 'AR', name: 'Dr. Ananya Rao', role: 'Head of Department', spec: 'Distributed Systems', hue: '210' },
    { initials: 'VK', name: 'Dr. Vikram Kohli', role: 'Professor', spec: 'Machine Learning', hue: '265' },
    { initials: 'SM', name: 'Dr. Sana Mirza', role: 'Associate Professor', spec: 'Cybersecurity', hue: '340' },
    { initials: 'RJ', name: 'Dr. Rohan Joshi', role: 'Associate Professor', spec: 'Computer Networks', hue: '25' },
    { initials: 'PN', name: 'Dr. Priya Nair', role: 'Assistant Professor', spec: 'Theoretical CS', hue: '160' },
    { initials: 'DK', name: 'Dr. Devraj Kapoor', role: 'Assistant Professor', spec: 'Compilers & PL', hue: '190' },
    { initials: 'MT', name: 'Dr. Meera Thomas', role: 'Assistant Professor', spec: 'Human-Computer Interaction', hue: '300' },
    { initials: 'AS', name: 'Dr. Arjun Sethi', role: 'Assistant Professor', spec: 'Computer Architecture', hue: '45' },
  ];

  const facultyGrid = document.getElementById('facultyGrid');
  facultyData.forEach((f, i) => {
    const card = document.createElement('div');
    card.className = 'faculty-card';
    card.innerHTML = `
      <div class="faculty-avatar" style="background: hsl(${f.hue} 70% 45%)">${f.initials}</div>
      <h3>${f.name}</h3>
      <p class="faculty-role">${f.role}</p>
      <p class="faculty-spec">${f.spec}</p>
    `;
    facultyGrid.appendChild(card);
    observeReveal(card, (i % 4) * 70);
  });

  /* =========================================================
     RECRUITERS
  ========================================================= */
  const recruiters = ['Systemsync', 'Northbridge Analytics', 'Vellum Cloud', 'Ferrotech', 'Quillstack', 'Halcyon Labs', 'Bracket & Co.', 'Ridgeline Data', 'Modulus Robotics', 'Kestrel-Alum Ventures'];
  const recruiterTags = document.getElementById('recruiterTags');
  recruiters.forEach(r => {
    const span = document.createElement('span');
    span.className = 'recruiter-tag';
    span.textContent = r;
    recruiterTags.appendChild(span);
  });

  document.querySelectorAll('.pstat, .placement-stats').forEach(el => observeReveal(el));

  /* =========================================================
     GALLERY (generated pattern tiles — no external images)
  ========================================================= */
  const galleryData = [
    { caption: 'Systems Lab — night build sessions', hue: 210 },
    { caption: 'Annual Hackathon, 36 hours', hue: 25 },
    { caption: 'Robotics bench, third floor', hue: 160 },
    { caption: 'Senior project demo day', hue: 300 },
    { caption: 'Guest lecture: distributed databases', hue: 265 },
    { caption: 'First-year orientation', hue: 45 },
    { caption: 'Capture-the-flag finals', hue: 340 },
    { caption: 'Alumni meetup, placement cell', hue: 190 },
  ];

  const galleryGrid = document.getElementById('galleryGrid');
  galleryData.forEach((g, i) => {
    const tile = document.createElement('div');
    tile.className = 'gallery-tile';
    tile.innerHTML = `
      <div class="gallery-pattern" style="background:
        radial-gradient(circle at 30% 20%, hsl(${g.hue} 80% 60% / .55), transparent 60%),
        radial-gradient(circle at 80% 80%, hsl(${g.hue + 40} 70% 50% / .5), transparent 60%),
        linear-gradient(135deg, hsl(${g.hue} 40% 18%), hsl(${g.hue + 60} 35% 10%));">
      </div>
      <div class="gallery-caption">${g.caption}</div>
    `;
    galleryGrid.appendChild(tile);
    observeReveal(tile, (i % 4) * 60);
  });

  /* =========================================================
     SECTION HEADER REVEALS
  ========================================================= */
  document.querySelectorAll('.eyebrow, .section-title, .section-lead, .track-switch').forEach(el => observeReveal(el));

  /* =========================================================
     CONTACT FORM VALIDATION + FAKE SUBMIT
  ========================================================= */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  function setError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = form.querySelector(`.field-error[data-for="${fieldId}"]`);
    const wrapper = input.closest('.field');
    wrapper.classList.toggle('invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  function validate() {
    let valid = true;
    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const message = document.getElementById('fmessage').value.trim();

    if (!name) { setError('fname', 'Please enter your name.'); valid = false; }
    else setError('fname', '');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) { setError('femail', 'Enter a valid email address.'); valid = false; }
    else setError('femail', '');

    if (!message || message.length < 10) { setError('fmessage', 'Message should be at least 10 characters.'); valid = false; }
    else setError('fmessage', '');

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.classList.remove('show');
    if (!validate()) return;

    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      successMsg.classList.add('show');
      form.reset();
    }, 1100);
  });

  ['fname', 'femail', 'fmessage'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => setError(id, ''));
  });

  /* =========================================================
     FOOTER YEAR
  ========================================================= */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
