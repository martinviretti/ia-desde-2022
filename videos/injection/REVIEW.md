# Review: prompt injection (30 s)

## Decisiones creativas
- Storyline A ("el hotel que da órdenes"). No construidas: B (pantalla dividida) y C (la nota bajo la puerta).
- El texto escondido es blanco sobre blanco y deja un hueco visible en el párrafo: una pista real de cómo se ve en la práctica.
- El final muestra la defensa concreta (confirmación humana) y no solo el miedo.
- Sin sonido: autoplay muteado en la web.

## Qué se midió y qué se miró
- `hyperframes check`: 0 errores. Snapshots de 13 momentos.
- Corregido: el acercamiento al texto revelado cortaba la página (bajado de 1.55× a 1.25× y centrado), la última línea del registro duraba poco.

## Avisos que quedan a propósito
- `contrast_aa_failure` en el texto escondido (es la trampa) y en la página atenuada detrás del diálogo.
- `text_below_floor` en el navegador achicado: queda como contexto mientras se lee el registro del agente.
- `container_overflow` de la banda de escaneo: recorre la página de punta a punta.
- `film_silent`: autoplay muteado.

## Lo más débil
- El navegador achicado a la izquierda queda chico; con más tiempo, el registro del agente saldría desde el mismo texto revelado.
