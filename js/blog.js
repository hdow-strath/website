// Blog: the list of posts is in data/blog.json, and each post's text is a
// Markdown file at content/blog/<slug>.md

function formatDate(d) {
  if (!d) return "";
  const date = new Date(`${d}T00:00:00`);
  if (isNaN(date)) return d;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

async function loadPosts() {
  const res = await fetch("data/blog.json");
  const posts = await res.json();
  return posts.sort((a, b) => (b.date || "").localeCompare(a.date || "")); // newest first
}

function renderPostCard(p) {
  const card = document.createElement("a");
  card.className = "post-card";
  card.href = `post.html?p=${encodeURIComponent(p.slug)}`;

  if (p.image) {
    const img = document.createElement("img");
    img.className = "post-card-img";
    img.src = p.image;
    img.alt = "";
    img.loading = "lazy";
    card.appendChild(img);
  }

  const body = document.createElement("div");
  body.className = "post-card-body";
  body.innerHTML = `
    <div class="post-meta"></div>
    <h2></h2>
    <p></p>
    <span class="post-more">Read more &rarr;</span>
  `;
  body.querySelector(".post-meta").textContent = [formatDate(p.date), p.author].filter(Boolean).join(" · ");
  body.querySelector("h2").textContent = p.title;
  body.querySelector("p").textContent = p.summary || "";
  card.appendChild(body);
  return card;
}

async function showBlogList(container) {
  try {
    const posts = await loadPosts();
    container.innerHTML = "";
    if (!posts.length) {
      container.innerHTML = `<p class="status-msg">No posts yet.</p>`;
      return;
    }
    posts.forEach((p) => container.appendChild(renderPostCard(p)));
  } catch (err) {
    container.innerHTML = `<p class="status-msg">Could not load blog posts.</p>`;
  }
}

async function showPost(bodyEl) {
  const slug = new URLSearchParams(location.search).get("p");
  try {
    const posts = await loadPosts();
    const post = posts.find((p) => p.slug === slug);
    if (!post) throw new Error("Post not found");

    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-date").textContent = formatDate(post.date);
    document.getElementById("post-author").textContent = post.author ? `By ${post.author}` : "";
    if (post.image) {
      document.getElementById("post-banner").style.backgroundImage = `url('${post.image}')`;
    }
    document.title = `${post.title} · ${document.title}`;

    bodyEl.innerHTML = await fetchMarkdown(`content/blog/${post.slug}.md`);
  } catch (err) {
    bodyEl.innerHTML = `<p class="status-msg">Sorry, that post could not be found.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("blog-list");
  const postBody = document.getElementById("post-body");
  if (list) showBlogList(list);
  if (postBody) showPost(postBody);
});
