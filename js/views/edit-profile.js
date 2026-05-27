// js/views/edit-profile.js

const username = AuthService.getUsername();

// ---- Carrega os dados atuais do usuário ----
async function loadUserData() {
  try {
    const response = await AuthService.getUserDetails(username);
    const user = response.data;

    // Preenche data de nascimento
    const birthdateInput = document.getElementById('birthdate');
    if (birthdateInput && user.dateOfBirth) {
      birthdateInput.value = user.dateOfBirth;
    }

    // Preenche email atual
    const emailCurrent = document.querySelector('.edit-card__email-current');
    if (emailCurrent && user.email) {
      emailCurrent.textContent = user.email;
      AuthService.saveEmail(user.email);
    }

    // Badge de verificado ou pendente
    const badge = document.querySelector('.edit-card__badge');
    if (badge) {
      if (user.verified) {
        badge.className = 'edit-card__badge edit-card__badge--verified';
        badge.innerHTML = '<i data-lucide="check"></i> Email verificado';
      } else {
        badge.className = 'edit-card__badge edit-card__badge--pending';
        badge.innerHTML = '<i data-lucide="clock"></i> Verificação pendente';
      }
      lucide.createIcons();
    }

  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
  }
}

// ---- Atualizar data de nascimento ----
const birthdateForm = document.querySelector('.edit-card:nth-child(1) .edit-form');
birthdateForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = birthdateForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  try {
    await AuthService.updateUser(username, {
      dateOfBirth: document.getElementById('birthdate').value,
      profilePicture: '',
    });
    btn.textContent = 'Salvo!';
    setTimeout(() => btn.textContent = 'Salvar', 2000);
  } catch (error) {
    alert(error.message);
    btn.textContent = 'Salvar';
  } finally {
    btn.disabled = false;
  }
});

// ---- Solicitar alteração de email ----
const emailForm = document.querySelector('.edit-card:nth-child(2) .edit-form');
emailForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = emailForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    await AuthService.updateEmail(username, document.getElementById('new-email').value.trim());
    alert('Solicitação enviada! Verifique o novo email para confirmar.');
    document.getElementById('new-email').value = '';
    btn.textContent = 'Solicitar alteração';
  } catch (error) {
    alert(error.message);
    btn.textContent = 'Solicitar alteração';
  } finally {
    btn.disabled = false;
  }
});

// ---- Alterar senha ----
const passwordForm = document.querySelector('.edit-card:nth-child(3) .edit-form');
passwordForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = passwordForm.querySelector('button[type="submit"]');

  const newPassword        = document.getElementById('new-password').value;
  const confirmNewPassword = document.getElementById('confirm-password').value;

  if (newPassword !== confirmNewPassword) {
    alert('As senhas não coincidem.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Salvando...';

  try {
    await AuthService.updatePassword(username, {
      currentPassword:    document.getElementById('current-password').value,
      newPassword,
      confirmNewPassword,
    });
    alert('Senha alterada com sucesso!');
    passwordForm.reset();
    btn.textContent = 'Salvar senha';
  } catch (error) {
    alert(error.message);
    btn.textContent = 'Salvar senha';
  } finally {
    btn.disabled = false;
  }
});

// ---- Desativar conta ----
const deactivateBtn = document.querySelector('.btn--danger');
deactivateBtn?.addEventListener('click', async () => {
  const confirmed = confirm('Tem certeza que deseja desativar sua conta? Ela ficará inacessível até você reativá-la.');
  if (!confirmed) return;

  try {
    await AuthService.deactivateUser(username);
    AuthService.clearToken();
    window.location.href = '../index.html';
  } catch (error) {
    alert(error.message);
  }
});

// ---- Sair da conta ----
const logoutBtn = document.querySelector('.btn--outline');
logoutBtn?.addEventListener('click', () => {
  AuthService.clearToken();
  window.location.href = '../views/login.html';
});

// ---- Inicializa ----
loadUserData();