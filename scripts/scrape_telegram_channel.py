#!/usr/bin/env python3
import argparse
import csv
import html
import json
import re
import time
import urllib.request
from dataclasses import asdict, dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable


@dataclass
class Post:
    id: int
    date: str | None
    text: str
    links: list[str]
    views: str | None
    url: str


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "br":
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if data:
            self.parts.append(data)

    def text(self) -> str:
        value = "".join(self.parts)
        value = html.unescape(value)
        value = re.sub(r"\n{3,}", "\n\n", value)
        value = re.sub(r"[ \t]+\n", "\n", value)
        return value.strip()


def extract_text(fragment: str) -> str:
    parser = TextExtractor()
    parser.feed(fragment)
    return parser.text()


def fetch(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36"
            )
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", "ignore")


def parse_posts(channel: str, raw_html: str) -> list[Post]:
    blocks = re.findall(
        r'<div class="tgme_widget_message_wrap.*?(?=<div class="tgme_widget_message_wrap|</main>)',
        raw_html,
        re.S,
    )
    posts: list[Post] = []
    for block in blocks:
        id_match = re.search(rf'data-post="{re.escape(channel)}/(\d+)"', block)
        if not id_match:
            continue
        text_match = re.search(r'<div class="tgme_widget_message_text[^>]*>(.*?)</div>', block, re.S)
        if not text_match:
            continue

        post_id = int(id_match.group(1))
        date_match = re.search(r'<time datetime="([^"]+)"', block)
        views_match = re.search(r'<span class="tgme_widget_message_views">([^<]+)</span>', block)
        links = [
            html.unescape(link)
            for link in re.findall(r'<a[^>]+href="([^"]+)"', text_match.group(1))
        ]
        posts.append(
            Post(
                id=post_id,
                date=date_match.group(1) if date_match else None,
                text=extract_text(text_match.group(1)),
                links=links,
                views=views_match.group(1).strip() if views_match else None,
                url=f"https://t.me/{channel}/{post_id}",
            )
        )
    return posts


def scrape(channel: str, limit: int, pause: float) -> list[Post]:
    posts_by_id: dict[int, Post] = {}
    before: int | None = None

    while len(posts_by_id) < limit:
        url = f"https://t.me/s/{channel}" if before is None else f"https://t.me/s/{channel}?before={before}"
        page_posts = parse_posts(channel, fetch(url))
        if not page_posts:
            break

        new_count = 0
        for post in page_posts:
            if post.id not in posts_by_id:
                posts_by_id[post.id] = post
                new_count += 1

        next_before = min(post.id for post in page_posts)
        if new_count == 0 or next_before == before:
            break
        before = next_before
        time.sleep(pause)

    return sorted(posts_by_id.values(), key=lambda post: post.id, reverse=True)[:limit]


def write_json(path: Path, posts: Iterable[Post]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps([asdict(post) for post in posts], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def write_csv(path: Path, posts: Iterable[Post]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["id", "date", "text", "links", "views", "url"])
        writer.writeheader()
        for post in posts:
            row = asdict(post)
            row["links"] = " ".join(post.links)
            writer.writerow(row)


def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape public Telegram channel posts from t.me/s.")
    parser.add_argument("channel", help="Telegram channel username, for example selfmade_people")
    parser.add_argument("--limit", type=int, default=120, help="Maximum posts to collect")
    parser.add_argument("--out-dir", default="data", help="Output directory")
    parser.add_argument("--pause", type=float, default=0.5, help="Delay between page requests")
    args = parser.parse_args()

    posts = scrape(args.channel, args.limit, args.pause)
    out_dir = Path(args.out_dir)
    write_json(out_dir / f"{args.channel}_posts.json", posts)
    write_csv(out_dir / f"{args.channel}_posts.csv", posts)
    print(f"Saved {len(posts)} posts to {out_dir}")


if __name__ == "__main__":
    main()
