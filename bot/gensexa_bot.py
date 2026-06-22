#!/usr/bin/env python3
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parents[1]
TOKEN_ENV = "GENSEXA_BOT_TOKEN"
WEB_APP_URL_ENV = "GENSEXA_WEB_APP_URL"


def load_local_env() -> None:
    for path in (BASE_DIR / ".env.local", BASE_DIR / ".env"):
        if not path.exists():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def api_url(token: str, method: str) -> str:
    return f"https://api.telegram.org/bot{token}/{method}"


def request_json(token: str, method: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    data = None
    headers = {"Content-Type": "application/json"}
    if payload is not None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(api_url(token, method), data=data, headers=headers)
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def app_keyboard(web_app_url: str) -> dict[str, Any]:
    if web_app_url.startswith("https://"):
        button = {"text": "Открыть приложение", "web_app": {"url": web_app_url}}
    else:
        button = {"text": "Открыть приложение", "url": web_app_url}
    return {"inline_keyboard": [[button]]}


def send_intro(token: str, chat_id: int, web_app_url: str) -> None:
    text = (
        "Ген сексуальности\n\n"
        "Твой мягкий трекер тазового дна: практики, уроки, цикл и контакт с телом.\n\n"
        "Нажми кнопку ниже, чтобы открыть приложение."
    )
    request_json(
        token,
        "sendMessage",
        {
            "chat_id": chat_id,
            "text": text,
            "reply_markup": app_keyboard(web_app_url),
            "disable_web_page_preview": True,
        },
    )


def handle_update(token: str, web_app_url: str, update: dict[str, Any]) -> None:
    message = update.get("message")
    if not message:
        return
    chat = message.get("chat")
    if not chat:
        return
    send_intro(token, chat["id"], web_app_url)


def run() -> None:
    load_local_env()
    token = os.getenv(TOKEN_ENV)
    web_app_url = os.getenv(WEB_APP_URL_ENV)
    if not token:
        raise SystemExit(f"Set {TOKEN_ENV} in .env.local or environment.")
    if not web_app_url:
        raise SystemExit(f"Set {WEB_APP_URL_ENV} in .env.local or environment.")

    offset = 0
    print("Bot is running. Press Ctrl+C to stop.")
    print(f"Web app URL: {web_app_url}")
    while True:
        try:
            result = request_json(
                token,
                "getUpdates",
                {"timeout": 50, "offset": offset, "allowed_updates": ["message"]},
            )
            for update in result.get("result", []):
                offset = max(offset, update["update_id"] + 1)
                handle_update(token, web_app_url, update)
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", "ignore")
            print(f"Telegram API error: {exc.code} {body}")
            time.sleep(3)
        except urllib.error.URLError as exc:
            print(f"Network error: {exc}. Retrying...")
            time.sleep(3)
        except KeyboardInterrupt:
            print("Stopped.")
            return


if __name__ == "__main__":
    run()
