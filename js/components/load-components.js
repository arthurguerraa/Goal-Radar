// js/components/load-components.js

async function loadComponent(selector, path) {
  const element = document.querySelector(selector);
  if (!element) return;             // Sai se o elemento não existir na página

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Erro ao carregar ${path}`);
    const html = await response.text();
    element.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

async function loadComponents() {
  const base = '/Goal-Radar/';

  await Promise.all([
    loadComponent('#nav-placeholder', `${base}components/nav.html`),
    loadComponent('#nav-logged-placeholder', `${base}components/nav-logged.html`),
    loadComponent('#footer-placeholder', `${base}components/footer.html`),
  ]);

  if (document.getElementById('nav-logged-placeholder')) {
    const script = document.createElement('script');
    script.src = `${base}js/components/nav-logged.js`;
    document.body.appendChild(script);
  }
}

loadComponents();

/*

FUNCIONANDO 

async function loadComponents() {
  const isInViews = window.location.pathname.includes('/views/');
  const base = isInViews ? '../' : './';

  await Promise.all([
    loadComponent('#nav-placeholder', `${base}components/nav.html`),
    loadComponent('#footer-placeholder', `${base}components/footer.html`),
  ]);
}

*/