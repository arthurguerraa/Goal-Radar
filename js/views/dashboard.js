// js/pages/dashboard.js

// ---- Navegação entre seções ----
function initNavigation() {
  const sidebarItems = document.querySelectorAll('.sidebar__nav-item');
  const tabs         = document.querySelectorAll('.dashboard__tab');
  const sections     = document.querySelectorAll('.dashboard__section');

  function switchSection(sectionId) {
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId)?.classList.add('active');
    sidebarItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.section === sectionId);
    });
  }

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => switchSection(item.dataset.section));
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchSection(tab.dataset.section));
  });
}

// ---- Seletor de ligas ----
async function initLeagueSelector() {
  const select = document.querySelector('.sidebar__league-select');
  if (!select) return;

  try {
    const response = await AuthService.getCompetitions();
    const codes = response.data.codes;

    select.innerHTML = '';

    codes.forEach(c => {
      const option = document.createElement('option');
      option.value = c.code;              // salva o CODE no value, não o id
      option.textContent = c.name || c.code;
      select.appendChild(option);
    });

    if (codes.length > 0) {
      await loadCompetitionData(codes[0].code);  // passa só o code
    }

    select.addEventListener('change', async () => {
      await loadCompetitionData(select.value);   // select.value agora é o code
    });

  } catch (error) {
    console.error('Erro ao carregar competições:', error);
  }
}

// ---- Carrega todos os dados de uma competição ----
async function loadCompetitionData(code) {
  showSkeletons();

  try {
    // Busca os detalhes da competição pelo code
    const compResponse = await AuthService.getCompetition(code);
    const comp = compResponse.data;

    console.log('comp:', comp);           // adiciona essa linha APAGAR
    console.log('comp.id:', comp.id);     // e essa

    // Agora usa o ID real que veio da competição
    const competitionId = comp.id;
    const matchday = comp.lastFinishedMatchDay || comp.currentMatchDay || 1;

    const roundLabel = document.getElementById('round-label');
    if (roundLabel) roundLabel.textContent = `Rod. ${matchday}`;

    try {
      const standingsResponse = await AuthService.getStandings(competitionId);
      renderStandings(standingsResponse.data.standings);
    } catch (e) {
      console.error('Erro ao carregar classificação:', e.message);
      document.getElementById('tbody-classificacao').innerHTML =
        `<tr><td colspan="11" style="text-align:center;padding:var(--space-lg);color:var(--text-secondary);">Sem dados disponíveis.</td></tr>`;
    }

    try {
      const matchesResponse = await AuthService.getMatches(competitionId, matchday);
      renderMatches(matchesResponse.data.matches, matchday);
    } catch (e) {
      console.error('Erro ao carregar partidas:', e.message);
      document.getElementById('matches-list').innerHTML =
        `<p style="padding:var(--space-lg);color:var(--text-secondary);">Sem partidas disponíveis.</p>`;
    }

    try {
      const averagesResponse = await AuthService.getAverages(competitionId);
      renderAverages(averagesResponse.data.averages);
    } catch (e) {
      console.error('Erro ao carregar médias:', e.message);
      document.getElementById('tbody-gols').innerHTML =
        `<tr><td colspan="5" style="text-align:center;padding:var(--space-lg);color:var(--text-secondary);">Sem dados disponíveis.</td></tr>`;
    }

  } catch (error) {
    console.error('Erro ao carregar dados da competição:', error);
  } finally {
    hideSkeletons();
  }
}

// ---- Skeletons ----
function showSkeletons() {
  document.querySelectorAll('#tbody-classificacao, #tbody-gols, #matches-list').forEach(el => {
    el.innerHTML = `
      <tr class="skeleton-row">
        <td colspan="11">
          <div class="skeleton" style="height:36px;margin:4px 0;border-radius:4px;"></div>
          <div class="skeleton" style="height:36px;margin:4px 0;border-radius:4px;"></div>
          <div class="skeleton" style="height:36px;margin:4px 0;border-radius:4px;"></div>
        </td>
      </tr>
    `;
  });
}

function hideSkeletons() {
  document.querySelectorAll('.skeleton-row').forEach(el => el.remove());
}

// ---- Renderização da classificação ----
function renderStandings(standings) {
  const tbody = document.getElementById('tbody-classificacao');
  if (!tbody) return;

  const sorted = [...standings].sort((a, b) => a.position - b.position);

  tbody.innerHTML = sorted.map(t => {  // era standings.map, agora é sorted.map
    const form = t.form ? t.form.split(',') : [];

    return `
      <tr>
        <td>
          <span class="pos-badge ${t.position <= 4 ? 'pos-badge--top' : ''}">
            ${t.position}
          </span>
        </td>
        <td class="col-team">
          <div class="team-cell">
            <div class="team-logo">
              ${t.emblem
                ? `<img src="${t.emblem}" alt="${t.teamShortName}" />`
                : t.teamShortName.slice(0, 2).toUpperCase()
              }
            </div>
            ${t.teamShortName}
          </div>
        </td>
        <td>${t.playedGames}</td>
        <td>${t.won}</td>
        <td>${t.draw}</td>
        <td>${t.lost}</td>
        <td>${t.goalsFor}</td>
        <td>${t.goalsAgainst}</td>
        <td class="${t.goalDifference >= 0 ? 'value--green' : 'value--red'}">
          ${t.goalDifference >= 0 ? '+' : ''}${t.goalDifference}
        </td>
        <td>
          <div class="form-pills">
            ${form.map(f => `
              <span class="form-pill form-pill--${f.toLowerCase()}">${f}</span>
            `).join('')}
          </div>
        </td>
        <td class="value--bold">${t.points}</td>
      </tr>
    `;
  }).join('');
}

// ---- Renderização dos confrontos ----
function getOddClass(val) {
  if (val >= 70) return 'odd-box--high';
  if (val >= 50) return 'odd-box--medium';
  return 'odd-box--low';
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderMatches(matches, lastMatchDay) {
  const list = document.getElementById('matches-list');
  const roundLabel = document.getElementById('round-label');
  if (!list) return;

  if (roundLabel && lastMatchDay) {
    roundLabel.textContent = `Rod. ${lastMatchDay}`;
  }

  if (!matches.length) {
    list.innerHTML = '<p style="padding:var(--space-md);color:var(--text-secondary);">Nenhuma partida encontrada.</p>';
    return;
  }

  list.innerHTML = matches.map(m => {
    const homeGoals = m.home.goals ?? null;
    const awayGoals = m.away.goals ?? null;
    const hasScore  = homeGoals !== null && awayGoals !== null;

    const over05 = (m.probability.over05 * 100).toFixed(2);
    const over15 = (m.probability.over15 * 100).toFixed(2);
    const over25 = (m.probability.over25 * 100).toFixed(2);

    return `
      <div class="match-card">
        <div class="match-card__teams">
          <div class="match-card__team">
            <div class="team-logo">
              ${m.home.emblem
                ? `<img src="${m.home.emblem}" alt="${m.home.name}" />`
                : m.home.name.slice(0, 2).toUpperCase()
              }
            </div>
            ${m.home.name}
          </div>
          ${hasScore
            ? `<span class="match-card__score">${homeGoals} – ${awayGoals}</span>`
            : `<span class="match-card__time">${formatDate(m.date)}</span>`
          }
          <div class="match-card__team match-card__team--away">
            <div class="team-logo">
              ${m.away.emblem
                ? `<img src="${m.away.emblem}" alt="${m.away.name}" />`
                : m.away.name.slice(0, 2).toUpperCase()
              }
            </div>
            ${m.away.name}
          </div>
        </div>
        <div class="match-card__odds">
          <div class="odd-box ${getOddClass(over05)}">
            <span class="odd-box__label">+0.5</span>
            <span class="odd-box__value">${over05}%</span>
          </div>
          <div class="odd-box ${getOddClass(over15)}">
            <span class="odd-box__label">+1.5</span>
            <span class="odd-box__value">${over15}%</span>
          </div>
          <div class="odd-box ${getOddClass(over25)}">
            <span class="odd-box__label">+2.5</span>
            <span class="odd-box__value">${over25}%</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ---- Renderização das médias de gols ----
function renderAverages(averages) {
  const tbody = document.getElementById('tbody-gols');
  if (!tbody) return;

  tbody.innerHTML = averages.map(t => `
    <tr>
      <td class="col-team">${t.teamName}</td>
      <td class="col-group-start value--green">${t.avgGoalsForHome.toFixed(2)}</td>
      <td class="value--red">${t.avgGoalsAgainstHome.toFixed(2)}</td>
      <td class="col-group-start value--green">${t.avgGoalsForAway.toFixed(2)}</td>
      <td class="value--red">${t.avgGaolsAgainstAway.toFixed(2)}</td>
    </tr>
  `).join('');
}

// ---- Inicialização ----
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initLeagueSelector();
});