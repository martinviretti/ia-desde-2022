GOAL:    que se entienda que un agente puede obedecer texto escondido en lo que lee, y que la defensa es que nunca pague ni envíe datos sin tu confirmación.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps, silencioso (autoplay muteado en la web)
TIME:    30 s x 30 = 900 frames. Escenas: pedido 0-5 · pagina 5-25 · regla 25-30
LOOK:    fondo #0e0e10, paneles #16161a con borde #2a2a30, tinta #ededee, gris #a0a0aa, acento #ff7a45 (el pedido, el escaneo, la palabra clave).
         página del hotel: fondo #fbfbfa, tinta #1f1f1f, una franja de mar dibujada plana (#7fa7b8 sobre #e9dcc5), botón #1f1f1f.
         texto escondido: #fbfbfa sobre #fbfbfa; revelado: #b42318 sobre #fde4e0. Peligro del agente: #e5484d.
         Geist 700 títulos 64-110 px; Geist 600 UI 34-48 px; Geist Mono 500 para URL y registro del agente (30 px).
OBJECTS: chat; ventana de navegador con barra de URL; página de hotel (nombre, ubicación, precio, botón Reservar, párrafo con texto escondido);
         banda de escaneo; registro del agente con barra de envío; diálogo de confirmación; cursor.
MOTION:  entradas expo.out 0.5 s · escaneo power1.inOut 2 s · acercamiento power2.inOut 0.8 s · carry across 0.9 s power2.inOut
         diálogo: scale 0.92→1 expo.out 0.4 s con fondo atenuado 40% · títulos por palabra 0.13 s / 0.067 s.
SHOTS:   0.0-4.6  chat con el pedido y la respuesta "Dale. Busco y comparo." · "Le pedís algo simple a tu agente." (hold 2.8 s)
         5.0-8.8  navegador con la página del hotel · "Vos ves una página normal." (hold 3 s)
         9.0-11.0 banda de escaneo baja por la página y revela el texto escondido
         11.2-14.6 "Tu agente lee también lo escondido." (hold 3.2 s); acercamiento al texto revelado
         15.8-19.4 el navegador se achica a la izquierda, aparece el registro del agente: lee, encuentra la instrucción, empieza a enviar la tarjeta · "Y puede obedecerla como si fuera tuya."
         20.0-24.8 diálogo "Esta acción envía datos de pago. ¿Confirmás?" · el cursor toca Cancelar · "Bloqueado. No se envió nada."
         25.0-30  "Lo que lee, lo puede obedecer." + "Que nunca pague ni envíe datos sin tu OK." (hold ≥ 3 s)
BANNED:  vacío oscuro con cosas chicas (el navegador ocupa 1500 px); glow, partículas; candados, calaveras o íconos de hacker; todo con fade + slide-up;
         etiquetas mono en mayúsculas; textos que se mueven mientras se leen.
QA:      0.5 (chat) · 7 (página normal) · 10.4 (escaneo a mitad) · 14 (texto revelado de cerca) · 18.5 (agente enviando) · 22.5 (diálogo + cursor) · 28 (regla)
