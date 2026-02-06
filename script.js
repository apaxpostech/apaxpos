// ========================================
// GLOBAL CONFIG
// ========================================
const defaultConfig = {
  company_name: "APAX Software",
  hero_title: "Transform Your Ideas",
  hero_subtitle: "Into Digital Reality",
  hero_description: "We build innovative software solutions that help businesses grow and succeed in the digital world",
  services_title: "Our Services",
  services_subtitle: "Comprehensive solutions tailored to your business needs",
  cta_title: "Ready to Start Your Project?",
  cta_button: "Get Started",
};

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuClose = document.getElementById("mobile-menu-close");

  if (!mobileMenuBtn || !mobileMenu || !mobileMenuClose) return;

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("active");
  });

  mobileMenuClose.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
function initScrollToTopButton() {
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  if (!scrollToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ========================================
// TESTIMONIAL CAROUSEL
// ========================================
function initTestimonialCarousel() {
  const testimonialSlides = document.querySelectorAll(".testimonial-transparent");
  if (testimonialSlides.length === 0) return;

  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonialSlides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) {
        slide.classList.add("active");
      }
    });
  }

  function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
    showTestimonial(currentTestimonial);
  }

  // Auto rotate every 5 seconds
  setInterval(nextTestimonial, 5000);
}

// ========================================
// TEAM CAROUSEL WITH LOOPING
// ========================================
function initTeamCarousel() {
  const teamCarousel = document.getElementById("team-carousel");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const dotsContainer = document.getElementById("team-carousel-dots");

  if (!teamCarousel || !prevBtn || !nextBtn || !dotsContainer) {
    return;
  }

  // Determine cards per view (responsive)
  const computeCardsPerView = () => (window.innerWidth < 768 ? 1 : 3);
  let cardsPerView = computeCardsPerView();
  let originalCards = Array.from(
    teamCarousel.querySelectorAll(".team-member-transparent")
  );
  const n = originalCards.length;

  // If not enough cards, skip looping logic
  if (n <= cardsPerView) {
    const totalSlides = 1;
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dotsContainer.appendChild(dot);
    }
    return;
  }

  // Clone last and first groups for smooth looping
  originalCards.forEach((c) => c.classList.add("original"));

  const prependClones = originalCards.slice(-cardsPerView).map((c) => {
    const clone = c.cloneNode(true);
    clone.classList.add("clone");
    return clone;
  });

  const appendClones = originalCards.slice(0, cardsPerView).map((c) => {
    const clone = c.cloneNode(true);
    clone.classList.add("clone");
    return clone;
  });

  // Insert clones
  prependClones.forEach((cl) =>
    teamCarousel.insertBefore(cl, teamCarousel.firstChild)
  );
  appendClones.forEach((cl) => teamCarousel.appendChild(cl));

  // Rebuild card list
  let allCards = Array.from(
    teamCarousel.querySelectorAll(".team-member-transparent")
  );
  let currentIndex = cardsPerView;
  const totalSlides = Math.ceil(n / cardsPerView);

  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("div");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.dataset.index = i;
    dot.addEventListener("click", () => goToGroup(i));
    dotsContainer.appendChild(dot);
  }

  function getCardStep() {
    allCards = Array.from(
      teamCarousel.querySelectorAll(".team-member-transparent")
    );
    if (allCards.length === 0) return 0;
    const gap = 24;
    const cardWidth = allCards[0].offsetWidth;
    return cardWidth + gap;
  }

  function setTranslate(index, animate = true) {
    const step = getCardStep();
    if (!animate) {
      teamCarousel.style.transition = "none";
    } else {
      teamCarousel.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    }
    const translateX = -index * step;
    teamCarousel.style.transform = `translateX(${translateX}px)`;
    if (!animate) {
      requestAnimationFrame(() => {
        teamCarousel.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      });
    }
    updateDots();
  }

  function updateDots() {
    const groupIndex =
      Math.floor((currentIndex - cardsPerView) / cardsPerView) % totalSlides;
    const normalized = (groupIndex + totalSlides) % totalSlides;
    document.querySelectorAll(".carousel-dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === normalized);
    });
  }

  function goToGroup(groupIdx) {
    if (groupIdx < 0) groupIdx = totalSlides - 1;
    if (groupIdx >= totalSlides) groupIdx = 0;
    currentIndex = cardsPerView + groupIdx * cardsPerView;
    setTranslate(currentIndex);
  }

  function nextSlide() {
    currentIndex += cardsPerView;
    setTranslate(currentIndex);
  }

  function prevSlide() {
    currentIndex -= cardsPerView;
    setTranslate(currentIndex);
  }

  // Handle looping at carousel boundaries
  teamCarousel.addEventListener("transitionend", () => {
    if (currentIndex >= cardsPerView + n) {
      currentIndex = cardsPerView;
      setTranslate(currentIndex, false);
    } else if (currentIndex < cardsPerView) {
      const lastGroupStart =
        cardsPerView + Math.floor((n - 1) / cardsPerView) * cardsPerView;
      currentIndex = lastGroupStart;
      setTranslate(currentIndex, false);
    }
  });

  // Wire buttons
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // Auto rotate every 6 seconds
  let teamCarouselInterval = setInterval(nextSlide, 6000);
  teamCarousel.addEventListener("mouseenter", () =>
    clearInterval(teamCarouselInterval)
  );
  teamCarousel.addEventListener("mouseleave", () => {
    teamCarouselInterval = setInterval(nextSlide, 6000);
  });

  // Initialize position
  setTranslate(currentIndex, false);
}

// ========================================
// COUNTER ANIMATION
// ========================================
function animateCounter(element) {
  if (element.dataset.animated === "true") {
    return;
  }
  element.dataset.animated = "true";

  const target = parseInt(element.getAttribute("data-target")) || 0;
  const prefix = element.getAttribute("data-prefix") || "";
  const suffix = element.getAttribute("data-suffix") || "";
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = prefix + target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = prefix + Math.floor(current) + suffix;
    }
  }, 16);
}

function initCounterObserver() {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target.querySelector(".counter");
          if (counter) {
            const currentValue = counter.textContent.trim();
            if (
              (currentValue === "0" || currentValue === "") &&
              !counter.dataset.animated
            ) {
              animateCounter(counter);
            }
          } else if (entry.target.classList.contains("counter")) {
            const currentValue = entry.target.textContent.trim();
            if (
              (currentValue === "0" || currentValue === "") &&
              !entry.target.dataset.animated
            ) {
              animateCounter(entry.target);
            }
          }
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe counters
  document.querySelectorAll(".counter").forEach((counter) => {
    const currentValue = counter.textContent.trim();
    if (
      (currentValue === "0" || currentValue === "") &&
      !counter.dataset.animated
    ) {
      const wrapper = counter.closest(".transform");
      if (wrapper) {
        counterObserver.observe(wrapper);
      } else {
        counterObserver.observe(counter);
      }
    }
  });
}

function checkVisibleCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const currentValue = counter.textContent.trim();
    if (
      (currentValue === "0" || currentValue === "") &&
      !counter.dataset.animated &&
      isElementInViewport(counter)
    ) {
      animateCounter(counter);
    }
  });
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ========================================
// ELEMENT SDK CONFIGURATION
// ========================================
function initElementSDK() {
  async function onConfigChange(config) {
    const mergedConfig = { ...defaultConfig, ...config };

    const updates = [
      { id: "nav-company-name", value: mergedConfig.company_name },
      { id: "footer-company-name", value: mergedConfig.company_name },
      { id: "hero-title", value: mergedConfig.hero_title },
      { id: "hero-subtitle", value: mergedConfig.hero_subtitle },
      { id: "hero-description", value: mergedConfig.hero_description },
      { id: "services-title", value: mergedConfig.services_title },
      { id: "services-subtitle", value: mergedConfig.services_subtitle },
      { id: "cta-title", value: mergedConfig.cta_title },
      { id: "cta-btn-text", value: mergedConfig.cta_button },
    ];

    updates.forEach(({ id, value }) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  }

  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange,
      mapToCapabilities: (config) => ({
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined,
      }),
      mapToEditPanelValues: (config) =>
        new Map([
          ["company_name", config.company_name || defaultConfig.company_name],
          ["hero_title", config.hero_title || defaultConfig.hero_title],
          ["hero_subtitle", config.hero_subtitle || defaultConfig.hero_subtitle],
          ["hero_description", config.hero_description || defaultConfig.hero_description],
          ["services_title", config.services_title || defaultConfig.services_title],
          ["services_subtitle", config.services_subtitle || defaultConfig.services_subtitle],
          ["cta_title", config.cta_title || defaultConfig.cta_title],
          ["cta_button", config.cta_button || defaultConfig.cta_button],
        ]),
    });
  }
}

// ========================================
// INITIALIZE ALL FUNCTIONS
// ========================================
function initAll() {
  initNavbarScroll();
  initMobileMenu();
  initScrollToTopButton();
  initTestimonialCarousel();
  initTeamCarousel();
  initCounterObserver();
  checkVisibleCounters();
  initElementSDK();
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
