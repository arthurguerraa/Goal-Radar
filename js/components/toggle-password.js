
document.querySelectorAll('[class$="toggle-password"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    const isHidden = input.type === 'password';

    input.type = isHidden ? 'text' : 'password';
    btn.innerHTML = isHidden
      ? '<i data-lucide="eye-off"></i>'
      : '<i data-lucide="eye"></i>';

    lucide.createIcons();
  });
});

    