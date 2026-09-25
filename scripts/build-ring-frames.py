"""Genera public/ring-frames/ (la secuencia WebP del giro del anillo) a partir
de media/ring-scroll.mp4. Requiere ffmpeg y Pillow (pip install pillow).

    python3 scripts/build-ring-frames.py

Si cambia el número de fotogramas, actualiza FRAME_COUNT en src/lib/ringFrames.js.
"""
import glob
import os
import shutil
import subprocess
import tempfile

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, 'media', 'ring-scroll.mp4')
OUT_DIR = os.path.join(ROOT, 'public', 'ring-frames')
QUALITY = 85

with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(['ffmpeg', '-v', 'error', '-i', SOURCE, os.path.join(tmp, '%03d.png')], check=True)
    pngs = sorted(glob.glob(os.path.join(tmp, '*.png')))

    shutil.rmtree(OUT_DIR, ignore_errors=True)
    os.makedirs(OUT_DIR)
    for index, png in enumerate(pngs):
        frame = Image.open(png).convert('RGB')
        frame.save(os.path.join(OUT_DIR, f'{index:03d}.webp'), 'WEBP', quality=QUALITY, method=6)

print(f'{len(pngs)} fotogramas en {OUT_DIR}')
