// Gallery: photos are listed in data/gallery.json and stored in images/gallery/

let photos = [];
let currentIndex = 0;

function openLightbox(i) {
  currentIndex = (i + photos.length) % photos.length;
  const p = photos[currentIndex];
  const img = document.getElementById("lb-img");
  img.src = p.src;
  img.alt = p.caption || "";
  document.getElementById("lb-caption").textContent = [p.caption, p.date].filter(Boolean).join(" · ");
  document.getElementById("lightbox").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").hidden = true;
  document.body.style.overflow = "";
}

function setupLightbox() {
  const lb = document.getElementById("lightbox");
  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", () => openLightbox(currentIndex - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => openLightbox(currentIndex + 1));
  // Clicking the dark background (not the photo) closes it
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.tagName === "FIGURE") closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
  });
}

async function loadGallery() {
  const grid = document.getElementById("gallery-grid");
  try {
    const res = await fetch("data/gallery.json");
    photos = await res.json();
    grid.innerHTML = "";
    if (!photos.length) {
      grid.innerHTML = `<p class="status-msg">No photos yet.</p>`;
      return;
    }
    photos.forEach((p, i) => {
      const btn = document.createElement("button");
      btn.className = "gallery-item";
      btn.setAttribute("aria-label", p.caption || "Open photo");
      const img = document.createElement("img");
      img.src = p.src;
      img.alt = p.caption || "";
      img.loading = "lazy";
      btn.appendChild(img);
      if (p.caption) {
        const cap = document.createElement("span");
        cap.className = "gallery-caption";
        cap.textContent = p.caption;
        btn.appendChild(cap);
      }
      btn.addEventListener("click", () => openLightbox(i));
      grid.appendChild(btn);
    });
  } catch (err) {
    grid.innerHTML = `<p class="status-msg">Could not load the gallery.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupLightbox();
  loadGallery();
});
