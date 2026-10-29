"""Generate the downloadable CV at artifacts/portfolio/public/.

Run from the repo root:  python3 scripts/generate-cv.py  (needs reportlab)
"""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT = Path(__file__).resolve().parent.parent / (
    "artifacts/portfolio/public/Nnanna-Okechukwu-Jason-CV.pdf"
)

NAVY = HexColor("#1F4E79")
TEXT = HexColor("#1A1A1A")
MUTED = HexColor("#555555")
RULE = HexColor("#C9D3DD")

name = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=24, leading=28, textColor=NAVY)
tagline = ParagraphStyle("tagline", fontName="Helvetica", fontSize=11, leading=15, textColor=MUTED)
contact = ParagraphStyle("contact", fontName="Helvetica", fontSize=9.5, leading=14, textColor=TEXT)
heading = ParagraphStyle("heading", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=NAVY)
body = ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=14.5, textColor=TEXT)
label = ParagraphStyle("label", parent=body, fontName="Helvetica-Bold")
project = ParagraphStyle("project", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=TEXT)
meta = ParagraphStyle("meta", fontName="Helvetica", fontSize=9, leading=12, textColor=MUTED)
bullet = ParagraphStyle("bullet", parent=body, leading=12.5)
link_line = ParagraphStyle("link", fontName="Helvetica", fontSize=8.5, leading=12, textColor=MUTED)


def link(url, text=None):
    return f'<a href="https://{url}" color="#1F4E79"><u>{text or url}</u></a>'


def section(title):
    return [
        Spacer(1, 9),
        Paragraph(title, heading),
        HRFlowable(width="100%", thickness=0.6, color=RULE, spaceBefore=1, spaceAfter=6),
    ]


def project_block(title, subtitle, bullets, source):
    items = [ListItem(Paragraph(b, bullet), leftIndent=14, value="•") for b in bullets]
    return [
        Paragraph(title, project),
        Paragraph(subtitle, meta),
        Spacer(1, 2),
        ListFlowable(items, bulletType="bullet", start="•", leftIndent=14, bulletFontSize=10),
        Paragraph(source, link_line),
        Spacer(1, 5),
    ]


SEP = "&nbsp;&nbsp;|&nbsp;&nbsp;"

story = [
    Paragraph("Nnanna Okechukwu Jason", name),
    Paragraph(f"Software Builder{SEP}AI-Assisted Full-Stack Development", tagline),
    Spacer(1, 6),
    Paragraph(
        f'<a href="mailto:nnannaokechukwu1@gmail.com" color="#1F4E79"><u>nnannaokechukwu1@gmail.com</u></a>'
        f"{SEP}07083066127{SEP}Imo State, Nigeria",
        contact,
    ),
    Paragraph(
        f"Portfolio: {link('wintas01.github.io/portfolio01')}{SEP}GitHub: {link('github.com/wintas01')}",
        contact,
    ),
]

story += section("PROFESSIONAL SUMMARY")
story.append(
    Paragraph(
        "Fast-moving software builder focused on web applications, AI integrations, and rapid "
        "prototyping. Skilled at writing effective AI prompts and applying machine learning tools "
        "to turn product ideas into working, deployed apps. Experienced working in a team on a "
        "live university website, and eager to contribute to early-stage builds, open-source "
        "projects, and collaborative teams.",
        body,
    )
)

story += section("TECHNICAL TOOLKIT")
toolkit = [
    ("Languages", "TypeScript, HTML, CSS"),
    ("Platforms &amp; Backend", "Supabase (database), Vercel (deployment), Cloudflare AI API"),
    ("AI Workflow", "Prompt engineering, machine learning, AI API integration, AI-assisted development"),
    ("Tools", "Git/GitHub, networking fundamentals"),
]
table = Table(
    [[Paragraph(k, label), Paragraph(v, body)] for k, v in toolkit],
    colWidths=[42 * mm, None],
)
table.setStyle(
    TableStyle(
        [
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 1),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ]
    )
)
story.append(table)

story += section("FEATURED PROJECTS")
story += project_block(
    "KOMU University Website Redesign",
    f"Team project{SEP}Full-stack developer",
    [
        "Worked as a full-stack developer in the team that redesigned the official website of "
        "Kingsley Ozumba Mbadiwe University.",
        "Contributed to both the frontend and the backend of the new site, which is now live.",
    ],
    f"Live: {link('komu.edu.ng')}",
)
story += project_block(
    "OJ Sub VTU Platform",
    f"Instant top-up web app{SEP}Payments &amp; bills",
    [
        "Built a VTU platform for buying cheap mobile data and airtime and paying electricity "
        "bills, TV subscriptions, and educational fees.",
        "Added a marketplace where users can sell items, with an installable app version.",
    ],
    f"Live: {link('sabuss.com/ojsub3')}",
)
story += project_block(
    "Church Facebook Auto Bot",
    f"Automated content platform{SEP}Cloudflare AI API, Supabase, Vercel",
    [
        "Built and deployed a web app that generates posts and images with AI and publishes them "
        "automatically to a Facebook Page.",
        "Used the Cloudflare AI API for text and image generation and Supabase for the database.",
        "Hosted on Vercel, removing the need for manual daily posting.",
    ],
    f"Demo: {link('church-auto-bot-demo.vercel.app')}{SEP}Source: private repository, walkthrough available on request",
)
story += project_block(
    "Date Planner",
    f"Web app{SEP}TypeScript",
    ["Built an app that helps couples plan and arrange dates."],
    f"Source Code: {link('github.com/wintas01/Date-Planner')}",
)
story += project_block(
    "Multiplayer Tic-Tac-Toe",
    f"Browser game{SEP}HTML",
    ["Built a multiplayer tic-tac-toe game playable in the browser."],
    f"Source Code: {link('github.com/wintas01/tic-ta-toe')}",
)
story += project_block(
    "Portfolio Website",
    f"Personal showcase site{SEP}TypeScript",
    ["Designed and published a portfolio showcasing web applications, AI integrations, and networking projects."],
    f"Live: {link('wintas01.github.io/portfolio01')}{SEP}Source: {link('github.com/wintas01/portfolio01')}",
)
story.append(
    Paragraph(
        f"More projects on GitHub: {link('github.com/wintas01')}{SEP}References available on request.",
        link_line,
    )
)

doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=20 * mm,
    rightMargin=20 * mm,
    topMargin=13 * mm,
    bottomMargin=10 * mm,
    title="Nnanna Okechukwu Jason - CV",
    author="Nnanna Okechukwu Jason",
)
doc.build(story)
print(f"Wrote {OUT}")
