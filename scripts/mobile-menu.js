/* ==========================
        Mobile Menu
========================== */

const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mobileCloseBtn = document.querySelector(".mobile-close");

const mobileMenu = document.querySelector(".mobile-menu");
const mobileOverlay = document.querySelector(".mobile-overlay");

const mobileSearchBtn = document.querySelector(".mobile-search-btn");
const mobileSearchBox = document.querySelector(".mobile-search-box");
const mobileSearchInput = document.querySelector(".mobile-search-box input");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.add("active");
  mobileOverlay.classList.add("active");

  document.body.style.overflow = "hidden";
});

mobileCloseBtn.addEventListener("click", closeMobileMenu);

mobileOverlay.addEventListener("click", closeMobileMenu);

function closeMobileMenu() {
  mobileMenu.classList.remove("active");
  mobileOverlay.classList.remove("active");

  document.body.style.overflow = "";
}

/* ==========================
        Search
========================== */

mobileSearchBtn.addEventListener("click", () => {
  mobileSearchBox.classList.toggle("active");

  if (mobileSearchBox.classList.contains("active")) {
    mobileSearchInput.focus();
  }
});

/* ==========================
      First Level Menu
========================== */

const mobileDropdowns = document.querySelectorAll(".mobile-dropdown");

mobileDropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector(".mobile-dropdown-btn");

  button.addEventListener("click", () => {
    const isActive = dropdown.classList.contains("active");

    mobileDropdowns.forEach((item) => {
      if (item !== dropdown) {
        item.classList.remove("active");
      }
    });

    if (isActive) {
      dropdown.classList.remove("active");
    } else {
      dropdown.classList.add("active");
    }
  });
});

/* ==========================
      Second Level Menu
========================== */

const mobileSubDropdowns = document.querySelectorAll(".mobile-sub-dropdown");

mobileSubDropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector(".mobile-sub-btn");

  if (!button) {
    return;
  }

  button.addEventListener("click", (e) => {
    e.stopPropagation();

    const parent = dropdown.closest(".mobile-dropdown-menu");

    const isActive = dropdown.classList.contains("active");

    parent.querySelectorAll(".mobile-sub-dropdown").forEach((item) => {
      if (item !== dropdown) {
        item.classList.remove("active");
      }
    });

    if (isActive) {
      dropdown.classList.remove("active");
    } else {
      dropdown.classList.add("active");
    }
  });
});

/* ==========================
        Resize
========================== */

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});
