document.addEventListener("DOMContentLoaded", () => {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  function switchTab(tabId) {
    tabBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    tabContents.forEach((content) => {
      content.classList.toggle("active", content.id === tabId);
    });
    const url = new URL(window.location);
    url.searchParams.set("tab", tabId);
    window.history.replaceState({}, "", url);
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // اگه با ?tab=register اومدی مستقیم ثبت‌نام رو نشون بده
  const params = new URLSearchParams(window.location.search);
  if (params.get("tab") === "register") {
    switchTab("register");
  } else {
    switchTab("login");
  }

  // چشمک رمز عبور
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = icon.previousElementSibling;
      input.type = input.type === "password" ? "text" : "password";
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  });

  // فرم‌ها (دمو - بعدا به API وصل میشه)
  document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("ورود دمو OK");
    window.location.href = "index.html";
  });
  document.getElementById("registerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("registerConfirmPassword").value;
    if (pass !== confirm) {
      alert("رمزها یکی نیست");
      return;
    }
    alert("ثبت‌نام OK - حالا وارد شو");
    switchTab("login");
  });
});
