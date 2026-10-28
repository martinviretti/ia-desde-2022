GOAL:    que alguien de 2022 entienda que un LLM escribe prediciendo la próxima palabra, una por vez, y que por eso puede inventar con seguridad.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps, silencioso (autoplay muteado en la web)
TIME:    38.5 s x 30 = 1155 frames. Escenas: teclado 0-6.5 · prediccion 6.5-30.5 · inventa 30.5-38.5
LOOK:    mundo 2022: fondo #f1f1ef, tinta #202124, UI #ffffff con borde #dadce0, sombra 0 18px 50px rgba(32,33,36,.16).
         mundo hoy: fondo #0e0e10 sólido (sin degradés lineales), tinta #ededee, gris #a0a0aa, paneles #16161a.
         acento #ff7a45: una palabra por línea, la barra elegida, el tachado. Nunca de decoración.
         display Geist 700, 76-88 px, tracking -3%; líneas secundarias Geist 600 40-64 px; datos Geist Mono 500 44-48 px.
         foto: biblioteca con duotono naranja horneado en el archivo (assets/img/library-duo.jpg).
OBJECTS: teclado de celular (campo de mensaje con cursor, franja de 3 sugerencias con divisores, 3 filas de teclas con letras);
         la respuesta como frase grande; panel de 5 candidatos (palabra en mono, barra proporcional, porcentaje);
         pared de texto (líneas de libros, webs y código en gris); la biblioteca real.
MOTION:  entrada expo.out 0.6 s · movimiento power2.inOut · salida power3.in 0.25 s · barras expo.out 0.6 s con stagger 0.05 s;
         títulos: por palabra blur 6px→0 en 0.13 s, 0.067 s entre palabras (y una variante gris→tinta); palabras de la respuesta: y 30→0 + blur 8→0 en 0.3 s.
SHOTS:   0.0-1.4  teclado lleno de frame con "Nos vemos|" y sugerencias · se lee el objeto
         1.4-2.0  se toca "mañana", entra al campo, las sugerencias cambian a "a · y · en" (vuelve a predecir)
         2.0-5.2  título "Tu teclado ya adivinaba la próxima palabra." (hold 3.2 s)
         5.0-6.3  inundación: un círculo oscuro se abre desde "mañana" y tapa todo
         6.8-9.7  "Un LLM hace lo mismo, a otra escala." (hold 2.6 s)
         9.9-16.5 pregunta "¿Por qué el cielo es azul?" · 3 pasos: candidatos con barras → se elige → la palabra entra a la frase
         16.6-19.0 el resto de la frase entra rápido, las barras laten
         19.2-22.6 "No busca la respuesta. Calcula la palabra que sigue." (hold 3.4 s)
         22.8-25.4 la frase se achica y se vuelve una línea entre una pared de texto
         25.4-30.5 la pared se disuelve en la biblioteca; "¿Cómo aprendió? Leyendo casi todo lo escrito." + "Libros, páginas web y código, en cantidades enormes."
         30.5-34.5 "¿Quién escribió «Las nueve lunas de Quilmes»?" · barras parejas · responde "Julio Cortázar en 1971" · tachado · "Ese libro no existe."
         34.8-38.5 "Predice lo probable, no lo verdadero." + "Por eso: verificá lo que importa." (hold ≥ 3 s)
BANNED:  vacío oscuro con cosas chicas flotando en el medio (el héroe ocupa ≥ 40% del cuadro); glow, partículas, orbes;
         degradés violetas o azules; cards de vidrio; todo centrado; todo entrando con fade + slide-up;
         títulos que se siguen moviendo después de aterrizar; etiquetas en mayúsculas mono; tres cards en fila;
         probabilidades presentadas como reales (van marcadas "ilustrativas").
QA:      0 (teclado legible, no vacío) · 3.5 (título entero) · 5.8 (inundación a mitad) · 12 (panel con barras y palabra elegida)
         · 20.5 (línea clave) · 24 (pared de texto) · 28 (biblioteca + título) · 33.5 (tachado) · 37 (cierre)
