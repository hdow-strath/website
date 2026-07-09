# Research Group Site

A static site (Home/About, Team, Publications) that auto-updates its
publications list from a Google Scholar profile via a scheduled GitHub Action.

## Structure

- `index.html`, `team.html`, `publications.html` — the pages
- `css/style.css`, `js/` — styling and client-side rendering
- `data/config.json` — group name, tagline, about text, contact, Scholar profile ID
- `data/team.json` — team member cards shown on the Team page
- `data/publications.json` — **generated file**, written by the fetch script; don't hand-edit
- `scripts/fetch_publications.py` — scrapes your Scholar profile via the `scholarly` package
- `.github/workflows/publish.yml` — runs the fetch script on a weekly schedule (and on every
  push to `main`), commits any changes, then deploys the whole site to GitHub Pages

## One-time setup

1. Edit `data/config.json` with your real group name, tagline, about text, and
   confirm `scholar_id` (`i2_8yp0AAAAJ`, taken from your profile URL) is correct.
2. Edit `data/team.json` with real team members.
3. Create a GitHub repo and push this project to the `main` branch:
   ```
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
4. In the GitHub repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
5. Push (or manually run the "Update publications and deploy" workflow from
   the Actions tab) to trigger the first build. Your site will be live at
   `https://<username>.github.io/<repo>/`.

## Running the fetch script locally

Useful for testing, or for populating `data/publications.json` the first time
without waiting for CI:

```
pip install -r requirements.txt
python scripts/fetch_publications.py
```

## About the Google Scholar scraping

Google Scholar has no official API. The `scholarly` package works by scraping
scholar.google.com, which means:

- Google can show a CAPTCHA or temporarily block an IP that makes too many
  requests. GitHub Actions runners share IPs across many users, so this is
  more likely to happen in CI than when you run the script from your own
  machine.
- If a scheduled run fails, the workflow logs a warning but leaves the
  existing `data/publications.json` untouched — the site never breaks, it
  just doesn't get fresher data that week.
- If CI gets blocked repeatedly, run `python scripts/fetch_publications.py`
  locally and commit/push the result, or look into `scholarly`'s built-in
  `ProxyGenerator` for rotating proxies.

The schedule is weekly (Mondays 06:00 UTC) — edit the `cron` line in
`.github/workflows/publish.yml` to change it. You can also trigger a run
manually from the Actions tab ("Run workflow").
