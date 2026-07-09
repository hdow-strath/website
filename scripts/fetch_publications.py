"""Fetch publications for a Google Scholar profile and write them to data/publications.json.

Google Scholar has no official public API, so this uses the `scholarly` package,
which scrapes scholar.google.com. That makes it inherently fragile: Google may
show a CAPTCHA or rate-limit requests, especially from shared IPs like GitHub
Actions runners. On any failure this script exits non-zero WITHOUT touching the
existing publications.json, so a flaky run never wipes out previously fetched data.
"""

import json
import pathlib
import random
import sys
import time
from datetime import datetime, timezone

from scholarly import scholarly

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "data" / "config.json"
OUTPUT_PATH = ROOT / "data" / "publications.json"


def load_scholar_id() -> str:
    config = json.loads(CONFIG_PATH.read_text())
    scholar_id = config.get("scholar_id", "").strip()
    if not scholar_id:
        raise SystemExit("data/config.json is missing a scholar_id")
    return scholar_id


def fetch_author(scholar_id: str) -> dict:
    author = scholarly.search_author_id(scholar_id)
    return scholarly.fill(author, sections=["basics", "indices", "publications"])


def fetch_publications(author: dict) -> list[dict]:
    pubs = []
    raw_pubs = author.get("publications", [])
    for i, pub in enumerate(raw_pubs):
        try:
            filled = scholarly.fill(pub)
        except Exception as exc:  # noqa: BLE001 - keep going, one bad pub shouldn't kill the run
            print(f"  warning: could not fill publication {i}: {exc}", file=sys.stderr)
            filled = pub

        bib = filled.get("bib", {})
        year_raw = bib.get("pub_year")
        try:
            year = int(year_raw) if year_raw else None
        except (TypeError, ValueError):
            year = None

        pubs.append(
            {
                "title": bib.get("title", "Untitled"),
                "authors": bib.get("author", ""),
                "venue": bib.get("venue") or bib.get("journal") or bib.get("citation") or "",
                "year": year,
                "citations": filled.get("num_citations", 0),
                "url": filled.get("pub_url") or filled.get("eprint_url") or "",
            }
        )

        # Be gentle: individual fills are separate requests to Google Scholar.
        time.sleep(random.uniform(1.0, 2.5))

    pubs.sort(key=lambda p: (p["year"] or 0), reverse=True)
    return pubs


def main() -> None:
    scholar_id = load_scholar_id()
    print(f"Fetching Scholar profile {scholar_id} ...")

    author = fetch_author(scholar_id)
    pubs = fetch_publications(author)

    output = {
        "updated": datetime.now(timezone.utc).isoformat(),
        "author_name": author.get("name"),
        "affiliation": author.get("affiliation"),
        "citedby": author.get("citedby"),
        "h_index": author.get("hindex"),
        "publications": pubs,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, indent=2))
    print(f"Wrote {len(pubs)} publications to {OUTPUT_PATH}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print(f"fetch_publications.py failed: {exc}", file=sys.stderr)
        print("Leaving existing data/publications.json untouched.", file=sys.stderr)
        sys.exit(1)
