/**
 * User Profile & Cart JavaScript
 * Interactive tab switching, cart management, profile editing, and toast alerts.
 */

let cartState = [
  {
    id: 1,
    name: "لپ‌تاپ گیمینگ ایسوس ROG",
    price: 25000000,
    qty: 1,
    img: "https://via.placeholder.com/70",
  },
  {
    id: 2,
    name: "هدفون بی‌سیم اپل ایرپاد",
    price: 8000000,
    qty: 1,
    img: "https://via.placeholder.com/70",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  initProfileNavigation();
  initProfileForms();
  initAvatarUpload();
  renderCart();
});

// Tab Router
function initProfileNavigation() {
  const navItems = document.querySelectorAll(".profile-nav li[data-tab]");
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const tabName = item.getAttribute("data-tab");

      navItems.forEach((li) => li.classList.remove("active"));
      item.classList.add("active");

      document.querySelectorAll(".profile-tab-content").forEach((tab) => {
        tab.classList.remove("active");
      });
      const targetTab = document.getElementById(`tab-${tabName}`);
      if (targetTab) {
        targetTab.classList.add("active");
      }
    });
  });

  const logoutBtn = document.getElementById("logoutProfileBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("آیا می‌خواهید از حساب کاربری خود خارج شوید؟")) {
        showToast("با موفقیت خارج شدید", "info");
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }
}

// Cart Management
function renderCart() {
  const container = document.getElementById("cartItemsContainer");
  const badge = document.getElementById("cartBadge");
  const countStat = document.getElementById("cartCountStat");
  const summarySection = document.getElementById("cartSummarySection");

  if (!container) return;

  const totalCount = cartState.reduce((sum, item) => sum + item.qty, 0);
  if (badge) badge.textContent = totalCount;
  if (countStat) countStat.textContent = totalCount;

  if (cartState.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 20px;">سبد خرید شما خالی است.</p>`;
    if (summarySection) summarySection.style.display = "none";
    return;
  }

  if (summarySection) summarySection.style.display = "block";

  container.innerHTML = cartState
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="price">${(item.price * item.qty).toLocaleString()} تومان</p>
            </div>
            <div class="cart-quantity-controls">
                <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                <span style="font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
                <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                <button class="qty-btn" style="color:var(--danger); margin-right:8px;" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `,
    )
    .join("");

  const totalPrice = cartState.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const formattedTotal = totalPrice.toLocaleString() + " تومان";
  document.getElementById("cartTotalPrice").textContent = formattedTotal;
  document.getElementById("cartFinalPrice").textContent = formattedTotal;
}

function updateQty(id, delta) {
  const item = cartState.find((i) => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cartState = cartState.filter((i) => i.id !== id);
    }
    renderCart();
  }
}

function removeItem(id) {
  cartState = cartState.filter((i) => i.id !== id);
  renderCart();
  showToast("محصول از سبد خرید حذف شد", "info");
}

function checkoutCart() {
  if (cartState.length === 0) {
    showToast("سبد خرید شما خالی است", "info");
    return;
  }
  showToast(
    "سفارش شما با موفقیت ثبت شد و در حال انتقال به درگاه پرداخت است...",
    "success",
  );
  cartState = [];
  setTimeout(() => renderCart(), 1500);
}

// Form Handlers
function initProfileForms() {
  const personalForm = document.getElementById("personalInfoForm");
  if (personalForm) {
    personalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("inputName").value;
      const email = document.getElementById("inputEmail").value;

      document.getElementById("profileFullName").textContent = name;
      document.getElementById("profileUserEmail").textContent = email;

      showToast("اطلاعات شخصی با موفقیت ذخیره شد", "success");
    });
  }

  const securityForm = document.getElementById("securityForm");
  if (securityForm) {
    securityForm.addEventListener("submit", (e) => {
      e.preventDefault();
      securityForm.reset();
      showToast("رمز عبور با موفقیت به‌روزرسانی شد", "success");
    });
  }
}

// Avatar Upload Simulation
function initAvatarUpload() {
  const uploadInput = document.getElementById("avatarUpload");
  const avatarImg = document.getElementById("userAvatarImg");

  if (uploadInput && avatarImg) {
    uploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          avatarImg.src = event.target.result;
          showToast("تصویر پروفایل به‌روز شد", "success");
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Toast notification helper
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = type === "success" ? "fa-check-circle" : "fa-info-circle";

  toast.innerHTML = `
        <i class="fas ${icon}" style="font-size: 18px; color: var(--${type === "success" ? "success" : "primary"});"></i>
        <span>${message}</span>
    `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
