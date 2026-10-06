"""Genera las tres versiones del anillo (secuencias WebP en public/ring-frames/) a
partir de media/. Requiere ffmpeg y Pillow (pip install pillow).

    python3 scripts/build-ring-frames.py              # las tres
    python3 scripts/build-ring-frames.py medium low   # solo las indicadas

Inicio elige una según la velocidad de conexión (src/lib/networkTier.js):
- normal: el giro completo, todos los fotogramas de media/ring-scroll.mp4.
- medium: el brillo de la gema de media/ring-medium.mp4, solo hasta los 3.71 s y uno
  de cada 4 fotogramas (6 por segundo): los menos posibles para que cargue rápido.
- low: una sola imagen fija, media/ring-low.png.

Si cambia el número de fotogramas, actualiza SEQUENCES en src/lib/ringFrames.js.
"""
import glob
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUALITY = 85
SIZE = (1280, 720)

# versión: (fuente en media/, carpeta en public/ring-frames/, opciones de ffmpeg)
TIERS = {
    'normal': ('ring-scroll.mp4', 'normal-network', []),
    'medium': ('ring-medium.mp4', 'medium-network', ['-t', '3.71', '-vf', "select='not(mod(n,4))'", '-fps_mode', 'vfr']),
    'low': ('ring-low.png', 'low-network', []),
}

for name in sys.argv[1:] or TIERS:
    source, folder, options = TIERS[name]
    out_dir = os.path.join(ROOT, 'public', 'ring-frames', folder)

    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(
            ['ffmpeg', '-v', 'error', '-i', os.path.join(ROOT, 'media', source), *options, os.path.join(tmp, '%03d.png')],
            check=True,
        )
        pngs = sorted(glob.glob(os.path.join(tmp, '*.png')))

        shutil.rmtree(out_dir, ignore_errors=True)
        os.makedirs(out_dir)
        for index, png in enumerate(pngs):
            frame = Image.open(png).convert('RGB')
            # Todas al tamaño del lienzo (la imagen fija viene a 1920×1080).
            if frame.size != SIZE:
                frame = frame.resize(SIZE, Image.LANCZOS)
            frame.save(os.path.join(out_dir, f'{index:03d}.webp'), 'WEBP', quality=QUALITY, method=6)

    print(f'{name}: {len(pngs)} fotogramas en {out_dir}')
