document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const intro = document.getElementById('intro');
  const siteShell = document.getElementById('siteShell');
  const powerSwitch = document.getElementById('powerSwitch');
  const navbar = document.getElementById('navbar');
  const scrollTopButton = document.getElementById('scrollTopButton');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('#home, #services, #testimonials, #playground, #ux-challenge, #contact');
  const revealElements = document.querySelectorAll('.reveal');
  const cursorGlow = document.getElementById('cursorGlow');

  let introActivated = false;

  function revealSite() {
    if (introActivated) return;
    introActivated = true;
    body.classList.remove('intro-lock');
    siteShell.classList.add('visible');
    intro.classList.add('hidden');
  }

  if (powerSwitch) {
    powerSwitch.addEventListener('click', revealSite);
    powerSwitch.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        revealSite();
      }
    });
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navMenu?.classList.remove('active');
      menuToggle?.classList.remove('active');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }

    if (navbar) {
      navbar.classList.toggle('scrolled', scrollTop > 30);
    }

    if (scrollTopButton) {
      scrollTopButton.classList.toggle('visible', scrollTop > 500);
    }

    let currentId = 'home';
    sections.forEach(section => {
      const top = section.offsetTop - 180;
      if (scrollTop >= top) currentId = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  if (scrollTopButton) {
    scrollTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (cursorGlow) {
    window.addEventListener('pointermove', event => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    });
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        entry.target.style.setProperty('--delay', `${delay}ms`);
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  revealElements.forEach(element => revealObserver.observe(element));

  const parallaxElements = document.querySelectorAll('.parallax-layer');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(layer => {
      const speed = Number(layer.dataset.speed || 0.08);
      layer.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });
  }, { passive: true });

  const magneticElements = document.querySelectorAll('.magnetic');
  magneticElements.forEach(element => {
    element.addEventListener('mousemove', event => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.06}px, ${y * 0.06}px)`;
    });
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translate(0, 0)';
    });
  });

  const serviceButtons = document.querySelectorAll('.service-btn');
  const servicePanels = document.querySelectorAll('.service-panel');
  serviceButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.service;
      serviceButtons.forEach(item => item.classList.remove('active'));
      servicePanels.forEach(panel => panel.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(`service-${target}`)?.classList.add('active');
    });
  });

  document.querySelectorAll('.micro-btn, .btn-primary').forEach(button => {
    button.addEventListener('click', event => {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const dynamicStyle = document.createElement('style');
  dynamicStyle.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      background: rgba(255,255,255,.32);
      transform: scale(0);
      animation: ripple-effect 700ms ease-out forwards;
    }
    @keyframes ripple-effect {
      to { transform: scale(2.8); opacity: 0; }
    }
  `;
  document.head.appendChild(dynamicStyle);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active = themeToggle.classList.toggle('active');
      themeToggle.setAttribute('aria-pressed', String(active));
      document.body.classList.toggle('visual-mode', active);
    });
  }

  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const group = item?.parentElement;
      if (!item || !group) return;

      group.querySelectorAll('.accordion-item').forEach(entry => {
        const button = entry.querySelector('.accordion-trigger');
        if (entry !== item) {
          entry.classList.remove('active');
          button?.setAttribute('aria-expanded', 'false');
        }
      });

      const isActive = item.classList.toggle('active');
      trigger.setAttribute('aria-expanded', String(isActive));
    });
  });

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;
      tabButtons.forEach(entry => {
        entry.classList.remove('active');
        entry.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(panel => panel.classList.remove('active'));
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      document.getElementById(target)?.classList.add('active');
    });
  });

  document.querySelectorAll('.choice-btn').forEach(button => {
    button.addEventListener('click', () => {
      button.parentElement?.querySelectorAll('.choice-btn').forEach(entry => entry.classList.remove('active'));
      button.classList.add('active');
    });
  });

  const tiltCard = document.getElementById('tiltCard');
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', event => {
      const rect = tiltCard.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 10;
      tiltCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }

  const revealBtn = document.getElementById('uxRevealBtn');
  const resetBtn = document.getElementById('uxResetBtn');
  const badUI = document.getElementById('badUI');
  const goodUI = document.getElementById('goodUI');

  revealBtn?.addEventListener('click', () => {
    badUI?.classList.remove('active');
    goodUI?.classList.add('active');
  });
  resetBtn?.addEventListener('click', () => {
    goodUI?.classList.remove('active');
    badUI?.classList.add('active');
  });

});

const themeToggle = document.getElementById('themeToggle');
const demoThemeCard = document.getElementById('demoThemeCard');
const toggleLabel = document.getElementById('toggleLabel');

if (themeToggle && demoThemeCard && toggleLabel) {
  themeToggle.addEventListener('click', () => {
    demoThemeCard.classList.toggle('light-mode');

    const isLightMode = demoThemeCard.classList.contains('light-mode');

    themeToggle.setAttribute('aria-pressed', String(isLightMode));
    toggleLabel.textContent = isLightMode ? 'Modo Claro' : 'Modo Escuro';
  });
}

