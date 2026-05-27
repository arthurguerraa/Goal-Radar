// js/pages/profile.js

async function loadProfile() {
  const username = AuthService.getUsername();
  if (!username) return;

  const nameEl = document.querySelector(".profile-info__name");
  const usernameEl = document.querySelector(".profile-info__username");
  const bioEl = document.querySelector(".profile-info__bio");
  const metaEl = document.querySelector(".profile-info__meta-item");
  const avatarFallback = document.querySelector(".profile-avatar__fallback");
  const avatarImg = document.querySelector(".profile-avatar__image");
  const bioInput = document.getElementById("bio-input");

  nameEl?.classList.add("skeleton");
  usernameEl?.classList.add("skeleton");
  avatarFallback?.classList.add("skeleton");

  try {
    const response = await AuthService.getUserDetails(username);
    const user = response.data;

    if (nameEl) {
      nameEl.textContent = user.username;
      nameEl.classList.remove("skeleton");
      nameEl.style.visibility = "visible"; // adiciona essa linha
    }

    if (usernameEl) {
      usernameEl.textContent = `@${user.username}`;
      usernameEl.classList.remove("skeleton");
      usernameEl.style.visibility = "visible"; // adiciona essa linha
    }

    if (bioEl) {
      bioEl.textContent = user.bio || "Nenhuma bio cadastrada.";
    }

    if (bioInput) {
      bioInput.value = user.bio || "";
    }

    if (metaEl && user.createdAt) {
      const date = new Date(user.createdAt);
      const formatted = date.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      });
      metaEl.innerHTML = `<i data-lucide="calendar"></i> Membro desde ${formatted}`;
      lucide.createIcons();
    }

    if (avatarFallback) {
      avatarFallback.textContent = user.username.slice(0, 2).toUpperCase();
      avatarFallback.classList.remove("skeleton");
    }

    if (avatarImg) {
      avatarImg.alt = `Foto de perfil de ${user.username}`;
    }

    if (user.profilePicture && avatarImg) {
      avatarImg.src = user.profilePicture;
      avatarImg.onload = () => avatarImg.classList.add("loaded");
    }
  } catch (error) {
    nameEl?.classList.remove("skeleton");
    nameEl && (nameEl.style.visibility = "visible");
    usernameEl?.classList.remove("skeleton");
    usernameEl && (usernameEl.style.visibility = "visible");
    avatarFallback?.classList.remove("skeleton");
    console.error("Erro ao carregar perfil:", error);
  }
}

function initBioEdit() {
  const username = AuthService.getUsername();
  const bioEl = document.querySelector(".profile-info__bio");
  const bioForm = document.getElementById("bio-form");
  const bioInput = document.getElementById("bio-input");
  const editBtn = document.getElementById("bio-edit-btn");
  const saveBtn = document.getElementById("bio-save-btn");
  const cancelBtn = document.getElementById("bio-cancel-btn");

  if (!editBtn || !bioForm) return;

  // Abre o formulário
  editBtn.addEventListener("click", () => {
    bioForm.style.display = "flex";
    editBtn.style.display = "none";
    bioInput.focus();
  });

  // Cancela a edição
  cancelBtn.addEventListener("click", () => {
    bioForm.style.display = "none";
    editBtn.style.display = "inline-flex";
    // Restaura o valor original
    bioInput.value =
      bioEl?.textContent === "Nenhuma bio cadastrada."
        ? ""
        : bioEl?.textContent || "";
  });

  // Salva a bio
  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "Salvando...";

    try {
      await AuthService.updateUser(username, {
        bio: bioInput.value.trim(),
        dateOfBirth: "",
        profilePicture: "",
      });

      // Atualiza o texto da bio na tela
      if (bioEl) {
        bioEl.textContent = bioInput.value.trim() || "Nenhuma bio cadastrada.";
      }

      bioForm.style.display = "none";
      editBtn.style.display = "inline-flex";
    } catch (error) {
      alert(error.message);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Salvar";
    }
  });
}

loadProfile();
initBioEdit();
