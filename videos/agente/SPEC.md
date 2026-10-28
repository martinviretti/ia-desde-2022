GOAL:    que se entienda la diferencia entre un chatbot (te dice qué hacer) y un agente (lo hace con herramientas, en un ciclo, y te pide OK para lo irreversible).
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps, silencioso (autoplay muteado en la web)
TIME:    38 s x 30 = 1140 frames. Escenas: chatbot 0-9 · agente 9-31.5 · cierre 31.5-38
LOOK:    fondo #0e0e10 sólido, paneles #16161a con borde #2a2a30 (2 px), tinta #ededee, gris #a0a0aa.
         acento #ff7a45: el pedido del usuario, la estación activa del ciclo, el portador, el botón Confirmar, una palabra del cierre.
         Geist 700 para títulos 64-96 px (tracking -3%); Geist 600 para tarjetas 52-56 px; Geist Mono 500 para el reloj (72 px).
         foto de cierre: persona trabajando con laptop, duotono horneado (assets/img/work-duo.jpg).
OBJECTS: chat (burbuja del usuario naranja, respuesta del bot en gris con lista numerada); pestañas de navegador (borde superior redondeado, título, cruz);
         ciclo del agente (anillo de 600 px, 4 estaciones con nombre, portador naranja que viaja, reloj en el centro);
         tarjeta de acción (herramienta + resultado); diálogo de confirmación con dos botones; cursor.
MOTION:  entradas expo.out 0.5-0.6 s · giros del portador power2.inOut 0.6 s · salidas power3.in 0.25 s · pestañas caen con back.out(1.4) 0.45 s, stagger 0.15 s
         tarjetas: blur swap en el mismo lugar (salida blur 8 px 0.18 s, entrada blur → 0 0.2 s); títulos por palabra 0.13 s, 0.067 s entre palabras.
SHOTS:   0.0-2.0  chat lleno de cuadro a la izquierda con el pedido; la respuesta se escribe línea por línea
         2.0-5.0  "Un chatbot te dice qué hacer." a la derecha (hold 3 s)
         5.2-8.6  la lista se te vuelve 6 pestañas apiladas · "Y lo hacés vos." (hold 2.4 s)
         8.6-9.6  las pestañas vuelan al centro del ciclo y se funden en él
         9.6-12.8 el ciclo se dibuja, aparece el objetivo · "Un agente recibe un objetivo y trabaja hasta cumplirlo." (hold 3 s)
         13.0-28.6 6 pasos de 2.6 s: plan · calendario · web · resultado (falla) · ajuste · mail; el portador gira a la estación; el reloj corre 00:00 → 04:12
         28.6-31.5 "¿Pago la seña del restaurante?" · el cursor toca Confirmar
         31.5-38  foto de alguien trabajando · "Hace el trabajo." / "Vos decidís lo irreversible." (hold ≥ 3 s)
BANNED:  vacío oscuro con cosas chicas en el medio (el ciclo mide 600 px, la tarjeta 720 px); glow, partículas; tres tarjetas en fila (las tarjetas se reemplazan en un mismo lugar);
         todo entrando con fade + slide-up; etiquetas mono en mayúsculas; logo en un rincón; títulos que se mueven después de aterrizar.
QA:      0.5 (chat legible) · 3.5 (título) · 7.5 (pestañas encima) · 11 (ciclo + objetivo) · 17 (paso web) · 22 (falla) · 30 (confirmación) · 36 (cierre)
