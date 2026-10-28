"""Genera compositions/prediccion.html (filas de candidatos, pared de texto y palabras)."""
SETS = {
    "p-set1": [("luz", 62), ("atmósfera", 21), ("Tierra", 9), ("gente", 5), ("noche", 3)],
    "p-set2": [("del", 48), ("se", 27), ("azul", 11), ("viaja", 8), ("solar", 6)],
    "p-set3": [("sol", 81), ("día", 9), ("cielo", 5), ("universo", 3), ("foco", 2)],
}


def rows(sid, items):
    out = [f'      <div id="{sid}" class="p-set">']
    for k, (w, p) in enumerate(items):
        out.append(
            f'        <div class="p-row" id="{sid}-r{k}"><div class="p-hl"></div><span class="p-tok">{w}</span>'
            f'<span class="p-track"><span class="p-bar" data-p="{p}"></span></span><span class="p-pct">{p}%</span></div>'
        )
    out.append("      </div>")
    return "\n".join(out)


sets_html = "\n".join(rows(k, v) for k, v in SETS.items())
ans = "Porque la luz del sol choca con el aire, que dispersa más el azul.".split(" ")
ans_html = " ".join(f'<span class="p-a" id="p-a{i}">{w}</span>' for i, w in enumerate(ans))
wall = [
    "En un lugar de la Mancha, de cuyo nombre no quiero acordarme,",
    "def predecir(tokens): return modelo(tokens).argmax()",
    "La fotosíntesis convierte la luz en energía química.",
    "Receta: 200 g de harina, 2 huevos y una pizca de sal.",
    "The mitochondria is the powerhouse of the cell.",
    None,
    None,
    "SELECT nombre FROM clientes WHERE pais = 'AR';",
    "Todos los habitantes de la Nación gozan de los siguientes derechos...",
    "¿Cómo cambio la batería del auto? Primero, apagá el motor.",
    "E = mc², donde c es la velocidad de la luz.",
    "Querido diario: hoy llovió todo el día.",
    "for (let i = 0; i &lt; n; i++) { total += precios[i]; }",
    "Il était une fois, dans un pays lointain...",
    "Tutorial: cómo armar una planilla de gastos.",
    "La Revolución de Mayo ocurrió en 1810.",
    "import numpy as np",
    "Las ballenas se comunican con cantos que viajan kilómetros.",
    "Reseña: el hotel estaba limpio y el desayuno, excelente.",
    "To be, or not to be, that is the question.",
    "Manual de usuario, capítulo 3: configuración inicial.",
    "La ley de Ohm relaciona tensión, corriente y resistencia.",
]
base = [l for l in wall if l is not None]


def long_line(k):
    return "&nbsp;&nbsp;&nbsp;".join(base[(k * 3 + j) % len(base)] for j in range(3))


lines = [long_line(k) for k in range(15)] + [None, None] + [long_line(k + 15) for k in range(33)]
wall_html = "\n".join(
    '        <div class="p-wl p-gap"></div>' if l is None else f'        <div class="p-wl">{l}</div>' for l in lines
)
intro_words = "Un LLM hace lo mismo, a otra escala.".split(" ")
intro_html = " ".join(
    f'<span class="p-iw{" p-acc" if w in ("otra", "escala.") else ""}">{w}</span>' for w in intro_words
).replace("mismo,</span> ", "mismo,</span><br />")
line_words = "No busca la respuesta. Calcula la palabra que sigue.".split(" ")
line_html = " ".join(
    f'<span class="p-lw{" p-acc" if i >= 6 else ""}">{w}</span>' for i, w in enumerate(line_words)
)
l1 = " ".join(f'<span class="p-mw">{w}</span>' for w in "¿Cómo aprendió?".split(" "))
l2 = " ".join(
    f'<span class="p-mw{" p-acc" if w == "todo" else ""}">{w}</span>' for w in "Leyendo casi todo lo escrito.".split(" ")
)

TEMPLATE = open(__import__("os").path.join(__import__("os").path.dirname(__file__),"_prediccion_template.html"), encoding="utf-8").read()
html = (
    TEMPLATE.replace("{{INTRO}}", intro_html)
    .replace("{{WALL}}", wall_html)
    .replace("{{ANS}}", ans_html)
    .replace("{{SETS}}", sets_html)
    .replace("{{LINE}}", line_html)
    .replace("{{L1}}", l1)
    .replace("{{L2}}", l2)
)
open(__import__("os").path.join(__import__("os").path.dirname(__file__),"..","..","llm","compositions","prediccion.html"), "w", encoding="utf-8").write(html)
print("ok", len(ans), "palabras en la respuesta")
