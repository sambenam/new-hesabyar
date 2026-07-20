/**
 * Gateway Desktop Script
 * Handles card formatting, captcha regeneration, timer countdown, and OTP requests.
 */

document.addEventListener("DOMContentLoaded", () => {
  initCardFormatting();
  initCountdownTimer();
});

// 1. Auto format card number with dashes every 4 digits
function initCardFormatting() {
  const cardInput = document.getElementById("cardNumber");
  if (!cardInput) return;

  cardInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += "-";
      }
      formattedValue += value[i];
    }

    e.target.value = formattedValue.substring(0, 23);
  });
}

// 2. Refresh Captcha Code
function refreshCaptcha() {
  const captchaSpan = document.getElementById("captchaCode");
  if (!captchaSpan) return;

  // Generate random 5-digit number
  const randomCode = Math.floor(10000 + Math.random() * 90000);
  captchaSpan.textContent = randomCode;
}

// 3. Request OTP / Dynamic Password
function requestOtp() {
  const btn = document.querySelector(".btn-otp-request");
  if (!btn) return;

  let countdown = 60;
  btn.disabled = true;
  btn.style.opacity = "0.6";

  alert("رمز دوم پویا با موفقیت به شماره همراه شما ارسال شد.");

  const timer = setInterval(() => {
    btn.innerHTML = `<i class="fas fa-clock"></i> ارسال مجدد (${countdown}s)`;
    countdown--;

    if (countdown < 0) {
      clearInterval(timer);
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> دریافت رمز پویا';
      (btn.disabled, false);
      btn.style.opacity = "1";
    }
  }, 1000);
}

// 4. Topbar Countdown Timer (9:50 counting down)
function initCountdownTimer() {
  const timerElem = document.getElementById("countdownTimer");
  if (!timerElem) return;

  let totalSeconds = 9 * 60 + 50; // 9 minutes 50 seconds

  const interval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(interval);
      alert("زمان تراکنش به پایان رسید. لطفاً مجدداً تلاش کنید.");
      window.location.href = "checkout.html";
      return;
    }

    totalSeconds--;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    timerElem.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 1000);
}
