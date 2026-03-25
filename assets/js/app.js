// ========================
// i18next Configuration
// ========================

i18next.init({
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        "nav.home": "Home",
        "nav.about": "About",
        "nav.services": "Services",
        "nav.contact": "Contact",

        "hero.intro": "<strong>As a software architect</strong>, I design and implement systems from business requirements analysis through development to go-live. I support development teams in <strong>AI transformation</strong>, designing and teaching AI-powered development and testing workflows.",
        "about.role": "Software Architect",
        "about.linkedin": "LinkedIn profile",
        "about.medium": "Publications",
        "about.contact": "Contact",
        "services.title": "Services",
        "services.item1": "AI-assisted Workflows",
        "services.desc1": "I teach and support developers and testers in the effective use of AI tools.",
        "services.item2": "Software Solutions",
        "services.desc2": "Requirements analysis, implementation plans, system development, testing process support, go-live deployment.",
        "services.item3": "Testing Existing Systems",
        "services.desc3": "Generating regression tests for existing systems. At unit, integration and end-to-end levels.",
        "footer": "©2025 x-labz.net"
      }
    },
    hu: {
      translation: {
        "nav.home": "Kezdőlap",
        "nav.about": "Rólunk",
        "nav.services": "Szolgáltatások",
        "nav.contact": "Kapcsolat",

        "hero.intro": "<strong>Szoftverarchitektként</strong> rendszereket tervezek és implementálok az üzleti követelmény elemzéstől, a megvalósításon át az élesüzemig. Fejlesztőcsapatokat támogatok az <strong>AI-transzformációban</strong>, AI-alapú fejlesztési és tesztelési munkafolyamatokat alakítok ki és oktatok.",

        "about.role": "Szoftverarchitekt",
        "about.linkedin": "LinkedIn profil",
        "about.medium": "Publikációk",
        "about.contact": "Kapcsolatfelvétel",
        "services.title": "Szolgáltatások",
        "services.item1": "AI támogatott munkafolyamatok",
        "services.desc1": "Fejlesztőket és tesztelőket oktatok és támogatok az AI eszközök hatékony használatában.",
        "services.item2": "Szoftvermegoldások",
        "services.desc2": "Követelmény elemzés, implementációs tervek, rendszerek megvalósítása, tesztelési folyamatok támogatása, éles üzembe helyezés.",
        "services.item3": "Meglévő rendszerek tesztelése",
        "services.desc3": "Regressziós tesztek előállítása meglévő rendszerekhez. Unit, integrációs és end-to-end szinteken.",
        "footer": "©2025 x-labz.net"
      }
    }
  }
}, function (err, t) {
  updateContent();
});

// ========================
// Theme Management
// ========================

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
  updateThemeIcon(savedTheme);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

function updateThemeIcon(theme) {
  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) {
    // Show the OTHER theme icon (the one to switch TO)
    if (theme === 'dark') {
      themeSwitch.src = 'assets/icons/sun.svg';
      themeSwitch.alt = 'Light';
      themeSwitch.title = 'Switch to light theme';
    } else {
      themeSwitch.src = 'assets/icons/moon.svg';
      themeSwitch.alt = 'Dark';
      themeSwitch.title = 'Switch to dark theme';
    }
  }
}

// ========================
// Language Management
// ========================

function changeLanguage(lang) {
  i18next.changeLanguage(lang, updateContent);
  localStorage.setItem('language', lang);
  updateLangLabel(lang);
}

function toggleLanguage() {
  const currentLang = i18next.language;
  const newLang = currentLang === 'en' ? 'hu' : 'en';
  changeLanguage(newLang);
}

function updateLangLabel(lang) {
  const langSwitch = document.getElementById('lang-switch');
  if (langSwitch) {
    // Show the OTHER language (the one to switch TO)
    langSwitch.textContent = lang === 'en' ? 'HU' : 'EN';
  }
}

function updateContent() {
  // Helper function to safely update element
  const updateElement = (id, key) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = i18next.t(key);
    }
  };

  // Update navigation (if elements exist)
  updateElement('nav-home', 'nav.home');
  updateElement('nav-about', 'nav.about');
  updateElement('nav-services', 'nav.services');
  updateElement('nav-contact', 'nav.contact');

  // Update hero section
  updateElement('hero-title', 'hero.title');
  updateElement('hero-intro', 'hero.intro');
  updateElement('hero-subtitle', 'hero.subtitle');

  // Update about section
  updateElement('about-role', 'about.role');
  updateElement('about-link-linkedin', 'about.linkedin');
  updateElement('about-link-medium', 'about.medium');
  updateElement('about-link-contact', 'about.contact');

  // Update services section
  updateElement('services-title', 'services.title');
  updateElement('service-item1', 'services.item1');
  updateElement('service-desc1', 'services.desc1');
  updateElement('service-item2', 'services.item2');
  updateElement('service-desc2', 'services.desc2');
  updateElement('service-item3', 'services.item3');
  updateElement('service-desc3', 'services.desc3');

  // Update footer
  updateElement('footer-text', 'footer');
}

// ========================
// Event Listeners
// ========================

document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  updateLangLabel(i18next.language);
  document.getElementById('theme-switch').addEventListener('click', toggleTheme);
  document.getElementById('lang-switch').addEventListener('click', toggleLanguage);
});
