function renderTeamCard(m) {
  const card = document.createElement("div");
  card.className = "team-card";
  const photo = m.photo
    ? `<img class="photo" src="${m.photo}" alt="${m.name}">`
    : `<div class="photo"></div>`;
  const link = m.url ? `<a href="${m.url}" target="_blank" rel="noopener">${m.name}</a>` : m.name;
  card.innerHTML = `
    ${photo}
    <h3>${link}</h3>
    <div class="role">${m.role || ""}</div>
    <p>${m.bio || ""}</p>
  `;
  return card;
}

async function loadTeam() {
  const statusMsg = document.getElementById("team-status-msg");
  const sections = {
    current: document.getElementById("team-section-current"),
    past: document.getElementById("team-section-past"),
  };
  const grids = {
    current: document.getElementById("team-grid-current"),
    past: document.getElementById("team-grid-past"),
  };

  try {
    const res = await fetch("data/team.json");
    const members = await res.json();

    members.forEach((m) => {
      const group = m.status === "past" ? "past" : "current";
      grids[group].appendChild(renderTeamCard(m));
    });

    statusMsg.hidden = true;
    ["current", "past"].forEach((group) => {
      if (grids[group].children.length > 0) {
        sections[group].hidden = false;
      }
    });
  } catch (err) {
    statusMsg.textContent = "Could not load team data.";
  }
}

document.addEventListener("DOMContentLoaded", loadTeam);
