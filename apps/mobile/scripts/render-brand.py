#!/usr/bin/env python3
"""Render Selfish brand assets from the rebuilt design system.

Tokens match apps/mobile/src/constants/theme.ts:
  ink  #0F0D10
  bone #F0E8DF

The name is the mark. Sentence-case italic. No tracked SELFISH, no gold,
no hotel rules, no glow, no monogram lockup.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "brand"
IMAGES = ROOT / "assets" / "images"

INK = (15, 13, 16)  # #0F0D10
INK_LIFT = (23, 20, 26)  # #17141A
BONE = (240, 232, 223)  # #F0E8DF
BONE_DIM = (168, 155, 144)  # #A89B90

SERIF_IT = "/usr/share/fonts/truetype/noto/NotoSerifDisplay-Italic.ttf"
SANS = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def lerp(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))  # type: ignore[return-value]


def wash(size: tuple[int, int]) -> Image.Image:
    """Barely-there ink to ink-lift. Atmosphere, not a perfume ad."""
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        px_row = lerp(INK, INK_LIFT, t * 0.55)
        for x in range(w):
            px[x, y] = px_row
    return img


def draw_mark(
    draw: ImageDraw.ImageDraw,
    canvas: tuple[int, int],
    glyph: str,
    size_ratio: float,
    fill: tuple[int, ...],
) -> None:
    mark = font(SERIF_IT, int(min(canvas) * size_ratio))
    bbox = draw.textbbox((0, 0), glyph, font=mark)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    # Italic leans right — shift slightly left so it feels centered at 60pt.
    x = (canvas[0] - tw) / 2 - bbox[0] - canvas[0] * 0.018
    y = (canvas[1] - th) / 2 - bbox[1] - canvas[1] * 0.02
    draw.text((x, y), glyph, font=mark, fill=fill)


def render_logo(path: Path, size: int = 1024) -> None:
    img = Image.new("RGB", (size, size), INK)
    overlay = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    draw_mark(d, (size, size), "S", 0.4, BONE)
    out = Image.alpha_composite(img.convert("RGBA"), overlay)
    path.parent.mkdir(parents=True, exist_ok=True)
    out.convert("RGB").save(path, "PNG")
    print(f"wrote {path} ({size}x{size})")


def render_wordmark_banner(path: Path, size: tuple[int, int], subline: str) -> None:
    w, h = size
    img = wash(size).convert("RGBA")
    overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    pad = int(w * 0.08)
    title_f = font(SERIF_IT, max(64, h // 4))
    d.text((pad, int(h * 0.34)), "Selfish", font=title_f, fill=BONE)
    sub_f = font(SANS, max(20, h // 18))
    d.text((pad, int(h * 0.64)), subline, font=sub_f, fill=BONE_DIM)
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
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    draw_mark(d, (size, size), "S", 0.36, BONE)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    print(f"wrote {path}")


def render_adaptive_bg(path: Path, size: int = 1024) -> None:
    Image.new("RGB", (size, size), INK).save(path, "PNG")
    print(f"wrote {path}")


def render_monochrome(path: Path, size: int = 1024) -> None:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    draw_mark(d, (size, size), "S", 0.36, (255, 255, 255, 255))
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    print(f"wrote {path}")


def render_splash(path: Path, size: int = 256) -> None:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    draw_mark(d, (size, size), "S", 0.42, BONE)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    print(f"wrote {path}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    logo = OUT / "logo-1024.png"
    render_logo(logo)
    render_wordmark_banner(
        OUT / "banner-1920x720.png",
        (1920, 720),
        "Intimate audio. Rest and desire.",
    )
    render_wordmark_banner(
        OUT / "og-1200x630.png",
        (1200, 630),
        "Intimate audio. Rest and desire.",
    )
    render_wordmark_banner(
        OUT / "store-banner-1500x500.png",
        (1500, 500),
        "A women-first audio app.",
    )

    render_favicon(logo, IMAGES / "icon.png", 1024)
    render_favicon(logo, IMAGES / "favicon.png", 48)
    render_splash(IMAGES / "splash-icon.png")
    render_adaptive_fg(IMAGES / "android-icon-foreground.png")
    render_adaptive_bg(IMAGES / "android-icon-background.png")
    render_monochrome(IMAGES / "android-icon-monochrome.png")


if __name__ == "__main__":
    main()
