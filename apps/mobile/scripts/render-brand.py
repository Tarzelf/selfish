#!/usr/bin/env python3
"""Render Selfish brand assets from the in-app design system.

Palette and type match apps/mobile/src/constants/theme.ts and cover-art.tsx:
wine-and-candlelight surfaces, gold #DFAE72, italic display serif, letter-spaced
SELFISH mark. Replaces the leftover Expo blueprint icon.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "brand"
IMAGES = ROOT / "assets" / "images"

BG = (20, 16, 25)  # #141019
SURFACE = (29, 22, 38)  # #1D1626
WINE = (43, 22, 49)  # #2B1631
ROSE = (126, 47, 78)  # #7E2F4E
GOLD = (223, 174, 114)  # #DFAE72
TEXT = (243, 237, 247)  # #F3EDF7
TEXT_DIM = (167, 150, 188)

SERIF_IT = "/usr/share/fonts/truetype/noto/NotoSerifDisplay-Italic.ttf"
SERIF = "/usr/share/fonts/truetype/noto/NotoSerifDisplay-Regular.ttf"
SANS = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def lerp(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))  # type: ignore[return-value]


def gradient(size: tuple[int, int], c0: tuple[int, int, int], c1: tuple[int, int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = (x / max(w - 1, 1)) * 0.65 + (y / max(h - 1, 1)) * 0.35
            px[x, y] = lerp(c0, c1, t)
    return img


def glow(size: tuple[int, int], color: tuple[int, int, int], radius: int, center: tuple[int, int]) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = center
    d.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=(*color, 90))
    return layer.filter(ImageFilter.GaussianBlur(radius=int(radius * 0.45)))


def rule(draw: ImageDraw.ImageDraw, y: int, x0: int, x1: int, color: tuple[int, int, int], alpha: int = 90) -> None:
    draw.line((x0, y, x1, y), fill=(*color, alpha), width=1)


def compose_base(size: tuple[int, int], orb: tuple[int, int], orb_r: int) -> Image.Image:
    base = gradient(size, BG, ROSE)
    rgba = base.convert("RGBA")
    rgba = Image.alpha_composite(rgba, glow(size, GOLD, orb_r, orb))
    rgba = Image.alpha_composite(rgba, glow(size, (217, 138, 158), int(orb_r * 0.7), (orb[0] - orb_r // 3, orb[1] + orb_r // 5)))
    return rgba


def draw_kicker(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], size: int, fill=GOLD) -> None:
    f = font(SANS_BOLD if Path(SANS_BOLD).exists() else SANS, size)
    draw.text(xy, text, font=f, fill=fill)


def render_logo(path: Path, size: int = 1024) -> None:
    img = compose_base((size, size), (int(size * 0.62), int(size * 0.38)), int(size * 0.42))
    overlay = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    rule(d, int(size * 0.18), int(size * 0.12), int(size * 0.88), GOLD, 80)
    rule(d, int(size * 0.78), int(size * 0.12), int(size * 0.88), GOLD, 50)

    mark = font(SERIF_IT, int(size * 0.52))
    s = "S"
    bbox = d.textbbox((0, 0), s, font=mark)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1] - size * 0.02), s, font=mark, fill=GOLD)

    kicker = font(SANS_BOLD if Path(SANS_BOLD).exists() else SANS, int(size * 0.055))
    label = "SELFISH"
    kb = d.textbbox((0, 0), label, font=kicker)
    # Manual tracking
    letters = list(label)
    total = sum(d.textbbox((0, 0), ch, font=kicker)[2] for ch in letters) + 10 * (len(letters) - 1)
    x = (size - total) / 2
    y = size * 0.82
    for ch in letters:
        d.text((x, y), ch, font=kicker, fill=(*GOLD, 200))
        x += d.textbbox((0, 0), ch, font=kicker)[2] + 10

    out = Image.alpha_composite(img, overlay)
    path.parent.mkdir(parents=True, exist_ok=True)
    out.convert("RGB").save(path, "PNG")
    print(f"wrote {path} ({size}x{size})")


def render_wordmark_banner(path: Path, size: tuple[int, int], plus: bool, subline: str) -> None:
    w, h = size
    img = compose_base(size, (int(w * 0.78), int(h * 0.28)), int(h * 0.7))
    overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    pad = int(w * 0.07)
    rule(d, int(h * 0.22), pad, int(w * 0.42), GOLD, 90)
    rule(d, int(h * 0.78), pad, int(w * 0.55), GOLD, 45)

    kicker_f = font(SANS_BOLD if Path(SANS_BOLD).exists() else SANS, max(18, h // 28))
    x = pad
    for ch in "SELFISH":
        d.text((x, int(h * 0.26)), ch, font=kicker_f, fill=(*GOLD, 210))
        x += d.textbbox((0, 0), ch, font=kicker_f)[2] + 8

    title = "Selfish+" if plus else "Selfish"
    title_f = font(SERIF_IT, max(64, h // 4))
    d.text((pad, int(h * 0.36)), title, font=title_f, fill=TEXT)

    sub_f = font(SERIF, max(22, h // 16))
    d.text((pad, int(h * 0.62)), subline, font=sub_f, fill=(*TEXT_DIM, 230))

    out = Image.alpha_composite(img, overlay)
    path.parent.mkdir(parents=True, exist_ok=True)
    out.convert("RGB").save(path, "PNG")
    print(f"wrote {path} ({w}x{h})")


def render_favicon(src: Path, dest: Path, size: int) -> None:
    img = Image.open(src).convert("RGB").resize((size, size), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "PNG")
    print(f"wrote {dest} ({size}x{size})")


def render_adaptive_fg(path: Path, size: int = 1024) -> None:
    """Gold italic S on transparent — Android adaptive foreground."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    mark = font(SERIF_IT, int(size * 0.42))
    s = "S"
    bbox = d.textbbox((0, 0), s, font=mark)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1]), s, font=mark, fill=GOLD)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    print(f"wrote {path}")


def render_adaptive_bg(path: Path, size: int = 1024) -> None:
    gradient((size, size), BG, WINE).save(path, "PNG")
    print(f"wrote {path}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    logo = OUT / "logo-1024.png"
    render_logo(logo)
    render_wordmark_banner(OUT / "banner-1920x720.png", (1920, 720), plus=True, subline="Time that's just for you.")
    render_wordmark_banner(OUT / "og-1200x630.png", (1200, 630), plus=True, subline="Rest and Desire. Just for you.")
    render_wordmark_banner(OUT / "store-banner-1500x500.png", (1500, 500), plus=False, subline="A women-first audio app for rest and desire.")

    # App icons — replace Expo placeholders
    render_favicon(logo, IMAGES / "icon.png", 1024)
    render_favicon(logo, IMAGES / "favicon.png", 48)
    render_favicon(logo, IMAGES / "splash-icon.png", 256)
    render_adaptive_fg(IMAGES / "android-icon-foreground.png")
    render_adaptive_bg(IMAGES / "android-icon-background.png")
    render_adaptive_bg(IMAGES / "android-icon-monochrome.png")


if __name__ == "__main__":
    main()
