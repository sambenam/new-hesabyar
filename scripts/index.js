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

// toggle theme
// شب = حالت فعلی سایت - پیشفرض
(function () {
  const KEY = "hesabyar-theme";
  const html = document.documentElement;
  function getTheme() {
    return localStorage.getItem(KEY) || "dark";
  }
  function applyTheme(t) {
    if (t === "light") html.setAttribute("data-theme", "light");
    else html.removeAttribute("data-theme");
    localStorage.setItem(KEY, t);
  }
  function toggleTheme() {
    const cur = html.getAttribute("data-theme") === "light" ? "light" : "dark";
    applyTheme(cur === "light" ? "dark" : "light");
  }
  applyTheme(getTheme());
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.addEventListener("click", toggleTheme);
  });
  window.toggleHesabyarTheme = toggleTheme;
})();

// up btn
const scrollTopBtn = document.querySelector(".scroll-top-btn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ai widget

const widget = document.getElementById("aiWidget");
const toggleBtn = document.getElementById("aiToggleBtn");
const closeBtn = document.getElementById("aiCloseBtn");
const messagesEl = document.getElementById("aiMessages");
const inputEl = document.getElementById("aiInput");
const sendBtn = document.getElementById("aiSendBtn");

function openChat() {
  widget.classList.add("open");
  inputEl.focus();
}
function closeChat() {
  widget.classList.remove("open");
}
toggleBtn.addEventListener("click", () =>
  widget.classList.contains("open") ? closeChat() : openChat(),
);
closeBtn.addEventListener("click", closeChat);

function addMessage(text, who = "bot") {
  const div = document.createElement("div");
  div.className = `ai-message ${who}`;
  div.innerHTML = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ===== اینجا هوش مصنوعی واقعی رو وصل میکنی =====
async function askAI(question) {
  // TODO: اینو بعدا به API خودت وصل کن:
  // const res = await fetch('/api/ai', {method:'POST', body:JSON.stringify({question})});
  // const data = await res.json(); return data.answer;

  // فعلا دمو:
  await new Promise((r) => setTimeout(r, 1000));
  return `جواب هوش مصنوعی برای: "${question}" - اینجا بعدا به API واقعی وصل میشه.`;
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  addMessage(text, "user");
  inputEl.value = "";
  const typing = document.createElement("div");
  typing.textContent = "...";
  messagesEl.appendChild(typing);
  const answer = await askAI(text);
  typing.remove();
  addMessage(answer, "bot");
}
sendBtn.addEventListener("click", sendMessage);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("ai-suggestion")) {
    inputEl.value = e.target.textContent;
    sendMessage();
  }
});
