# design-spec: referencia de diseño de Pigxel

Material de solo lectura extraído del Figma `Pigxel` (https://www.figma.com/design/p2fQoITKvEWtet3H73rrBg/Pigxel). No contiene código de la app. El Figma MCP del cliente está limitado (plan Starter): **esta carpeta es la fuente de verdad para construir**.

## Contenido
| Ruta | Qué es |
|---|---|
| `app-screens/*.png` | **Las 36 pantallas, capturadas por el cliente directamente desde Figma**, con el Liquid Glass real. **Referencia visual definitiva** (vidrio, sombras, colores, aspecto). Baja resolución (~320 px de ancho) y con una franja oscura arriba con el nombre del frame de Figma: ignorarla y no usar estas capturas para medir |
| `screens/*.png` | Las mismas 36 pantallas renderizadas desde el SVG a 3x (1206 px de ancho). **Referencia geométrica** (medidas, posiciones, textos), pero el vidrio sale gris opaco |
| `source/Pigxel.svg` | Exportación vectorial de toda la página de Figma (texto convertido a trazos, 13 imágenes incrustadas). Sirve para extraer íconos y medidas exactas |
| `figma-metadata.xml` | Árbol de los 36 frames: ids, nombres, posiciones, tamaños y textos |
| `tokens.md` | Colores, tipografía, radios, espaciados, moneda |
| `overlays.md` | Componentes sueltos del lienzo que van encima de cada pantalla, con coordenadas relativas |
| `reference/tab-cuentas-composed-reference.png` | **Captura real de Figma** de la pantalla Cuentas compuesta: es la referencia del aspecto Liquid Glass |
| `reference/chart-placeholder.png` | Imagen de la gráfica de Actividad (en Figma es un PNG; reconstruir como vector) |

## Cómo leer las capturas (importante)
- **Regla:** para cada pantalla, mirar primero `app-screens/<nombre>.png` (aspecto real) y luego `screens/<nombre>.png` (medidas exactas). Ambas carpetas usan los mismos nombres.
- Las de `screens/` se renderizaron desde el SVG, que no reproduce el **Liquid Glass**: los botones de vidrio (atrás, campana, +, tab bar, píldoras) salen como círculos/píldoras **grises opacos**. En la app real son vidrio translúcido claro, como se ve en `app-screens/`.
- Las **etiquetas de las píldoras** Ingreso / Gasto / Consulta salen vacías en `screens/tab-cuentas*.png`; sus textos son exactamente `Ingreso`, `Gasto`, `Consulta` (visibles en `app-screens/`).
- La campana lleva un punto de notificación en la esquina superior derecha del ícono.
- Splash (`auth-splash`): logo pixelado centrado sobre fondo blanco.

## Pantallas (36) y su archivo
Figma ids entre paréntesis.

**Entrada:** `auth-splash` (1:3) · `auth-bienvenida` (7:201) · `auth-crear-cuenta` (7:205) · `auth-iniciar-sesion` (9:195) · `auth-recuperar-contrasena` (9:448) · `auth-codigo-verificacion` (9:479) · `auth-nueva-contrasena` (9:513) · `error-404` (9:539)
**Tabs:** `tab-cuentas` (14:40) · `tab-cuentas-objetivos` (26:508) · `tab-actividad` (23:420) · `tab-ajustes` (35:114)
**Agregar:** `add-menu` (38:395) · `add-lista-cuentas` (41:853) · `add-lista-categorias` (41:922) · `add-cuenta` (38:571) · `add-categoria` (38:686) · `add-suscripcion` (38:714) · `add-objetivo` (38:763) · `add-ingreso` (41:828) · `add-gasto` (41:976)
**Otras:** `consultar` (2008:1788) · `notificaciones` (2008:1835)
**Ajustes (detalle):** `ajustes-informacion-personal` (2004:11625) · `ajustes-correo` (2004:11710) · `ajustes-contrasena` (2004:11803) · `ajustes-moneda` (2004:11903) · `ajustes-limite` (2004:11995) · `ajustes-categorias` (2004:12085) · `ajustes-suscripciones` (2004:12227) · `ajustes-objetivos` (2004:12342) · `ajustes-notificaciones` (2004:12444) · `ajustes-apariencia` (2004:12559) · `ajustes-idioma` (2004:12654) · `ajustes-privacidad` (2004:12749) · `ajustes-ayuda` (2004:12859)

## Navegación confirmada
- Cuentas / Cuentas·Objetivos: botón **campana** → Notificaciones; botón **+** → **Agregar** (Cuenta, Categoría, Suscripción, Objetivo).
- Fila de píldoras: **Ingreso** → Agregar ingreso · **Gasto** → Agregar gasto · **Consulta** → Consultar (simulador).
- Tab bar flotante: Cuentas ⇄ Actividad ⇄ Ajustes. Ajustes → 13 pantallas de detalle.
- Onboarding = solo la pantalla Bienvenida (Crear cuenta / Iniciar sesión).
- Login y registro solo con email + contraseña (sin Apple/Google).

## Regla de fidelidad para quien implemente
Cada pantalla debe replicar su PNG y su entrada en `figma-metadata.xml` al píxel: mismos textos, orden, tamaños, radios y colores de `tokens.md`. No inventar, reordenar ni "mejorar" elementos. Las diferencias menores del Figma (p. ej. "Categorias" sin tilde en Ajustes, espacio inicial en " Suscripciones", "Nueva  suscripción" con doble espacio) se replican tal cual hasta que el cliente indique lo contrario.
