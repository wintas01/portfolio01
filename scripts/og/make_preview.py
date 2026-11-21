"""Make the link-preview image (what WhatsApp, Facebook, LinkedIn and X show when
someone shares the website) from the freshly built site, so it always matches
what the homepage looks like now.

Run in the deploy workflow after `vite build`:

    python scripts/og/make_preview.py <built site folder> <site url> <version>

It serves the built folder locally, takes a 1200x630 screenshot of the homepage
(the size these apps expect), saves it as og-preview.png in the built folder,
and points og:image / twitter:image in the built index.html at it, with the
version (the commit) added so apps fetch the new picture instead of an old copy.
If anything fails, the built site is left as it was (the photo stays the preview).
"""

import functools
import http.server
import os
import re
import shutil
import sys
import tempfile
import threading

from playwright.sync_api import sync_playwright

WIDTH, HEIGHT = 1200, 630


def main() -> int:
    site_dir, site_url, version = sys.argv[1], sys.argv[2].rstrip("/") + "/", sys.argv[3]
    index = os.path.join(site_dir, "index.html")
    if not os.path.isfile(index):
        print(f"No index.html in {site_dir}; skipping preview image.")
        return 1

    # The site is built for the /portfolio01/ path, so serve it under that name.
    base = "/" + site_url.split("://", 1)[-1].split("/", 1)[-1]
    root = tempfile.mkdtemp()
    os.symlink(os.path.abspath(site_dir), os.path.join(root, base.strip("/")))
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    handler = functools.partial(Quiet, directory=root)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    local = f"http://127.0.0.1:{server.server_address[1]}{base}?lang=en"

    out = os.path.join(site_dir, "og-preview.png")
    chrome = os.environ.get("CHROME_PATH") or shutil.which("google-chrome") or shutil.which("google-chrome-stable")
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path=chrome) if chrome else p.chromium.launch()
            # Reduced motion skips the intro video and holds animations still.
            page = browser.new_page(
                viewport={"width": WIDTH, "height": HEIGHT},
                device_scale_factor=1,
                reduced_motion="reduce",
            )
            page.goto(local, wait_until="networkidle", timeout=45000)
            page.evaluate("document.documentElement.classList.remove('intro-on')")
            page.evaluate("document.fonts && document.fonts.ready")
            page.wait_for_timeout(1500)
            page.screenshot(path=out)
            browser.close()
    finally:
        server.shutdown()
        shutil.rmtree(root, ignore_errors=True)

    if not os.path.isfile(out) or os.path.getsize(out) < 10_000:
        print("Preview screenshot missing or empty; keeping the old preview.")
        return 1

    image_url = f"{site_url}og-preview.png?v={version[:12]}"
    html = open(index, encoding="utf-8").read()
    html, n1 = re.subn(r'(<meta property="og:image" content=")[^"]*(")', rf"\g<1>{image_url}\g<2>", html)
    html, n2 = re.subn(r'(<meta name="twitter:image" content=")[^"]*(")', rf"\g<1>{image_url}\g<2>", html)
    extra = (
        f'<meta property="og:image:width" content="{WIDTH}" />\n'
        f'    <meta property="og:image:height" content="{HEIGHT}" />\n    '
    )
    if "og:image:width" not in html:
        html = html.replace('<meta property="og:image:alt"', extra + '<meta property="og:image:alt"', 1)
    open(index, "w", encoding="utf-8").write(html)
    print(f"Preview image saved ({os.path.getsize(out)} bytes); og:image -> {image_url} ({n1 + n2} tags)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
