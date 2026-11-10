// Turns Markdown text into HTML. Uses the "marked" library if it loaded,
// otherwise falls back to plain paragraphs so the page still shows the text.
function renderMarkdown(text) {
  if (window.marked) return window.marked.parse(text);
  const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return text
    .split(/\n\s*\n/)
    .map((p) => `<p>${escape(p.trim())}</p>`)
    .join("");
}

async function fetchMarkdown(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return renderMarkdown(await res.text());
}

// Any element with data-markdown="path/to/file.md" gets that file's contents.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-markdown]").forEach(async (el) => {
    try {
      el.innerHTML = await fetchMarkdown(el.getAttribute("data-markdown"));
    } catch (err) {
      el.innerHTML = `<p class="status-msg">Could not load content.</p>`;
    }
  });
});
