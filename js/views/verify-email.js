/*js/pages/verify-email.js */ 

const form      = document.querySelector('.verify-form');
const submitBtn = form?.querySelector('button[type="submit"]');
const resendBtn = document.querySelector('.verify-card__resend-btn');
const username  = AuthService.getUsername();

setTimeout(() => {
  const emailEl = document.querySelector('.verify-card__subtitle strong');
  if (emailEl) {
    emailEl.textContent = AuthService.getEmail() || 'seu email';
  }
}, 300);

function getCode() {
  return [...document.querySelectorAll('.verify-form__digit')]
    .map(input => input.value)
    .join('');
}

function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? 'Verificando...' : 'Confirmar conta';
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const code = getCode();

  if (code.length < 6) {
    alert('Digite o código completo de 6 dígitos.');
    return;
  }

  setLoading(true);

  try {
    await AuthService.confirmEmail(username, code);
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
});

resendBtn?.addEventListener('click', async () => {
  resendBtn.disabled = true;
  resendBtn.textContent = 'Enviando...';

  try {
    await AuthService.resendConfirmation(username);
    resendBtn.textContent = 'Enviado!';
  } catch (error) {
    alert(error.message);
    resendBtn.textContent = 'Reenviar';
    resendBtn.disabled = false;
  }
});

initOtpInput('.verify-form__digit');