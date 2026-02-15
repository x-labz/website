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
        "hero.title": "Welcome to My Website",
        "hero.subtitle": "Building beautiful, responsive websites",
        "about.title": "About Us",
        "about.description": "We create modern, fast, and accessible web experiences using the latest technologies and best practices.",
        "services.title": "Services",
        "services.item1": "Web Design",
        "services.item2": "Responsive Development",
        "services.item3": "Performance Optimization",
        "footer": "© 2026 My Website. All rights reserved."
      }
    },
    hu: {
      translation: {
        "nav.home": "Kezdőlap",
        "nav.about": "Rólunk",
        "nav.services": "Szolgáltatások",
        "nav.contact": "Kapcsolat",
        "hero.title": "Üdvözlünk a weboldalamon",
        "hero.subtitle": "Gyönyörű, reszponzív webhelyek építése",
        "about.title": "Rólunk",
        "about.description": "Modern, gyors és hozzáférhető webes tapasztalatokat hozunk létre a legújabb technológiák és ajánlott eljárások segítségével.",
        "services.title": "Szolgáltatások",
        "services.item1": "Web Tervezés",
        "services.item2": "Reszponzív Fejlesztés",
        "services.item3": "Teljesítmény Optimalizálás",
        "footer": "© 2026 Saját weboldal. Minden jog fenntartva."
      }
    }
  }
}, function(err, t) {
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
      el.textContent = i18next.t(key);
    }
  };
  
  // Update navigation (if elements exist)
  updateElement('nav-home', 'nav.home');
  updateElement('nav-about', 'nav.about');
  updateElement('nav-services', 'nav.services');
  updateElement('nav-contact', 'nav.contact');
  
  // Update hero section
  updateElement('hero-title', 'hero.title');
  updateElement('hero-subtitle', 'hero.subtitle');
  
  // Update about section
  updateElement('about-title', 'about.title');
  updateElement('about-description', 'about.description');
  
  // Update services section
  updateElement('services-title', 'services.title');
  updateElement('service-item1', 'services.item1');
  updateElement('service-item2', 'services.item2');
  updateElement('service-item3', 'services.item3');
  
  // Update footer
  updateElement('footer-text', 'footer');
}

// ========================
// Event Listeners
// ========================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initTheme();
  
  // Initialize language label
  updateLangLabel(i18next.language);
  
  // Theme toggle listener
  document.getElementById('theme-switch').addEventListener('click', function() {
    toggleTheme();
  });
  
  // Language toggle listener
  document.getElementById('lang-switch').addEventListener('click', function() {
    toggleLanguage();
  });
});
