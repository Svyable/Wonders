#!/usr/bin/env python3
"""Optional: re-encode a locally available NASA Blue Marble JPEG to an app WebP texture.

Usage: python source/make_earth.py /path/to/NASA-world-composite.jpg

The release already includes the derived asset. This command needs PIL, but the
single-file release builder does not. The supplied JPEG must be an equirectangular
image with the north pole at the TOP and the prime meridian at pixel midpoint.
NASA Blue Marble source: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/
"""
from pathlib import Path
from PIL import Image,ImageEnhance
import sys
if len(sys.argv)!=2:
    raise SystemExit('Usage: python source/make_earth.py /path/to/NASA-blue-marble-equirectangular.jpg')
src=Path(sys.argv[1]);assert src.is_file(),src
im=Image.open(src).convert('RGB').resize((4096,2048),Image.Resampling.LANCZOS)
out=Path(__file__).resolve().parent.parent/'assets/earth.webp'
ImageEnhance.Color(im).enhance(1.08).save(out,'WEBP',quality=88,method=6)
print('Converted NASA Blue Marble source to:',out)
