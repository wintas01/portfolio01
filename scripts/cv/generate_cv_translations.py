"""Generate the CV PDFs in every site language.

English goes to artifacts/portfolio/public/Nnanna-Okechukwu-Jason-CV.pdf, the
others to artifacts/portfolio/public/cv/. Projects are read from
artifacts/portfolio/src/data/projects.json (the website's own list), so adding a
project to the site adds it to every CV. GitHub Actions runs this on every push
(.github/workflows/main.yml), so the CVs on the live site are always current.

The design is laid out as an HTML page and printed by Chrome, because Chrome
shapes Arabic, Devanagari and CJK text correctly. If there are too many
projects for one page, the CV continues on a second page.

Run from the repo root:
    pip install playwright pillow && playwright install chromium
    python3 scripts/cv/generate_cv_translations.py            # all 10 languages
    python3 scripts/cv/generate_cv_translations.py fr de      # just some
    python3 scripts/cv/generate_cv_translations.py --html     # also keep the HTML

Fonts used if installed: TeX Gyre Heros or Liberation Sans (Latin), Noto Sans
CJK (Chinese, Japanese, Korean), Noto Sans Arabic or DejaVu Sans (Arabic),
Noto Sans Devanagari or FreeSans (Hindi).
"""

import asyncio
import os
import base64
import html
import io
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps
from playwright.async_api import async_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from cv_translations import CV  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "artifacts/portfolio/public/cv"
ENGLISH_OUT = ROOT / "artifacts/portfolio/public/Nnanna-Okechukwu-Jason-CV.pdf"
PROJECTS_FILE = ROOT / "artifacts/portfolio/src/data/projects.json"
PHOTO = ROOT / "artifacts/portfolio/src/assets/wintas-about.png"
ICONS = ROOT / "scripts/cv-assets"
LOGOS = ROOT / "artifacts/portfolio/public"

RTL = {"ar"}
FONTS = {
    "latin": "'TeX Gyre Heros', 'Liberation Sans', Helvetica, Arial, sans-serif",
    "ar": "'TeX Gyre Heros', 'Noto Sans Arabic', 'DejaVu Sans', sans-serif",
    "hi": "'TeX Gyre Heros', 'Noto Sans Devanagari', 'FreeSans', sans-serif",
    "zh": "'TeX Gyre Heros', 'Noto Sans CJK SC', 'Noto Sans SC', sans-serif",
    "ja": "'TeX Gyre Heros', 'Noto Sans CJK JP', 'Noto Sans JP', sans-serif",
    "ko": "'TeX Gyre Heros', 'Noto Sans CJK KR', 'Noto Sans KR', sans-serif",
}

def short_url(url: str) -> str:
    return url.split("://", 1)[-1].rstrip("/")


def cv_projects(lang: str) -> list[dict]:
    """Projects for the CV in one language, from the website's projects.json.

    Missing translations fall back to English; missing CV-specific text falls
    back to the project's website description.
    """
    data = json.loads(PROJECTS_FILE.read_text(encoding="utf-8"))["projects"]
    chosen = [p for p in data if p.get("onCV", True)]
    chosen.sort(key=lambda p: (p.get("cvRank", 1000), data.index(p)))
    out = []
    for p in chosen:
        text = p.get("text", {})
        mine, en = text.get(lang) or {}, text.get("en") or {}
        bullets = (
            mine.get("cvBullets")
            or ([mine["description"]] if mine.get("description") else None)
            or en.get("cvBullets")
            or ([en["description"]] if en.get("description") else [])
        )
        links = p.get("cvLinks")
        if links is None:
            links = []
            if p.get("href"):
                links.append({"label": "live", "url": short_url(p["href"])})
            if p.get("codeHref"):
                links.append({"label": "source", "url": short_url(p["codeHref"])})
        out.append({
            "logo": p.get("icon"),
            "kicker": mine.get("cvKicker") or en.get("cvKicker") or "",
            "title": mine.get("cvTitle") or en.get("cvTitle") or p["title"],
            "bullets": bullets,
            "links": links,
        })
    return out



def data_uri(path: Path, size: int = 96) -> str:
    """Embed an image, scaled down so the PDFs stay small."""
    img = Image.open(path)
    img.thumbnail((size, size), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def photo_uri(w: int = 92, h: int = 138) -> str:
    """Same head-and-shoulders crop as scripts/generate-cv.py."""
    img = Image.open(PHOTO).convert("L")
    iw, ih = img.size
    cw = int(iw * 0.78)
    ch = int(cw * h / w)
    left = (iw - cw) // 2
    top = int(ih * 0.04)
    img = img.crop((left, top, left + cw, top + ch))
    img = ImageOps.autocontrast(img, cutoff=1).resize((w * 4, h * 4), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def e(text: str) -> str:
    return html.escape(text, quote=True)


def link(url: str) -> str:
    return f'<a href="https://{e(url)}" dir="ltr">{e(url)}</a>'


def build_html(lang: str, t: dict, photo: str) -> str:
    rtl = lang in RTL
    font = FONTS.get(lang, FONTS["latin"])
    cjk = lang in {"zh", "ja", "ko"}
    icon = {name: data_uri(ICONS / f"{name}.png") for name in ["mail", "whatsapp", "pin", "globe", "github"]}
    phone_digits = "2347083066127"

    def bullets(items, cls="bullet"):
        return "".join(f'<li class="{cls}">{e(i)}</li>' for i in items)

    projects_html = []
    for proj in cv_projects(lang):
        logo, kicker, title, items, links = proj["logo"], proj["kicker"], proj["title"], proj["bullets"], proj["links"]
        if links == "launching":
            meta = e(t["launching"])
        else:
            parts = []
            for item in links:
                label, url = item["label"], item.get("url")
                if url:
                    parts.append(f"{e(t[label])}: {link(url)}")
                else:
                    parts.append(f"{e(t[label])}: {e(t['private'])}")
            meta = '<span class="sep">  ·  </span>'.join(parts)
        logo_html = f'<img class="logo" src="{data_uri(LOGOS / logo)}" alt="">' if logo and (LOGOS / logo).exists() else '<span class="logo"></span>'
        projects_html.append(f"""
        <div class="project">
          <div class="project-head">
            {logo_html}
            <div>
              {f'<div class="kicker spaced">{e(kicker)}</div>' if kicker else ''}
              <div class="ptitle spaced">{e(title)}</div>
            </div>
          </div>
          <ul class="bullets">{bullets(items)}</ul>
          <div class="meta">{meta}</div>
        </div>""")

    technical = ["TypeScript, HTML, CSS", "Supabase", "Vercel", "Cloudflare AI API", "Git / GitHub", t["networking"]]

    return f"""<!doctype html>
<html lang="{lang}" dir="{'rtl' if rtl else 'ltr'}">
<head>
<meta charset="utf-8">
<title>Nnanna Okechukwu Jason - CV</title>
<style>
  /* Pages are full-bleed (so the background covers everything). Spacing at the
     top and bottom of each page comes from the table header/footer rows below,
     which Chrome repeats on every printed page. */
  @page {{ size: A4; margin: 0; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html {{ background: #F4F4F2; }}
  body {{ width: 595.28pt; min-height: 841.89pt; }}
  body {{
    position: relative; background: #F4F4F2; color: #2B2B2B;
    font-family: {font}; -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }}
  a {{ color: #111111; text-decoration: underline; }}
  .abs {{ position: absolute; }}
  .vline {{ inset-inline-start: 50pt; top: 59pt; width: 1.1pt; height: 186pt; background: #111; }}
  .bar {{ inset-inline-start: 28pt; top: 155pt; width: 497pt; height: 30pt; background: #CDE600; }}
  .panel {{ inset-inline-start: 98pt; top: 33pt; width: 92pt; height: 150pt; background: #E4E4E4; }}
  .panel img {{ position: absolute; left: 0; top: 12pt; width: 92pt; height: 138pt; }}
  /* The label's box spans from the top of the rule to y=205pt; the text sits at its bottom. */
  .resume-box {{ position: absolute; left: 55pt; top: 59pt; height: 146pt; display: flex; align-items: flex-end; }}
  [dir="rtl"] .resume-box {{ left: auto; right: 55pt; }}
  .resume {{
    font-weight: 700; font-size: 17pt; line-height: 17pt; color: #111; letter-spacing: 0.4pt;
    writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap;
  }}
  .cjk .resume {{ writing-mode: vertical-rl; text-orientation: upright; transform: none; letter-spacing: 3pt; }}
  .name {{ inset-inline-start: 205pt; top: 124pt; font-size: 25pt; line-height: 1; color: #111; white-space: nowrap; }}
  .name b {{ font-weight: 700; }}
  .role {{
    inset-inline-start: 205pt; top: 155pt; height: 30pt; display: flex; align-items: center;
    font-size: 8.4pt; letter-spacing: 2.6pt; text-transform: uppercase; color: #111; white-space: pre;
  }}
  .contacts {{
    inset-inline-start: 205pt; top: 197pt; width: 350pt; display: flex; flex-wrap: wrap;
    column-gap: 16pt; row-gap: 5pt; font-size: 8pt; color: #111;
  }}
  .contacts span, .contacts a {{ display: inline-flex; align-items: center; gap: 4pt; text-decoration: none; color: #111; white-space: nowrap; }}
  .contacts img {{ width: 9pt; height: 9pt; }}
  .content {{ position: relative; margin-inline-start: 50pt; padding-top: 211pt; width: 503pt; }}
  .flow {{ width: 100%; border-collapse: collapse; }}
  .flow td {{ padding: 0; vertical-align: top; }}
  .page-top {{ height: 36pt; }}
  .page-bottom {{ height: 26pt; }}
  .objective {{ position: relative; padding-inline-start: 18pt; font-size: 9pt; line-height: 13pt; color: #111; }}
  .objective::before {{ content: ""; position: absolute; inset-inline-start: 0; top: -2pt; bottom: -2pt; width: 6pt; background: #CDE600; }}
  .cols {{ display: flex; gap: 22pt; margin-top: 24pt; }}
  .left {{ width: 133pt; flex: none; }}
  .right {{ width: 348pt; flex: none; }}
  h2 {{ font-size: 12pt; font-weight: 700; letter-spacing: 2.2pt; text-transform: uppercase; color: #111; margin-bottom: 9pt; line-height: 1.15; }}
  h3 {{ font-size: 7.4pt; font-weight: 700; letter-spacing: 2pt; text-transform: uppercase; color: #111; margin-bottom: 8pt; }}
  ul {{ list-style: none; }}
  .skills li {{ position: relative; padding-inline-start: 14pt; font-size: 8.2pt; line-height: 11.5pt; margin-bottom: 4pt; }}
  .skills li::before {{ content: ""; position: absolute; inset-inline-start: 0.6pt; top: 4.3pt; width: 2.8pt; height: 2.8pt; border-radius: 50%; background: #111; }}
  .skills ul {{ margin-bottom: 10pt; }}
  .edu {{ margin-top: 10pt; }}
  .timeline {{ position: relative; padding-inline-start: 14pt; }}
  .timeline::before {{ content: ""; position: absolute; inset-inline-start: 1.5pt; top: -4pt; height: 54pt; width: 1pt; background: #111; }}
  .timeline::after {{ content: ""; position: absolute; inset-inline-start: -0.8pt; top: 0.2pt; width: 5.6pt; height: 5.6pt; border-radius: 50%; background: #111; }}
  .grad {{ font-size: 7.4pt; letter-spacing: 1.4pt; text-transform: uppercase; color: #2B2B2B; }}
  .degree {{ font-size: 7.4pt; font-weight: 700; letter-spacing: 1.2pt; text-transform: uppercase; color: #111; margin-top: 4pt; }}
  .uni {{ display: flex; gap: 6pt; margin-top: 5pt; align-items: flex-start; }}
  .uni img {{ width: 24pt; height: 24pt; object-fit: contain; flex: none; }}
  .uni span {{ font-size: 8pt; line-height: 10.5pt; color: #6B6B6B; }}
  .project {{ margin-bottom: 8pt; break-inside: avoid; }}
  .footer {{ break-inside: avoid; }}
  .project-head {{ display: flex; gap: 8pt; align-items: center; margin-bottom: 3pt; }}
  .logo {{ width: 22pt; height: 22pt; object-fit: contain; flex: none; }}
  .kicker {{ font-size: 7.2pt; line-height: 9pt; letter-spacing: 1.3pt; text-transform: uppercase; color: #2B2B2B; white-space: pre; }}
  .ptitle {{ font-size: 7.8pt; line-height: 10pt; font-weight: 700; letter-spacing: 1.6pt; text-transform: uppercase; color: #111; margin-top: 3pt; }}
  .bullets li {{ position: relative; padding-inline-start: 14pt; font-size: 8.6pt; line-height: 12pt; margin-bottom: 1pt; }}
  .bullets li::before {{ content: ""; position: absolute; inset-inline-start: 4.7pt; top: 4.7pt; width: 2.6pt; height: 2.6pt; border-radius: 50%; background: #111; }}
  .meta {{ font-size: 7.8pt; line-height: 10.5pt; color: #6B6B6B; margin-top: 1pt; }}
  .sep {{ white-space: pre; }}
  .footer {{ font-size: 7.8pt; line-height: 11pt; color: #6B6B6B; margin-top: 2pt; }}

  /* Letter-spacing breaks Arabic joining and Devanagari clusters. */
  :lang(ar) .spaced, :lang(ar) h2, :lang(ar) h3, :lang(ar) .role, :lang(ar) .grad, :lang(ar) .degree, :lang(ar) .resume,
  :lang(hi) .spaced, :lang(hi) h2, :lang(hi) h3, :lang(hi) .role, :lang(hi) .grad, :lang(hi) .degree, :lang(hi) .resume {{ letter-spacing: 0; }}
  :lang(ar) .kicker, :lang(hi) .kicker {{ font-size: 7.8pt; }}
  :lang(ar) h3, :lang(hi) h3, :lang(ar) .grad, :lang(ar) .degree, :lang(hi) .grad, :lang(hi) .degree {{ font-size: 8pt; }}
  :lang(ar) .ptitle, :lang(hi) .ptitle {{ font-size: 8.6pt; }}
  .cjk .spaced, .cjk h2, .cjk h3, .cjk .role, .cjk .grad, .cjk .degree {{ letter-spacing: 0.6pt; }}
  .cjk h2 {{ letter-spacing: 2pt; }}
</style>
</head>
<body class="{'cjk' if cjk else ''}">
  <div class="abs vline"></div>
  <div class="abs bar"></div>
  <div class="abs panel"><img src="{photo}" alt=""></div>
  <div class="resume-box"><div class="resume">{e(t['resume'])}</div></div>
  <div class="abs name"><span dir="ltr">Nnanna Okechukwu <b>Jason</b></span></div>
  <div class="abs role">{e(t['role'])}</div>
  <div class="abs contacts">
    <a href="mailto:nnannaokechukwu1@gmail.com"><img src="{icon['mail']}" alt=""><span dir="ltr">nnannaokechukwu1@gmail.com</span></a>
    <a href="https://wa.me/{phone_digits}"><img src="{icon['whatsapp']}" alt=""><span dir="ltr">{e(t['phone'])}</span></a>
    <span><img src="{icon['pin']}" alt="">{e(t['location'])}</span>
    <a href="https://wintas01.github.io/portfolio01/"><img src="{icon['globe']}" alt=""><span dir="ltr">wintas01.github.io/portfolio01</span></a>
    <a href="https://github.com/wintas01"><img src="{icon['github']}" alt=""><span dir="ltr">github.com/wintas01</span></a>
  </div>
  <div class="content">
   <table class="flow">
    <thead><tr><td><div class="page-top"></div></td></tr></thead>
    <tfoot><tr><td><div class="page-bottom"></div></td></tr></tfoot>
    <tbody><tr><td>
    <p class="objective">{e(t['objective'])}</p>
    <div class="cols">
      <div class="left">
        <section class="skills">
          <h2>{e(t['skills'])}</h2>
          <h3>{e(t['professional'])}</h3>
          <ul>{bullets(t['professional_items'], 'skill')}</ul>
          <h3>{e(t['technical'])}</h3>
          <ul>{bullets(technical, 'skill')}</ul>
        </section>
        <section class="edu">
          <h2>{e(t['education'])}</h2>
          <div class="timeline">
            <div class="grad">{e(t['graduated'])}</div>
            <div class="degree">{e(t['degree'])}</div>
            <div class="uni"><img src="{data_uri(LOGOS / 'project-previews/komu-icon.png')}" alt=""><span dir="ltr">Kingsley Ozumba Mbadiwe University, Ideato</span></div>
          </div>
        </section>
      </div>
      <div class="right">
        <h2>{e(t['projects'])}</h2>
        {''.join(projects_html)}
        <div class="footer">{e(t['more'])} {link('github.com/wintas01')}<span class="sep">  ·  </span>{e(t['refs'])}</div>
      </div>
    </div>
    </td></tr></tbody>
   </table>
  </div>
</body>
</html>"""


async def main(langs: list[str], keep_html: bool) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    photo = photo_uri()
    async with async_playwright() as p:
        # CHROME_PATH lets you use an installed Chrome instead of Playwright's.
        browser = await p.chromium.launch(executable_path=os.environ.get("CHROME_PATH") or None)
        page = await browser.new_page()
        for lang in langs:
            doc = build_html(lang, CV[lang], photo)
            if keep_html:
                (OUT_DIR / f"cv-{lang}.html").write_text(doc, encoding="utf-8")
            await page.set_content(doc, wait_until="load")
            await page.evaluate("document.fonts.ready")
            # Long translated job titles: tighten the letter spacing until the
            # title fits on the lime bar (bar ends 320pt after the title starts).
            await page.evaluate(
                """() => {
                  const role = document.querySelector('.role');
                  const max = (320 - 8) * 96 / 72;
                  let ls = parseFloat(getComputedStyle(role).letterSpacing) || 0;
                  while (role.getBoundingClientRect().width > max && ls > 0.4) {
                    ls -= 0.2;
                    role.style.letterSpacing = ls + 'px';
                  }
                }"""
            )
            out = ENGLISH_OUT if lang == "en" else OUT_DIR / f"Nnanna-Okechukwu-Jason-CV-{lang.upper()}.pdf"
            await page.pdf(path=str(out), format="A4", print_background=True, prefer_css_page_size=True,
                           margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
            pages = len(re.findall(rb"/Type\s*/Page[^s]", out.read_bytes()))
            print(f"Wrote {out.relative_to(ROOT)} ({pages} page{'s' if pages != 1 else ''})")
        await browser.close()


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    chosen = args or list(CV)
    asyncio.run(main(chosen, "--html" in sys.argv))
