from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "generated-icons" / "res"
SCALE = 4
canvas = Image.new("RGB", (512*SCALE, 512*SCALE), "#000000")
draw = ImageDraw.Draw(canvas)

def rect(box, color, radius=3):
    scaled = tuple(int(v*SCALE) for v in box)
    draw.rounded_rectangle(scaled, radius=radius*SCALE, fill=color)

# Recreate the supplied IUT mark cleanly for crisp launcher rendering.
rect((58, 80, 100, 119), "#f0443e")
rect((58, 165, 100, 339), "#f0443e")
rect((129, 81, 170, 339), "#00d65a")
rect((170, 299, 247, 340), "#00d65a")
rect((247, 165, 291, 340), "#00d65a")
rect((208, 79, 359, 119), "#ffffff")
rect((314, 166, 356, 343), "#ffffff")

canvas = canvas.resize((512, 512), Image.Resampling.LANCZOS)
sizes = {"mipmap-mdpi": 48, "mipmap-hdpi": 72, "mipmap-xhdpi": 96,
         "mipmap-xxhdpi": 144, "mipmap-xxxhdpi": 192}
for folder, size in sizes.items():
    dest = OUT / folder
    dest.mkdir(parents=True, exist_ok=True)
    icon = canvas.resize((size, size), Image.Resampling.LANCZOS)
    icon.save(dest / "ic_launcher.png", optimize=True)
    icon.save(dest / "ic_launcher_round.png", optimize=True)

# Adaptive icon foreground uses the same black-backed artwork.
foreground = canvas.resize((432, 432), Image.Resampling.LANCZOS)
foreground.save(OUT / "mipmap-xxxhdpi" / "ic_launcher_foreground.png", optimize=True)

adaptive_dir = OUT / "mipmap-anydpi-v26"
adaptive_dir.mkdir(parents=True, exist_ok=True)
adaptive = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/iut_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
"""
(adaptive_dir / "ic_launcher.xml").write_text(adaptive)
(adaptive_dir / "ic_launcher_round.xml").write_text(adaptive)

values = OUT / "values"
values.mkdir(parents=True, exist_ok=True)
(values / "iut_launcher_colors.xml").write_text("""<?xml version="1.0" encoding="utf-8"?>
<resources><color name="iut_launcher_background">#000000</color></resources>
""")
