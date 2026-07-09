function formatDate(iso) {
  if (!iso) return "unknown";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

async function loadPublications() {
  const container = document.getElementById("pubs-container");
  const meta = document.getElementById("pubs-meta");
  const updated = document.getElementById("pubs-updated");

  try {
    const res = await fetch("data/publications.json");
    if (!res.ok) throw new Error("no data file yet");
    const data = await res.json();
    const pubs = data.publications || [];

    updated.textContent = `Last updated ${formatDate(data.updated)} from Google Scholar`;

    meta.innerHTML = `
      <div class="stat"><span class="value">${pubs.length}</span><span class="label">Publications</span></div>
      <div class="stat"><span class="value">${data.citedby ?? "—"}</span><span class="label">Citations</span></div>
      <div class="stat"><span class="value">${data.h_index ?? "—"}</span><span class="label">h-index</span></div>
    `;

    if (pubs.length === 0) {
      container.innerHTML = `<p class="status-msg">No publications found yet. Once the auto-update workflow runs, they'll appear here.</p>`;
      return;
    }

    const byYear = {};
    pubs.forEach((p) => {
      const y = p.year || "Unknown";
      byYear[y] = byYear[y] || [];
      byYear[y].push(p);
    });

    const years = Object.keys(byYear).sort((a, b) => b - a);
    container.innerHTML = "";
    years.forEach((year) => {
      const group = document.createElement("div");
      group.className = "pub-year-group";
      const items = byYear[year]
        .map(
          (p) => `
        <div class="pub-item">
          <div class="pub-title">${
            p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.title}</a>` : p.title
          }</div>
          <div class="pub-authors">${p.authors || ""}</div>
          <div class="pub-venue">${p.venue || ""}</div>
          <div class="pub-citations">${p.citations ?? 0} citation${p.citations === 1 ? "" : "s"}</div>
        </div>
      `
        )
        .join("");
      group.innerHTML = `<h2>${year}</h2>${items}`;
      container.appendChild(group);
    });
  } catch (err) {
    updated.textContent = "";
    container.innerHTML = `<p class="status-msg">Publications haven't been fetched yet. Run the "Update Publications" GitHub Action (or scripts/fetch_publications.py locally) to populate this page.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadPublications);
