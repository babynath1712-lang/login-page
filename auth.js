/* ============================================
   NEXORA AUTH — JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Password visibility toggle ---
  document.querySelectorAll('.auth-toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? 'none' : 'block';
        eyeClosed.style.display = isPassword ? 'block' : 'none';
      }
    });
  });

  // --- Password strength meter ---
  const signupPassword = document.getElementById('signup-password');
  const strengthMeter = document.getElementById('password-strength');
  const strengthLabel = document.getElementById('strength-label');

  if (signupPassword && strengthMeter) {
    signupPassword.addEventListener('input', () => {
      const val = signupPassword.value;
      const bars = strengthMeter.querySelectorAll('.strength-bar');

      if (val.length === 0) {
        strengthMeter.classList.remove('visible');
        bars.forEach(b => { b.className = 'strength-bar'; });
        if (strengthLabel) {
          strengthLabel.textContent = '';
          strengthLabel.className = 'strength-label';
        }
        return;
      }

      strengthMeter.classList.add('visible');

      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const levels = ['weak', 'fair', 'good', 'strong'];
      const labels = ['Weak', 'Fair', 'Good', 'Strong'];
      const levelIndex = Math.max(0, score - 1);
      const level = levels[levelIndex];

      bars.forEach((bar, i) => {
        bar.className = 'strength-bar';
        if (i <= levelIndex) {
          bar.classList.add(level);
        }
      });

      if (strengthLabel) {
        strengthLabel.textContent = labels[levelIndex];
        strengthLabel.className = `strength-label ${level}`;
      }
    });
  }

  // --- Form validation helpers ---
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(formEl, message) {
    let errorEl = formEl.parentElement.querySelector('.auth-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'auth-error';
      errorEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
        <span></span>
      `;
      formEl.parentElement.insertBefore(errorEl, formEl);
    }
    errorEl.querySelector('span').textContent = message;
    errorEl.classList.add('visible');

    // Auto-hide after 5s
    setTimeout(() => {
      errorEl.classList.remove('visible');
    }, 5000);
  }

  function showSuccess(message) {
    let toast = document.querySelector('.auth-success-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'auth-success-toast';
      toast.innerHTML = `
        <div class="toast-icon">✓</div>
        <span></span>
      `;
      document.body.appendChild(toast);
    }
    toast.querySelector('span').textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3500);
  }

  function simulateLoading(btn, callback) {
    const textEl = btn.querySelector('.auth-btn-text');
    const loaderEl = btn.querySelector('.auth-btn-loader');

    btn.disabled = true;
    if (textEl) textEl.style.display = 'none';
    if (loaderEl) loaderEl.style.display = 'flex';

    setTimeout(() => {
      btn.disabled = false;
      if (textEl) textEl.style.display = '';
      if (loaderEl) loaderEl.style.display = 'none';
      if (callback) callback();
    }, 1800);
  }

  // --- Login form submission ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      // Validation
      if (!email || !password) {
        showError(loginForm, 'Please fill in all fields.');
        return;
      }
      if (!validateEmail(email)) {
        showError(loginForm, 'Please enter a valid email address.');
        document.getElementById('login-email').classList.add('error');
        return;
      }
      if (password.length < 6) {
        showError(loginForm, 'Password must be at least 6 characters.');
        return;
      }

      // Clear error states
      document.querySelectorAll('.auth-input-wrap input').forEach(i => i.classList.remove('error'));

      const submitBtn = document.getElementById('login-submit');
      simulateLoading(submitBtn, () => {
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          // Redirect to landing page or dashboard
          window.location.href = '../index.html';
        }, 1500);
      });
    });
  }

  // --- Signup form submission ---
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const terms = document.getElementById('signup-terms').checked;

      // Validation
      if (!name || !email || !password) {
        showError(signupForm, 'Please fill in all fields.');
        return;
      }
      if (name.length < 2) {
        showError(signupForm, 'Please enter your full name.');
        return;
      }
      if (!validateEmail(email)) {
        showError(signupForm, 'Please enter a valid email address.');
        document.getElementById('signup-email').classList.add('error');
        return;
      }
      if (password.length < 8) {
        showError(signupForm, 'Password must be at least 8 characters.');
        return;
      }
      if (!terms) {
        showError(signupForm, 'You must agree to the Terms of Service.');
        return;
      }

      // Clear error states
      document.querySelectorAll('.auth-input-wrap input').forEach(i => i.classList.remove('error'));

      const submitBtn = document.getElementById('signup-submit');
      simulateLoading(submitBtn, () => {
        showSuccess('Account created successfully!');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      });
    });
  }

  // --- Clear error styling on input focus ---
  document.querySelectorAll('.auth-input-wrap input').forEach(input => {
    input.addEventListener('focus', () => {
      input.classList.remove('error');
    });
  });

  // --- Parallax effect on orbs ---
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 12;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  }, { passive: true });

  console.log('🔐 Nexora Auth Page Loaded');
});
