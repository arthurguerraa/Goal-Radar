// js/components/nav-logged.js

function initNavLogged() {
  const avatarBtn = document.getElementById("nav-avatar-btn");
  const dropdown = document.getElementById("nav-dropdown");
  const logoutBtn = document.getElementById("nav-logout-btn");

  if (!avatarBtn || !dropdown) return;

  avatarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains("open");
    dropdown.classList.toggle("open", !isOpen);
    avatarBtn.setAttribute("aria-expanded", String(!isOpen));
    dropdown.setAttribute("aria-hidden", String(isOpen));
    lucide.createIcons();
  });

  document.addEventListener("click", () => {
    dropdown.classList.remove("open");
    avatarBtn.setAttribute("aria-expanded", "false");
    dropdown.setAttribute("aria-hidden", "true");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdown.classList.remove("open");
      avatarBtn.setAttribute("aria-expanded", "false");
      dropdown.setAttribute("aria-hidden", "true");
      avatarBtn.focus();
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      AuthService.clearToken();
      window.location.href = "/views/login.html";
    });
  }
}

function setActiveNavLink() {
  const links = document.querySelectorAll(".nav__link");
  const currentPath = window.location.pathname;
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      currentPath.includes(href.replace("/views/", "").replace(".html", ""))
    ) {
      link.classList.add("active");
    }
  });
}

async function loadUserNav() {
  const username = AuthService.getUsername();
  if (!username) return;

  const navUsername         = document.getElementById('nav-username');
  const navDropdownName     = document.getElementById('nav-dropdown-name');
  const navDropdownUsername = document.getElementById('nav-dropdown-username');
  const navAvatar           = document.getElementById('nav-avatar');

  // Ativa skeleton
  navUsername?.classList.add('skeleton');
  navAvatar?.classList.add('skeleton');

  try {
    const response = await AuthService.getUser(username);
    const user = response.data;

    if (navUsername) {
      navUsername.textContent = user.username;
      navUsername.classList.remove('skeleton');
    }

    if (navDropdownName)      navDropdownName.textContent     = user.username;
    if (navDropdownUsername)  navDropdownUsername.textContent = `@${user.username}`;

    if (navAvatar) {
      navAvatar.textContent = user.username.slice(0, 2).toUpperCase();
      navAvatar.classList.remove('skeleton');
    }

    if (user.profilePicture && navAvatar) {
      const img = document.createElement('img');
      img.src = user.profilePicture;
      img.alt = user.username;
      img.onload = () => img.classList.add('loaded');
      navAvatar.appendChild(img);
    }

  } catch (error) {
    navUsername?.classList.remove('skeleton');
    navAvatar?.classList.remove('skeleton');
    console.error('Erro ao carregar dados do usuário na navbar:', error);
  }
}

initNavLogged();
setActiveNavLink();
loadUserNav();
lucide.createIcons();
