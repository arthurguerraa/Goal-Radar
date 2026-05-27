// js/services/auth.service.js

const API_BASE = "https://fstats.onrender.com/api/v1";

// ---- Funções utilitárias ----

function getToken() {
  const token = localStorage.getItem("token") || "";
  return token.replace(/^Bearer\s+/i, ""); // Remove "Bearer " se existir
}

function saveToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}

function saveUsername(username) {
  localStorage.setItem("username", username);
}

function getUsername() {
  return localStorage.getItem("username");
}

function saveEmail(email) {
  localStorage.setItem("email", email);
}

function getEmail() {
  return localStorage.getItem("email");
}

// ---- Requisição base ----

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const json = await response.json();

  if (!response.ok) {
    const error = new Error(json.message || "Erro inesperado.");
    error.fieldErrors = json.fieldErrors || {};
    error.status = response.status;
    throw error;
  }

  return json;
}

// ---- Endpoints de autenticação ----

async function register({ profilePicture, username, email, password, confirmPassword, dateOfBirth }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ profilePicture, username, email, password, confirmPassword, dateOfBirth }),
  });
}

async function login({ login, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });
}

// ---- Endpoints de verificação ----

async function confirmEmail(username, code) {
  return request(`/verify/confirm/${username}?token=${code}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

async function resendConfirmation(username) {
  return request(`/verify/resend/${username}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

async function forgotPassword(username) {
  return request(`/verify/password/forgot/${username}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

async function verifyPasswordCode(username, code) {
  return request(`/verify/email/${username}?token=${code}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

async function resetPassword(username, { newPassword, confirmNewPassword }) {
  return request(`/verify/password/reset/${username}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
    body: JSON.stringify({ newPassword, confirmNewPassword }),
  });
}

// ---- Endpoints de usuário ----

async function getUser(username) {
  return request(`/user/${username}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

async function getUserDetails(username) {
  return request(`/user/${username}/details`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

async function updateUser(username, { profilePicture, dateOfBirth, bio }) {
  return request(`/user/${username}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${getToken()}` },
    body: JSON.stringify({ profilePicture, dateOfBirth, bio }),
  });
}

async function updatePassword(username, { currentPassword, newPassword, confirmNewPassword }) {
  return request(`/user/${username}/password`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${getToken()}` },
    body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
  });
}

async function updateEmail(username, newEmail) {
  return request(`/user/${username}/email`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${getToken()}` },
    body: JSON.stringify({ newEmail }),
  });
}

async function deactivateUser(username) {
  return request(`/user/${username}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

// ---- Endpoints de competição ----

async function getCompetitions() {
  return request("/competition/code", {
    method: "GET",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

async function getCompetition(code) {
  return request(`/competition/${code}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

async function getStandings(competitionId) {
  return request(`/competition/${competitionId}/standings`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

async function getMatches(competitionId, matchday) {
  const query = matchday ? `?matchday=${matchday}` : "";
  return request(`/competition/${competitionId}/matches${query}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

async function getAverages(competitionId) {
  return request(`/competition/${competitionId}/averages`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${getToken()}` },
  });
}

// ---- Exporta tudo num objeto global ----
window.AuthService = {
  getToken,
  saveToken,
  clearToken,
  saveUsername,
  getUsername,
  saveEmail,
  getEmail,
  register,
  login,
  confirmEmail,
  resendConfirmation,
  forgotPassword,
  verifyPasswordCode,
  resetPassword,
  getUser,
  getUserDetails,
  updateUser,
  updatePassword,
  updateEmail,
  deactivateUser,
  getCompetitions,
  getCompetition,
  getStandings,
  getMatches,
  getAverages,
};

/* dar um ctrl z */