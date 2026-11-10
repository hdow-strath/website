// Role types: each gets its own colour (defined in css/style.css as --role-<type>).
// Order here is also the order used in the legend.
const ROLE_TYPES = {
  pi:      { label: "Principal Investigator" },
  postdoc: { label: "Postdoc" },
  phd:     { label: "PhD" },
  masters: { label: "Master's" },
  ra:      { label: "Research Assistant" },
  intern:  { label: "Summer Internship" },
  ug:      { label: "Undergraduate Project" },
  other:   { label: "Other" },
};

// If a role has no "type", guess it from the title text.
function guessRoleType(title) {
  const t = (title || "").toLowerCase();
  if (t.includes("principal") || t.includes("lecturer")) return "pi";
  if (t.includes("postdoc") || t.includes("research associate") || t.includes("research fellow")) return "postdoc";
  if (t.includes("phd") || t.includes("doctoral")) return "phd";
  if (t.includes("master") || t.includes("msc") || t.includes("meng")) return "masters";
  if (t.includes("research assistant")) return "ra";
  if (t.includes("intern")) return "intern";
  if (t.includes("undergrad") || t.includes("ug ") || t.includes("bsc") || t.includes("beng")) return "ug";
  return "other";
}

// Accepts either the new "roles" list or the old single "role" string.
// Each role can be a string ("Research Intern") or an object
// { "title": "...", "type": "intern", "years": "2024" }.
// Roles are listed oldest first; the last one is the current / most recent.
function normaliseRoles(m) {
  const raw = Array.isArray(m.roles) && m.roles.length ? m.roles : m.role ? [m.role] : [];
  return raw.map((r) => {
    const role = typeof r === "string" ? { title: r } : { ...r };
    if (!ROLE_TYPES[role.type]) role.type = guessRoleType(role.title);
    if (!role.title) role.title = ROLE_TYPES[role.type].label;
    return role;
  });
}

function renderTeamCard(m, isPast) {
  const roles = normaliseRoles(m);
  const latest = roles[roles.length - 1];
  const previous = roles.slice(0, -1).reverse(); // most recent first

  const card = document.createElement("div");
  card.className = "team-card";
  // A bare filename ("jane-doe.jpg") is looked up in images/team/
  const photoSrc = m.photo && !m.photo.includes("/") ? `images/team/${m.photo}` : m.photo;
  const photo = photoSrc
    ? `<img class="photo" src="${photoSrc}" alt="${m.name}">`
    : `<div class="photo"></div>`;
  const link = m.url ? `<a href="${m.url}" target="_blank" rel="noopener">${m.name}</a>` : m.name;

  const years = (r) => (r.years ? `<span class="role-years">${r.years}</span>` : "");

  const currentTag = latest
    ? `<div class="role-tag role-${latest.type}${isPast ? " role-tag-past" : ""}">
         ${latest.title}${years(latest)}
       </div>`
    : "";

  const history = previous.length
    ? `<div class="role-history">
         <div class="role-history-label">Previously</div>
         <ul>
           ${previous
             .map((r) => `<li class="role-${r.type}"><span class="role-dot"></span>${r.title}${years(r)}</li>`)
             .join("")}
         </ul>
       </div>`
    : "";

  card.innerHTML = `
    ${photo}
    <h3>${link}</h3>
    ${currentTag}
    ${history}
    <p>${m.bio || ""}</p>
  `;
  return { card, types: roles.map((r) => r.type) };
}

function renderLegend(usedTypes) {
  const legend = document.getElementById("role-legend");
  if (!legend) return;
  const items = Object.keys(ROLE_TYPES)
    .filter((t) => usedTypes.has(t))
    .map((t) => `<li class="role-${t}"><span class="role-dot"></span>${ROLE_TYPES[t].label}</li>`)
    .join("");
  if (!items) return;
  legend.innerHTML = `<ul>${items}</ul>`;
  legend.hidden = false;
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
    const usedTypes = new Set();

    members.forEach((m) => {
      const group = m.status === "past" ? "past" : "current";
      const { card, types } = renderTeamCard(m, group === "past");
      types.forEach((t) => usedTypes.add(t));
      grids[group].appendChild(card);
    });

    statusMsg.hidden = true;
    renderLegend(usedTypes);
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
