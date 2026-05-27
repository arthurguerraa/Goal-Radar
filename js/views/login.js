// js/pages/login.js

// js/pages/login.js

const form      = document.querySelector('.login-form');
const submitBtn = form?.querySelector('button[type="submit"]');

function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? 'Entrando...' : 'Entrar';
}

function showError(message) {
  let error = document.querySelector('.login-form__error-global');
  if (!error) {
    error = document.createElement('p');
    error.className = 'login-form__error-global';
    submitBtn.before(error);
  }
  error.textContent = message;
}

// Decodifica o token JWT e extrai o username (campo "sub")
function getUsernameFromToken(token) {
  try {
    const base64 = token.split(' ')[1];
    // Corrige encoding de caracteres especiais
    const payload = JSON.parse(
      decodeURIComponent(
        atob(base64.split('.')[1])
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    );
    return payload.sub;
  } catch {
    return null;
  }
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await AuthService.login({
      login:    form.identifier.value.trim(),
      password: form.password.value,
    });

    const token = response.data.token;
    AuthService.saveToken(token);

    // Extrai o username do token JWT
    const username = getUsernameFromToken(token);
    if (username) AuthService.saveUsername(username);

    window.location.href = 'dashboard.html';

  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
});