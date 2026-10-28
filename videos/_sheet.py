import sys, glob, os
from PIL import Image, ImageDraw
src, dst, cols = sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 3
fs = sorted(glob.glob(os.path.join(src, 'frame-*.png')))
W, H = 640, 360
rows = (len(fs) + cols - 1) // cols
sh = Image.new('RGB', (cols * (W + 6), rows * (H + 26)), (40, 40, 40))
for k, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((W, H))
    x, y = (k % cols) * (W + 6), (k // cols) * (H + 26)
    sh.paste(im, (x, y + 22))
    ImageDraw.Draw(sh).text((x + 4, y + 4), os.path.basename(f), fill=(255, 200, 0))
sh.save(dst); print(dst, len(fs))
