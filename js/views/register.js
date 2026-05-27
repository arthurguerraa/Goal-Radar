// js/pages/register.js

const form        = document.querySelector('.register-form');
const submitBtn   = form?.querySelector('button[type="submit"]');

function showFieldErrors(errors) {
  // Limpa erros anteriores
  document.querySelectorAll('.register-form__error').forEach(el => el.remove());

  Object.entries(errors).forEach(([field, message]) => {
    const input = document.getElementById(field)
                  || document.querySelector(`[name="${field}"]`);
    if (!input) return;

    const error = document.createElement('p');
    error.className = 'register-form__error';
    error.textContent = message;
    input.closest('.register-form__field').appendChild(error);
  });
}

function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? 'Criando conta...' : 'Criar conta';
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoading(true);

  const data = {
    username:        form.username.value.trim(),
    email:           form.email.value.trim(),
    password:        form.password.value,
    confirmPassword: form['password-confirm'].value,
    dateOfBirth:     form.birthdate.value,
    profilePicture:  '',               // Sem upload de foto por enquanto
  };

  try {
    const response = await AuthService.register(data);

    // Salva o token e o username pra usar nas próximas telas
    AuthService.saveToken(response.data.token);
    AuthService.saveUsername(data.username);
    AuthService.saveEmail(data.email);  // novo

    // Redireciona pra tela de verificação de email
    window.location.href = 'verify-email.html';

  } catch (error) {
    // Erros de campo (ex: email já cadastrado)
    if (Object.keys(error.fieldErrors).length > 0) {
      showFieldErrors(error.fieldErrors);
    } else {
      alert(error.message);
    }
  } finally {
    setLoading(false);
  }
});