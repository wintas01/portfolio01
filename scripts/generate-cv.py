"""Generate the downloadable CV at artifacts/portfolio/public/.

Run from the repo root:  python3 scripts/generate-cv.py  (needs reportlab and Pillow)
"""

from pathlib import Path

from PIL import Image, ImageOps
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "artifacts/portfolio/public/Nnanna-Okechukwu-Jason-CV.pdf"
PHOTO = ROOT / "artifacts/portfolio/src/assets/wintas-about.png"
ICONS = ROOT / "scripts/cv-assets"
LOGOS = ROOT / "artifacts/portfolio/public"

INK = HexColor("#111111")
TEXT = HexColor("#2B2B2B")
MUTED = HexColor("#6B6B6B")
ACCENT = HexColor("#CDE600")
PANEL = HexColor("#E4E4E4")
PAGE = HexColor("#F4F4F2")

W, H = A4
LEFT_X, LEFT_W = 50, 125
RIGHT_X, RIGHT_W = 205, W - 205 - 42

body = ParagraphStyle("body", fontName="Helvetica", fontSize=8.6, leading=12, textColor=TEXT)
summary = ParagraphStyle("summary", parent=body, fontSize=9, leading=13, textColor=INK)
meta = ParagraphStyle("meta", parent=body, fontSize=7.8, leading=11, textColor=MUTED)
SEP = "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;"


def spaced(c, x, y, text, font, size, space, color=INK):
    t = c.beginText(x, y)
    t.setFont(font, size)
    t.setCharSpace(space)
    t.setFillColor(color)
    t.textOut(text)
    t.setCharSpace(0)
    c.drawText(t)


def para(c, text, style, x, y, width):
    """Draw a paragraph with its top at y; return the y below it."""
    p = Paragraph(text, style)
    _, h = p.wrap(width, H)
    p.drawOn(c, x, y - h)
    return y - h


def link(url, text=None):
    return f'<a href="https://{url}" color="#111111"><u>{text or url}</u></a>'


def dot(c, x, y, r):
    c.setFillColor(INK)
    c.circle(x, y, r, stroke=0, fill=1)


def icon_item(c, x, y, icon, text, url=None, size=8):
    """Draw an icon followed by text on baseline y; return the x after it."""
    c.drawImage(ImageReader(str(ICONS / f"{icon}.png")), x, y - 1.6, 9, 9, mask="auto")
    x += 13
    c.setFont("Helvetica", size)
    c.setFillColor(INK)
    c.drawString(x, y, text)
    w = c.stringWidth(text, "Helvetica", size)
    if url:
        c.linkURL(url, (x, y - 2, x + w, y + size), relative=0)
    return x + w + 16


def heading(c, x, y, text):
    spaced(c, x, y, text, "Helvetica-Bold", 12, 2.2)
    return y - 20


def photo_reader(w, h):
    img = Image.open(PHOTO).convert("L")
    # Head-and-shoulders crop, matched to the panel's aspect ratio.
    iw, ih = img.size
    cw = int(iw * 0.78)
    ch = int(cw * h / w)
    left = (iw - cw) // 2
    top = int(ih * 0.04)
    img = img.crop((left, top, left + cw, top + ch))
    img = ImageOps.autocontrast(img, cutoff=1)
    return ImageReader(img.resize((int(w * 4), int(h * 4)), Image.LANCZOS))


def header(c):
    top = H - 55
    # Vertical rule; the rotated "RESUME" label sits over the accent bar.
    c.setStrokeColor(INK)
    c.setLineWidth(1.1)
    c.line(LEFT_X, top - 4, LEFT_X, top - 190)

    # Accent bar runs behind the photo panel.
    bar_y, bar_h = top - 130, 30
    c.setFillColor(ACCENT)
    c.rect(28, bar_y, 497, bar_h, stroke=0, fill=1)

    px, pw, ph = 98, 92, 150
    c.setFillColor(PANEL)
    c.rect(px, top - ph + 22, pw, ph, stroke=0, fill=1)
    c.drawImage(photo_reader(pw, ph - 12), px, top - ph + 22, pw, ph - 12)

    c.saveState()
    c.translate(LEFT_X + 22, top - 150)
    c.rotate(90)
    spaced(c, 0, 0, "RESUME", "Helvetica-Bold", 17, 0.4)
    c.restoreState()

    # Name: regular first names, bold surname.
    first = "Nnanna Okechukwu "
    c.setFillColor(INK)
    c.setFont("Helvetica", 25)
    c.drawString(RIGHT_X, top - 92, first)
    c.setFont("Helvetica-Bold", 25)
    c.drawString(RIGHT_X + c.stringWidth(first, "Helvetica", 25), top - 92, "Jason")

    spaced(c, RIGHT_X, bar_y + 11, "SOFTWARE BUILDER  /  FULL-STACK DEVELOPER", "Helvetica", 8.4, 2.6)

    y = bar_y - 20
    x = icon_item(c, RIGHT_X, y, "mail", "nnannaokechukwu1@gmail.com", "mailto:nnannaokechukwu1@gmail.com")
    x = icon_item(c, x, y, "whatsapp", "0708 306 6127", "https://wa.me/2347083066127")
    icon_item(c, x, y, "pin", "Imo State, Nigeria")
    y -= 15
    x = icon_item(c, RIGHT_X, y, "globe", "wintas01.github.io/portfolio01", "https://wintas01.github.io/portfolio01/")
    icon_item(c, x, y, "github", "github.com/wintas01", "https://github.com/wintas01")
    return bar_y - 62


def objective(c, y):
    text = (
        "Computer Science graduate (2026) and fast-moving software builder focused on web applications, AI integrations, and rapid "
        "prototyping. Skilled at writing effective AI prompts and applying machine learning tools "
        "to turn product ideas into working, deployed apps. Experienced working in a team on a "
        "live university website, and eager to contribute to early-stage builds, open-source "
        "projects, and collaborative teams."
    )
    bottom = para(c, text, summary, LEFT_X + 18, y, W - LEFT_X - 18 - 42)
    c.setFillColor(ACCENT)
    c.rect(LEFT_X, bottom - 2, 6, y - bottom + 4, stroke=0, fill=1)
    return bottom - 34


def left_column(c, y):
    y = heading(c, LEFT_X, y, "SKILLS")
    groups = [
        ("PROFESSIONAL", [
            "Full-stack web development",
            "AI API integration",
            "Prompt engineering",
            "Rapid prototyping",
            "Team collaboration",
        ]),
        ("TECHNICAL", [
            "TypeScript, HTML, CSS",
            "Supabase",
            "Vercel",
            "Cloudflare AI API",
            "Git / GitHub",
            "Networking fundamentals",
        ]),
    ]
    item = ParagraphStyle("item", parent=body, fontSize=8.2, leading=11.5)
    for title, items in groups:
        spaced(c, LEFT_X, y, title, "Helvetica-Bold", 7.4, 2)
        y -= 15
        for text in items:
            dot(c, LEFT_X + 2, y - 4.3, 1.4)
            y = para(c, text, item, LEFT_X + 14, y, LEFT_W - 14) - 4
        y -= 10

    y = heading(c, LEFT_X, y - 6, "EDUCATION")
    c.setStrokeColor(INK)
    c.setLineWidth(1)
    c.line(LEFT_X + 2, y + 2, LEFT_X + 2, y - 44)
    dot(c, LEFT_X + 2, y - 3, 2.8)
    spaced(c, LEFT_X + 14, y - 6, "GRADUATED 2026", "Helvetica", 7.4, 1.4, TEXT)
    spaced(c, LEFT_X + 14, y - 19, "B.SC. COMPUTER SCIENCE", "Helvetica-Bold", 7.4, 1.2)
    edu = ParagraphStyle("edu", parent=body, fontSize=8, leading=10.5, textColor=MUTED)
    para(c, "Kingsley Ozumba Mbadiwe University, Ideato", edu, LEFT_X + 14, y - 24, LEFT_W - 14)


PROJECTS = [
    (
        "project-previews/komu-icon.png",
        "TEAM PROJECT  —  FULL-STACK DEVELOPER",
        "KOMU WEBSITE REDESIGN",
        "Redesign of the official website of Kingsley Ozumba Mbadiwe University.",
        [
            "Worked as a full-stack developer in the team that redesigned the university's website.",
            "Contributed to both the frontend and the backend of the new site, which is now live.",
        ],
        f"Live: {link('komu.edu.ng')}",
    ),
    (
        "project-previews/vtu-icon.jpg",
        "INSTANT TOP-UP WEB APP",
        "OJ SUB VTU PLATFORM",
        "Nigerian VTU platform for everyday payments and top-ups.",
        [
            "Built a platform for buying cheap mobile data and airtime and paying electricity "
            "bills, TV subscriptions, and educational fees.",
            "Added a marketplace where users can sell items, with an installable app version.",
        ],
        f"Live: {link('sabuss.com/ojsub3')}",
    ),
    (
        "project-previews/church-bot-icon.png",
        "CLOUDFLARE AI API  ·  SUPABASE  ·  VERCEL",
        "CHURCH FACEBOOK AUTO BOT",
        "Automated content platform that keeps a church's Facebook Page active.",
        [
            "Generates posts and images with AI and publishes them automatically to a Facebook Page.",
            "Uses the Cloudflare AI API for text and image generation and Supabase for the database.",
            "Hosted on Vercel, removing the need for manual daily posting.",
        ],
        f"Demo: {link('church-auto-bot-demo.vercel.app')}  ·  Source: private, walkthrough on request",
    ),
    (
        "favicon.png",
        "TYPESCRIPT",
        "PORTFOLIO WEBSITE",
        "Personal site showcasing web applications, AI integrations, and networking projects.",
        ["Designed and published the portfolio, with live project previews and GitHub activity."],
        f"Live: {link('wintas01.github.io/portfolio01')}  ·  Source: {link('github.com/wintas01/portfolio01')}",
    ),
]


def right_column(c, y):
    y = heading(c, RIGHT_X, y, "PROJECTS")
    for logo, kicker, title, desc, bullets, links in PROJECTS:
        c.drawImage(ImageReader(str(LOGOS / logo)), RIGHT_X, y - 17, 22, 22, preserveAspectRatio=True, mask="auto")
        spaced(c, RIGHT_X + 30, y, kicker, "Helvetica", 7.2, 1.3, TEXT)
        spaced(c, RIGHT_X + 30, y - 13, title, "Helvetica-Bold", 7.8, 1.6)
        y = para(c, desc, body, RIGHT_X, y - 19, RIGHT_W) - 2
        for b in bullets:
            dot(c, RIGHT_X + 6, y - 4.2, 1.3)
            y = para(c, b, body, RIGHT_X + 14, y, RIGHT_W - 14) - 1
        y = para(c, links, meta, RIGHT_X, y - 2, RIGHT_W) - 20
    para(
        c,
        f"More projects on GitHub: {link('github.com/wintas01')}  ·  References available on request.",
        meta,
        RIGHT_X,
        y + 6,
        RIGHT_W,
    )


c = canvas.Canvas(str(OUT), pagesize=A4)
c.setTitle("Nnanna Okechukwu Jason - CV")
c.setAuthor("Nnanna Okechukwu Jason")
c.setFillColor(PAGE)
c.rect(0, 0, W, H, stroke=0, fill=1)
y = objective(c, header(c))
left_column(c, y)
right_column(c, y)
c.showPage()
c.save()
print(f"Wrote {OUT}")
