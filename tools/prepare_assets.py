"""Render the supplied research figures for the website; keep source PDFs intact."""
from pathlib import Path
import shutil
import pypdfium2 as pdfium
from PIL import Image, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = next(p for p in ROOT.parent.iterdir() if p.is_dir() and p.name.startswith('Knowing'))
OUT = ROOT / 'assets' / 'images'
FIGURES = {
    'introduction01': 'overview',
    'drawbreath01': 'system',
    'results5.2-00': 'participation',
    'results5.2.2': 'continuation',
    'results5.2.3+5.3.1': 'perceptions',
    'results5.3.2': 'trajectories',
}
tiles = []
for stem, name in FIGURES.items():
    doc = pdfium.PdfDocument(SOURCE / 'figures' / (stem + '.pdf'))
    page = doc[0]
    im = page.render(scale=2600 / page.get_width()).to_pil().convert('RGB')
    im.save(OUT / (name + '.webp'), quality=92, method=6)
    tile = Image.new('RGB', (820, 580), '#eeece7')
    thumb = ImageOps.contain(im, (800, 535))
    tile.paste(thumb, ((820-thumb.width)//2, 35))
    ImageDraw.Draw(tile).text((16, 10), name, fill='black')
    tiles.append(tile)
    print(name, im.size)
sheet = Image.new('RGB', (1640, 1740), 'white')
for i, tile in enumerate(tiles):
    sheet.paste(tile, ((i%2)*820, (i//2)*580))
sheet.save(ROOT / 'qa' / 'source-contact-sheet.jpg')
paper = next(ROOT.parent.glob('Knowing*.pdf'))
shutil.copy2(paper, ROOT / 'assets' / 'paper' / 'drawbreath-paper.pdf')
doc = pdfium.PdfDocument(paper)
doc[0].render(scale=1.5).to_pil().save(ROOT / 'qa' / 'paper-first-page.png')
text = '\n'.join(doc[i].get_textpage().get_text_range() for i in range(len(doc)))
(ROOT / 'qa' / 'paper-extracted.txt').write_text(text, encoding='utf-8')
print('Paper pages:', len(doc))

# Exact panel crops from the supplied figures, without redrawing the children's work.
# Coordinates refer to a 2048-pixel-wide reference render.
def crop_panel(source, box, name):
    page = pdfium.PdfDocument(SOURCE / 'figures' / (source + '.pdf'))[0]
    im = page.render(scale=5200 / page.get_width()).to_pil().convert('RGB')
    ratio = im.width / 2048
    im = im.crop(tuple(round(v * ratio) for v in box))
    im.save(OUT / (name + '.webp'), quality=95, method=6)

for name, box in {
    'drawing-seed': (474, 124, 571, 220),
    'drawing-butterfly': (1709, 126, 1802, 220),
    'drawing-character': (1848, 478, 1940, 571),
    'drawing-clock': (1845, 810, 1940, 904),
}.items():
    crop_panel('results5.3.2', box, name)
crop_panel('drawbreath01', (171, 55, 887, 591), 'study-session')
