#!/usr/bin/env python3
"""
Generate placeholder SVG images for The Ark website.
Run this script once to create placeholder assets.
Replace them with real photos later.
"""
import os

placeholders = [
    ("hero-bg.jpg",      "#1a2e4a", "Hero Background\nReplace with your best photo", "🏠"),
    ("about-team.jpg",   "#2abaad", "About — Team Photo\nReplace with your team", "👥"),
    ("gallery-01.jpg",   "#2d6a4f", "Kitchen — After Deep Clean", "🍽️"),
    ("gallery-02.jpg",   "#1a2e4a", "Living Room — Clean & Bright", "🛋️"),
    ("gallery-03.jpg",   "#4a235a", "Office — Reception Area", "🏢"),
    ("gallery-04.jpg",   "#2abaad", "Bathroom — Sparkling Tiles", "🚿"),
    ("gallery-05.jpg",   "#7b4f12", "Carpet — Steam Cleaned", "🧹"),
    ("gallery-06.jpg",   "#1a3a5a", "Windows — Crystal Clear", "🪟"),
]

out = os.path.join(os.path.dirname(__file__), "assets", "images")
os.makedirs(out, exist_ok=True)

for fname, color, label, icon in placeholders:
    lines = label.split("\n")
    text_els = "\n".join(
        f'<text x="300" y="{300 + i*36}" font-size="22" fill="rgba(255,255,255,0.85)" text-anchor="middle">{l}</text>'
        for i, l in enumerate(lines)
    )
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <rect width="600" height="450" fill="{color}"/>
  <rect width="600" height="450" fill="rgba(0,0,0,0.15)"/>
  <text x="300" y="210" font-size="72" text-anchor="middle">{icon}</text>
  {text_els}
  <text x="300" y="430" font-size="13" fill="rgba(255,255,255,0.4)" text-anchor="middle">Replace with real photo — {fname}</text>
</svg>"""
    # Save as SVG (rename to .jpg for simplicity — browsers handle SVG fine)
    path = os.path.join(out, fname.replace(".jpg", ".svg"))
    with open(path, "w") as f:
        f.write(svg)
    print(f"Created: {path}")

print("\n✓ Placeholder images created in assets/images/")
print("  Update content.json src paths to use .svg extension if keeping placeholders.")
print("  Replace files with real .jpg photos and keep the same filenames.")
