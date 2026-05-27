// js/pages/reset-password.js

const form      = document.querySelector('.reset-password-form');
const submitBtn = form?.querySelector('button[type="submit"]');
const username  = AuthService.getUsername();

function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? 'Salvando...' : 'Salvar nova senha';
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoading(true);

  const newPassword        = form.password.value;
  const confirmNewPassword = form['password-confirm'].value;

  if (newPassword !== confirmNewPassword) {
    alert('As senhas não coincidem.');
    setLoading(false);
    return;
  }

  try {
    await AuthService.resetPassword(username, { newPassword, confirmNewPassword });

    // Senha redefinida — volta pro login
    alert('Senha redefinida com sucesso!');
    window.location.href = 'login.html';

  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
});