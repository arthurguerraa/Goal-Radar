// js/pages/forgot-password.js

const form      = document.querySelector('.forgot-form');
const submitBtn = form?.querySelector('button[type="submit"]');

function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? 'Enviando...' : 'Enviar código';
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoading(true);

  const email = form.email.value.trim();

  try {
    await AuthService.forgotPassword(email);

    // Salva o email pra usar nas próximas telas
    AuthService.saveEmail(email);
    AuthService.saveUsername(email); // salva como username também pra usar no endpoint

    window.location.href = 'reset-password-code.html';
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
});