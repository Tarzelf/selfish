#!/usr/bin/env python3
"""Render Selfish Whop branding from the evening photograph + app type."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PHOTO = ROOT / "assets/atmosphere/evening.jpg"
OUT = ROOT / "assets/brand"

INK = (245, 245, 247, 255)
INK_DIM = (245, 245, 247, 168)
INK_FAINT = (245, 245, 247, 102)
AMBER = (255, 180, 87, 255)
FLOOR = (6, 6, 8, 255)

SERIF_I = Path("/tmp/fonts/Newsreader-Italic.ttf")
SERIF = Path("/tmp/fonts/Newsreader.ttf")
SANS = Path("/usr/share/fonts/truetype/macos/Inter-Medium.ttf")


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def cover_crop(src: Image.Image, size: tuple[int, int], focus: tuple[float, float]) -> Image.Image:
    tw, th = size
    sw, sh = src.size
    scale = max(tw / sw, th / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    cx, cy = int(nw * focus[0] - tw / 2), int(nh * focus[1] - th / 2)
    cx = max(0, min(cx, nw - tw))
    cy = max(0, min(cy, nh - th))
    return resized.crop((cx, cy, cx + tw, cy + th))


def wash(photo: Image.Image, opacity: float) -> Image.Image:
    dim = ImageEnhance.Brightness(photo).enhance(0.55)
    dim = ImageEnhance.Color(dim).enhance(0.72)
    floor = Image.new("RGBA", photo.size, FLOOR)
    overlay = dim.convert("RGBA")
    overlay.putalpha(int(255 * opacity))
    return Image.alpha_composite(floor, overlay)


def vignette(size: tuple[int, int], strength: float = 0.72) -> Image.Image:
    w, h = size
    alpha = Image.new("L", (w, h), 0)
    px = alpha.load()
    cx, cy = w / 2, h / 2
    max_r = (cx**2 + cy**2) ** 0.5
    for y in range(h):
        for x in range(w):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5 / max_r
            px[x, y] = int(min(255, max(0, (d - 0.28) / 0.72) * 255 * strength))
    alpha = alpha.filter(ImageFilter.GaussianBlur(radius=24))
    veil = Image.new("RGBA", (w, h), FLOOR)
    veil.putalpha(alpha)
    return veil


def glow(draw_size: tuple[int, int], center: tuple[int, int], radius: int, color: tuple[int, int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", draw_size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = center
    d.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)
    return layer.filter(ImageFilter.GaussianBlur(radius=int(radius * 0.65)))


def hairline(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], color: tuple[int, int, int, int]) -> None:
    draw.line((xy[0], xy[1], xy[2], xy[3]), fill=color, width=2)


def render_logo() -> Image.Image:
    size = (1024, 1024)
    photo = cover_crop(Image.open(PHOTO).convert("RGB"), size, (0.42, 0.22))
    base = wash(photo, 0.38)
    base = Image.alpha_composite(base, vignette(size, 0.82))
    base = Image.alpha_composite(base, glow(size, (512, 470), 220, (255, 180, 87, 48)))

    canvas = base.copy()
    # Draw S on a temp layer so we can place it optically centered for a circular crop.
    text_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(text_layer)
    mark = font(SERIF_I, 560)
    s = "S"
    box = draw.textbbox((0, 0), s, font=mark)
    tw, th = box[2] - box[0], box[3] - box[1]
    x = (size[0] - tw) / 2 - box[0]
    y = (size[1] - th) / 2 - box[1] - 18
    draw.text((x, y), s, font=mark, fill=AMBER)
    canvas = Image.alpha_composite(canvas, text_layer)
    return canvas.convert("RGB")


def render_wide(size: tuple[int, int], title: str, kicker: str, line: str, focus: tuple[float, float]) -> Image.Image:
    photo = cover_crop(Image.open(PHOTO).convert("RGB"), size, focus)
    base = wash(photo, 0.46)
    # Left-to-right readability wash — checkout crops banners tightly.
    w, h = size
    grade = Image.new("RGBA", size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(grade)
    for x in range(w):
        t = 1 - min(1, x / (w * 0.62))
        a = int(210 * (t**1.15))
        gd.line([(x, 0), (x, h)], fill=(6, 6, 8, a))
    base = Image.alpha_composite(base, grade)
    base = Image.alpha_composite(base, vignette(size, 0.55))
    base = Image.alpha_composite(base, glow(size, (int(w * 0.78), int(h * 0.38)), int(h * 0.55), (255, 120, 71, 36)))

    draw = ImageDraw.Draw(base)
    kicker_font = font(SANS, max(18, int(h * 0.056)))
    title_font = font(SERIF_I, int(h * 0.28))
    line_font = font(SERIF, max(20, int(h * 0.078)))

    left = int(w * 0.055)
    top = int(h * 0.22)
    draw.text((left, top), kicker, font=kicker_font, fill=AMBER)
    kicker_box = draw.textbbox((left, top), kicker, font=kicker_font)
    rule_y = kicker_box[1] - int(h * 0.06)
    hairline(draw, (left, rule_y, left + int(w * 0.22), rule_y), (255, 180, 87, 140))

    title_y = kicker_box[3] + int(h * 0.02)
    draw.text((left, title_y), title, font=title_font, fill=INK)
    title_box = draw.textbbox((left, title_y), title, font=title_font)

    line_y = title_box[3] + int(h * 0.01)
    draw.text((left, line_y), line, font=line_font, fill=INK_DIM)
    line_box = draw.textbbox((left, line_y), line, font=line_font)
    hairline(draw, (left, line_box[3] + int(h * 0.07), left + int(w * 0.22), line_box[3] + int(h * 0.07)), (255, 180, 87, 140))
    return base.convert("RGB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    logo = render_logo()
    logo.save(OUT / "logo.png", "PNG", optimize=True)
    render_wide(
        (1500, 500),
        "Selfish",
        "SELFISH",
        "A women-first audio app for rest and desire.",
        (0.48, 0.28),
    ).save(OUT / "banner.png", "PNG", optimize=True)
    render_wide(
        (1200, 630),
        "Selfish+",
        "SELFISH",
        "Rest and Desire. Just for you.",
        (0.52, 0.24),
    ).save(OUT / "opengraph.png", "PNG", optimize=True)
    render_wide(
        (1500, 500),
        "Selfish+",
        "SELFISH+",
        "Full catalog. Time that's just for you.",
        (0.55, 0.30),
    ).save(OUT / "product-banner.png", "PNG", optimize=True)
    for name in ("logo.png", "banner.png", "opengraph.png", "product-banner.png"):
        p = OUT / name
        im = Image.open(p)
        print(f"{name}: {im.size} {p.stat().st_size} bytes")


if __name__ == "__main__":
    main()
