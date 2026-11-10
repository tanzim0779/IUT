from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path("android-app/android/app/src/main/res")

# Coordinates are measured from the supplied 1536x1536 logo image.
# Crop a centered square around the actual mark so it fills the launcher tile.
CROP_LEFT, CROP_TOP, CROP_SIZE = 100, 150, 1050
SHAPES = [
    (173, 240, 299, 358, (242, 60, 59, 255)),
    (173, 496, 299, 1017, (242, 60, 59, 255)),
    (385, 242, 509, 1018, (0, 216, 77, 255)),
    (508, 899, 741, 1021, (0, 216, 77, 255)),
    (740, 494, 873, 1020, (0, 216, 77, 255)),
    (625, 237, 1076, 358, (245, 245, 245, 255)),
    (941, 496, 1067, 1025, (245, 245, 245, 255)),
]

def draw_mark(canvas, scale, offset_x, offset_y):
    draw = ImageDraw.Draw(canvas)
    for x1, y1, x2, y2, color in SHAPES:
        coords = [
            (x1 - CROP_LEFT) * scale + offset_x,
            (y1 - CROP_TOP) * scale + offset_y,
            (x2 - CROP_LEFT) * scale + offset_x,
            (y2 - CROP_TOP) * scale + offset_y,
        ]
        draw.rounded_rectangle(tuple(round(v) for v in coords), radius=max(2, round(5 * scale)), fill=color)

# Full-bleed legacy icon, with the artwork centered and at a useful size.
legacy = Image.new("RGBA", (1024, 1024), (3, 4, 4, 255))
draw_mark(legacy, 1024 / CROP_SIZE, 0, 0)

for density, pixels in {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}.items():
    folder = ROOT / f"mipmap-{density}"
    folder.mkdir(parents=True, exist_ok=True)
    icon = legacy.resize((pixels, pixels), Image.Resampling.LANCZOS)
    icon.save(folder / "ic_launcher.png", optimize=True)
    icon.save(folder / "ic_launcher_round.png", optimize=True)

# Adaptive foreground: keep all colored geometry inside Android's central safe area.
foreground = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
safe_scale = (432 * 0.66) / CROP_SIZE
mark_size = CROP_SIZE * safe_scale
draw_mark(foreground, safe_scale, (432 - mark_size) / 2, (432 - mark_size) / 2)
drawable = ROOT / "drawable"
drawable.mkdir(parents=True, exist_ok=True)
foreground.save(drawable / "ic_launcher_foreground.png", optimize=True)

adaptive = ROOT / "mipmap-anydpi-v26"
adaptive.mkdir(parents=True, exist_ok=True)
xml = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
"""
(adaptive / "ic_launcher.xml").write_text(xml, encoding="utf-8")
(adaptive / "ic_launcher_round.xml").write_text(xml, encoding="utf-8")

values = ROOT / "values"
values.mkdir(parents=True, exist_ok=True)
(values / "ic_launcher_background.xml").write_text(
    """<?xml version="1.0" encoding="utf-8"?>
<resources><color name="ic_launcher_background">#030404</color></resources>
""", encoding="utf-8")
print("Generated centered legacy and adaptive launcher icons.")
