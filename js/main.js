async function loadConfig() {
  const res = await fetch("data/config.json");
  const config = await res.json();
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.getAttribute("data-config");
    if (config[key]) {
      el.textContent = config[key];
    }
  });
  document.querySelectorAll("[data-config-href]").forEach((el) => {
    const key = el.getAttribute("data-config-href");
    if (config[key]) {
      el.setAttribute("href", config[key]);
    }
  });
  if (config.group_name) {
    document.title = document.title.replace("Research Group", config.group_name);
  }
  return config;
}

function highlightActiveNav() {
  let current = location.pathname.split("/").pop() || "index.html";
  if (current === "post.html") current = "blog.html"; // a single blog post counts as the Blog page
  document.querySelectorAll("nav.site-nav a").forEach((a) => {
    if (a.getAttribute("href") === current) {
      a.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadConfig();
  highlightActiveNav();
});
