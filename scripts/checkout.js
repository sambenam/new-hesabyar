/**
 * Checkout Page JavaScript
 * Handles discount code application and purchase confirmation.
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("🛍️ صفحه پیش‌پرداخت (Checkout) بارگذاری شد.");
});

// Simulate applying discount code
function applyDiscount() {
  const input = document.getElementById("discountInput");
  if (!input || !input.value.trim()) {
    alert("لطفاً کد تخفیف را وارد کنید.");
    return;
  }

  const code = input.value.trim();
  if (code === "DISCOUNT10" || code === "OFF10") {
    alert("کد تخفیف ۱۰ درصدی با موفقیت اعمال شد!");

    // Show discount row and update prices
    document.getElementById("discountRow").style.display = "flex";
    document.getElementById("discountAmount").textContent = "۳,۳۰۰,۰۰۰ تومان";
    document.getElementById("cartFinalPrice").textContent = "۲۹,۷۰۰,۰۰۰ تومان";
  } else {
    alert("کد تخفیف نامعتبر یا منقضی شده است.");
  }
}
