# Brief: videos explicativos para "Ponerse al día con la IA"

- flow: automation · storyboard: no · mode: autonomous (confirmado por Martín)
- language: es (rioplatense) · aspect: 1920x1080, 30 fps (destino: embebido en la landing, 16:9)
- narration: no. Los videos se reproducen solos y muteados dentro de la web (los navegadores solo permiten autoplay sin sonido), así que van sin música ni efectos: el texto grande y las imágenes cargan todo.
- audience: alguien que se desconectó en 2022; público general + perfiles IT.
- design: la identidad de la landing (fondo #0e0e10, mundo 2022 #f1f1ef, acento #ff7a45, Geist / Geist Mono, fotos con duotono naranja).

## Videos (elegidos por Claude a pedido de Martín: "elegí vos, a criterio")

| Carpeta | Idea única | Duración | Reemplaza en la web |
| --- | --- | --- | --- |
| `llm/` | Un LLM escribe adivinando la próxima palabra, una por vez, a partir de todo lo que leyó; por eso a veces inventa. | ~38 s | la escena de scroll de las palabras (#gen) |
| `agente/` | Un agente recibe un objetivo y usa herramientas en un ciclo hasta cumplirlo, y frena antes de lo irreversible. | ~38 s | la escena de scroll del agente (#agent) |
| `injection/` | Un agente puede obedecer instrucciones escondidas en lo que lee; por eso no debe pagar ni enviar datos sin tu OK. | ~30 s | la demo estática del hotel (#inject) |

Descartado: un tráiler "2022 → 2026", porque repetiría la intro de la web.
