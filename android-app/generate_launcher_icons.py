from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path("android-app/android/app/src/main/res")
SIZE = 1024

def make_logo(transparent=False):
    bg = (0, 0, 0, 0) if transparent else (3, 4, 4, 255)
    image = Image.new("RGBA", (SIZE, SIZE), bg)
    draw = ImageDraw.Draw(image)
    scale, offset = 0.80, 102
    # Rectangles reproduce the red, green and white geometric IUT mark.
    shapes = [
        (116, 160, 200, 238, (242, 60, 59, 255)),
        (116, 331, 200, 678, (242, 60, 59, 255)),
        (257, 162, 340, 678, (0, 216, 77, 255)),
        (340, 599, 494, 682, (0, 216, 77, 255)),
        (493, 329, 582, 682, (0, 216, 77, 255)),
        (417, 158, 717, 238, (245, 245, 245, 255)),
        (627, 331, 711, 685, (245, 245, 245, 255)),
    ]
    for x1, y1, x2, y2, color in shapes:
        box = tuple(round(v * scale + offset) for v in (x1, y1, x2, y2))
        draw.rounded_rectangle(box, radius=5, fill=color)
    return image

# Legacy launcher icons for older Android launchers.
legacy = make_logo(False)
for density, pixels in {"mdpi":48, "hdpi":72, "xhdpi":96, "xxhdpi":144, "xxxhdpi":192}.items():
    folder = ROOT / f"mipmap-{density}"
    folder.mkdir(parents=True, exist_ok=True)
    icon = legacy.resize((pixels, pixels), Image.Resampling.LANCZOS)
    icon.save(folder / "ic_launcher.png", optimize=True)
    icon.save(folder / "ic_launcher_round.png", optimize=True)

# Adaptive icon foreground; the black background is supplied separately.
drawable = ROOT / "drawable"
drawable.mkdir(parents=True, exist_ok=True)
make_logo(True).resize((432, 432), Image.Resampling.LANCZOS).save(drawable / "ic_launcher_foreground.png", optimize=True)

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
print("Generated legacy and adaptive launcher icons.")
