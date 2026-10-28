"""Inserta los logos (sprite SVG + carrusel + chips por capa) en index.html.
Fuentes: Simple Icons (CC0) y LobeHub Icons (MIT), descargados de jsDelivr.
Las marcas pertenecen a sus dueños; se usan solo para identificar a cada empresa o producto.
"""
import os, re, shutil, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TMP = os.path.join(ROOT, "_logos_tmp")
OUT_DIR = os.path.join(ROOT, "img", "logos")
os.makedirs(OUT_DIR, exist_ok=True)

# clave: (archivo, nombre visible, fuente)
LOGOS = {
    "openai": ("lobe-openai.svg", "OpenAI", "LobeHub Icons"),
    "anthropic": ("simple-anthropic.svg", "Anthropic", "Simple Icons"),
    "claude": ("lobe-claude.svg", "Claude", "LobeHub Icons"),
    "google": ("simple-google.svg", "Google", "Simple Icons"),
    "gemini": ("lobe-gemini.svg", "Gemini", "LobeHub Icons"),
    "meta": ("simple-meta.svg", "Meta", "Simple Icons"),
    "xai": ("lobe-grok.svg", "xAI", "LobeHub Icons"),
    "deepseek": ("lobe-deepseek.svg", "DeepSeek", "LobeHub Icons"),
    "qwen": ("lobe-qwen.svg", "Qwen", "LobeHub Icons"),
    "kimi": ("lobe-kimi.svg", "Kimi", "LobeHub Icons"),
    "mistral": ("lobe-mistral.svg", "Mistral", "LobeHub Icons"),
    "perplexity": ("lobe-perplexity.svg", "Perplexity", "LobeHub Icons"),
    "copilot": ("lobe-copilot.svg", "Copilot", "LobeHub Icons"),
    "huggingface": ("lobe-huggingface.svg", "Hugging Face", "LobeHub Icons"),
    "microsoft": ("lobe-microsoft.svg", "Microsoft", "LobeHub Icons"),
    "azure": ("lobe-azure.svg", "Azure", "LobeHub Icons"),
    "aws": ("lobe-aws.svg", "AWS", "LobeHub Icons"),
    "googlecloud": ("lobe-googlecloud.svg", "Google Cloud", "LobeHub Icons"),
    "oracle": ("simple-oracle.svg", "Oracle", "Simple Icons"),
    "alibabacloud": ("lobe-alibabacloud.svg", "Alibaba Cloud", "LobeHub Icons"),
    "nvidia": ("lobe-nvidia.svg", "NVIDIA", "LobeHub Icons"),
    "amd": ("simple-amd.svg", "AMD", "Simple Icons"),
    "intel": ("simple-intel.svg", "Intel", "Simple Icons"),
}


def parse(svg):
    root = re.search(r"<svg\b([^>]*)>", svg).group(1)
    vb = re.search(r'viewBox="([^"]+)"', root).group(1)
    rule = re.search(r'fill-rule="([^"]+)"', root)
    inner = svg[svg.index(">", svg.index("<svg")) + 1 : svg.rindex("</svg>")]
    inner = re.sub(r"<title>.*?</title>", "", inner, flags=re.S).strip()
    return vb, (rule.group(1) if rule else None), inner


symbols, credits = [], []
for key, (fname, label, src) in LOGOS.items():
    path = os.path.join(TMP, fname)
    if not os.path.exists(path):  # sin la carpeta temporal, usa las copias guardadas en img/logos
        path = os.path.join(OUT_DIR, f"{key}.svg")
    svg = open(path, encoding="utf-8").read()
    dst = os.path.join(OUT_DIR, f"{key}.svg")
    if os.path.abspath(path) != os.path.abspath(dst):
        shutil.copy(path, dst)
    vb, rule, inner = parse(svg)
    g_attr = f' fill-rule="{rule}" clip-rule="{rule}"' if rule else ""
    symbols.append(f'<symbol id="lg-{key}" viewBox="{vb}"><g{g_attr}>{inner}</g></symbol>')
    credits.append((key, label, src))

sprite = (
    '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">'
    + "".join(symbols)
    + "</svg>"
)


WORDMARKS = {"amd", "intel", "aws"}


def icon(key):
    cls = "lg-ico lg-wm" if key in WORDMARKS else "lg-ico"
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#lg-{key}"/></svg>'


def chip(key, label=None):
    label = label or LOGOS[key][1]
    return f'<li class="lg-chip">{icon(key)}<span>{label}</span></li>'


def row(title, items):
    chips = "".join(chip(*i) if isinstance(i, tuple) else chip(i) for i in items)
    head = f'<span class="lg-cap">{title}</span>' if title else ""
    return f'<div class="lg-block">{head}<ul class="lg-row">{chips}</ul></div>'


marquee_keys = ["openai", "anthropic", "google", "meta", "mistral", "deepseek", "qwen", "kimi", "xai", "nvidia", "microsoft", "huggingface", "perplexity", "aws"]


def marquee_items(hidden=False):
    return "".join(
        f'<li class="mq-item"{" aria-hidden=\"true\"" if hidden else ""} title="{LOGOS[k][1]}">{icon(k)}<span class="mq-name">{LOGOS[k][1]}</span></li>'
        for k in marquee_keys
    )


marquee = (
    '<div class="mq rv" role="group" aria-label="Algunas de las empresas que hacen modelos de IA, chips y nube">'
    f'<ul class="mq-track">{marquee_items()}{marquee_items(True)}</ul></div>'
)

layers = {
    "products": (
        '<div class="layer l-products"><h3>Productos</h3><p>Lo que usás de verdad. Y miles de apps que "alquilan" un modelo por internet (vía API) para funcionar.</p>'
        + row("", [("openai", "ChatGPT"), "claude", "gemini", "copilot", ("meta", "Meta AI"), ("xai", "Grok"), "perplexity"])
        + "</div>"
    ),
    "models": (
        '<div class="layer l-models"><h3>Modelos y laboratorios</h3><p>Los <b>cerrados</b> se usan solo a través de su empresa. Los <b>abiertos</b> se pueden descargar y correr por tu cuenta.</p>'
        + row("Cerrados", ["openai", "anthropic", "google", "xai", ("meta", "Meta (Muse)")])
        + row("Abiertos", ["deepseek", "qwen", "kimi", "mistral", ("meta", "Meta (Llama)")])
        + "</div>"
    ),
    "cloud": (
        '<div class="layer l-cloud"><h3>Nube y data centers</h3><p>Los más grandes consumen tanta electricidad como una ciudad.</p>'
        + row("", ["azure", "aws", "googlecloud", "oracle", "alibabacloud"])
        + "</div>"
    ),
    "chips": (
        '<div class="layer l-chips"><h3>Chips</h3><p>Procesadores especiales para entrenar y ejecutar modelos. Casi todos los avanzados se fabrican en Taiwán (TSMC): por eso son tema geopolítico.</p>'
        + row("", ["nvidia", "amd", "intel", ("google", "Google (TPU)")])
        + "</div>"
    ),
}

p = os.path.join(ROOT, "index.html")
s = open(p, encoding="utf-8").read()

# 1) Sprite (una sola vez)
if 'id="lg-openai"' in s:
    s = re.sub(r'<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute"[^>]*>.*?</svg>\s*', "", s, count=1, flags=re.S)
s = s.replace('<div class="progress" aria-hidden="true">', sprite + '\n<div class="progress" aria-hidden="true">', 1)

# 2) Capas de la pirámide: se reemplaza el bloque completo (seguro de re-ejecutar)
vos = '<div class="layer l-you"><h3>Vos</h3><p>Usás la IA directamente o sin saberlo, adentro de otras apps.</p></div>'
NL = chr(10)
stack_html = (
    '<div class="stack" id="stack">' + NL + "      "
    + (NL + "      ").join([vos, layers["products"], layers["models"], layers["cloud"], layers["chips"]])
    + NL + "    </div>" + NL + NL + "    "
)
a = s.index('<div class="stack" id="stack">')
b = s.index('<div class="split-facts">', a)
s = s[:a] + stack_html + s[b:]

# 3) Carrusel debajo del título (una sola vez)
s = re.sub(r'\s*<div class="mq rv".*?</ul></div>', "", s, flags=re.S)
anchor = '<h2 class="split">Quién es quién</h2>'
assert anchor in s
s = s.replace(anchor, anchor + "\n    " + marquee, 1)

# 4) Créditos de logos en el pie
s = re.sub(r'\s*<p class="logo-credits">.*?</p>', "", s, flags=re.S)
s = s.replace(
    '<p class="disclaimer">',
    '<p class="logo-credits">Logos: <a href="https://github.com/lobehub/lobe-icons" target="_blank" rel="noopener">LobeHub Icons</a> (MIT) y <a href="https://simpleicons.org" target="_blank" rel="noopener">Simple Icons</a> (CC0). Las marcas pertenecen a sus respectivos dueños y se muestran solo para identificarlos.</p>\n    <p class="disclaimer">',
    1,
)
open(p, "w", encoding="utf-8").write(s)
print("ok", len(symbols), "logos")
