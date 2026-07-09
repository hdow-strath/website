async function loadTeam() {
  const grid = document.getElementById("team-grid");
  try {
    const res = await fetch("data/team.json");
    const members = await res.json();
    grid.innerHTML = "";
    members.forEach((m) => {
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
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = `<p class="status-msg">Could not load team data.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadTeam);
