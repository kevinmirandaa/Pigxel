# Fidelidad de componentes (Fase 7 · Etapa 0)

Cada fila: qué dice el Figma, qué quedó implementado y de dónde sale el dato.
Fuentes: **XML** = `design-spec/figma-metadata.xml` · **Muestreo** = `design-spec/screens/*.png` a 3x (`npm run measure` → `docs/measurements.md`) ·
**Captura real** = `design-spec/reference/tab-cuentas-composed-reference.png` y `app-screens/*.png` · **Código** = `get_design_context` leído en la Fase 2 · **SVG** = `design-spec/source/Pigxel.svg`.
Los tokens están cubiertos por tests (`npm run test:unit`: "tokens ↔ muestreo del Figma"): si un token se aparta del muestreo, el test falla.

> **Etapa 0b — anchos e íconos.** Las medidas de ancho de esta tabla (330, 300, 351, 252,5…) son las del Figma a **402 pt**: son **referencia**, no `width`.
> En la app el contenido es flexible (márgenes fijos de 36 pt y contenido estirado; ver `docs/responsive-check.md`). Todos los íconos son Lucide con un único `<Icon>`
> (ver `docs/fidelity-iconos.md`); donde esta tabla dice "SVG", la app usa ahora el equivalente Lucide. La barra de pestañas va a **17 pt** del borde inferior (protocolo de pantallas).

Todas las posiciones `y` del Figma (botón atrás en 20, título en 98…) se miden **desde el borde superior del área segura**; ver duda 1 en el resumen.

## Superficies, tarjetas y filas

| Componente                       | Medida / color en el Figma                                                                                                                                                      | Valor implementado                                                              | Fuente                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Screen** (fondo)               | `#F4F4F4` (tabs, Agregar, detalle) · **blanco** en auth y 404                                                                                                                   | `background: 'page' \| 'auth'` → `colors.bg` / `colors.authBg`                  | Muestreo (`screen.auth.bg`)                                                                             |
| **Screen** (final de scroll)     | tab bar a 17 pt del borde (protocolo; el Figma dibuja 15), 61 de alto                                                                                                           | `tabBar` → `layout.tabBarClearance = 92`                                        | XML (barra @ y=798 en 874)                                                                              |
| **Card**                         | relleno `#FFF`, radio 20, trazo `#EAEAEA` 1 pt **fuera** del relleno (330×74)                                                                                                   | relleno 330×74 + capa de borde exterior (`top/left/right/bottom: -1`)           | Muestreo (escaneo de borde), Código (rounded-[20px])                                                    |
| **ListRow**                      | emoji 35; título 18 Bold; subtítulo 14 Regular `#8F8F8F`; monto 18 Bold; rojo `#FF0000`/verde `#65CA60`/azul `#007FFF` solo en montos                                           | igual; `inset` 18 (16 en Actividad) y `gap` 14 (18 en cuentas, 13 en Actividad) | XML (posiciones), Muestreo, Código                                                                      |
| **SectionTitle**                 | "Cuenta/Finanzas/App" 20 Bold · "Recientes/Suscripciones" 18 Bold · "Hoy/Ayer" 14 Semibold gris                                                                                 | `large` 20 · `medium` 18 · `small` 14                                           | Código, Muestreo (`sectionLabel.size` 13,8)                                                             |
| **SettingsRow** (detalle)        | fila 67 (+1 de divisor = pitch 68); caja de ícono 44 `#F4F4F4` a x=12; texto a x=68; etiqueta 16 Bold (alto 19); detalle 12 gris (alto 16); chevron 14 `#C1C1C1` a 12 del borde | igual                                                                           | XML, Muestreo (`detail.row.label.size` 16,1 · `detail.row.detail.size` 12,0 · `rowIcon.fill` `#F4F4F4`) |
| **SettingsRow** (menú principal) | caja de ícono 50 `#F5F5F5` a x=8; texto 16 Bold; tarjeta 328 con margen 39                                                                                                      | `menuIcon` + `SettingsGroup width={328}`                                        | XML, Muestreo                                                                                           |
| **SettingsGroup**                | divisor `#EAEAEA` de 1 pt: empieza en x=60 (con ícono) o x=20 (sin ícono)                                                                                                       | `dividerInset: 'icon' \| 'noIcon' \| número`                                    | XML (Divisor 270×1 @96 y 310×1 @56)                                                                     |
| **Toggle**                       | 50×30, perilla 26 (inset 2); on `#34C759`; off `#E9E9EB`; perilla `#FFF`                                                                                                        | igual, animado                                                                  | XML, Muestreo                                                                                           |
| **ProgressBar**                  | pista 290×6 `#E9E9EB`; avance `#007FFF`; extremos redondos                                                                                                                      | `height 6`, radio 3                                                             | XML (Barra/Avance), Muestreo                                                                            |
| **InfoNote**                     | 330×89 (3 líneas), radio 20, fondo `#EAF8EE`, ícono info 18 y texto 14 `#308548`; sin borde                                                                                     | igual; padding 16, texto a x=44                                                 | XML, Muestreo (`infoNote.*`)                                                                            |
| **EmptyState**                   | ícono ≈41 `#C1C1C1` (trazo 3,33 pt); título 18 Bold; detalle 14 `#C1C1C1`; bloque de texto 266; 29 pt ícono→título                                                              | igual                                                                           | XML (notificaciones), Muestreo, SVG (trazo)                                                             |

## Controles y campos

| Componente                                 | Medida / color en el Figma                                                                                                                  | Valor implementado                                      | Fuente                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| **PillInput** (formulario)                 | 330×60, radio 30, relleno blanco, trazo `#EAEAEA` exterior; texto a x=23; placeholder 16 `#C1C1C1`                                          | igual                                                   | XML, Muestreo (`field.form.*`, `field.placeholder.size` 15,7) |
| **PillInput** (auth)                       | igual, relleno `#F0F0F0` sobre fondo blanco; ícono 20 `#C1C1C1` a x=24 (trazo 2,5 pt), texto a x=53; ojo a x=284                            | `variant="auth"`, `leftIcon`, `secureTextEntry`         | XML, Muestreo (`field.auth.fill`), SVG (trazo 2,5)            |
| **PillInput** (error)                      | **no existe en el Figma**                                                                                                                   | borde y texto `#FF0000` + mensaje 13                    | Decisión propia (duda 5)                                      |
| **SearchField**                            | 351×53, relleno `#EBEBEB`, lupa 22 `#5E5E5F`                                                                                                | igual (`placeholder` "Buscar" `#5E5E5F`)                | XML, Muestreo, SVG (`ui/search`)                              |
| **PrimaryButton**                          | 330×60, radio 30, negro; texto 20 Semibold blanco centrado; flecha 15×14,2 trazo 2,5 a 22 pt del borde derecho                              | igual; `variant="glass"` para "Iniciar sesión" (300×60) | XML, Muestreo (`primaryButton.*`), SVG (flecha)               |
| **PrimaryButton** (cargando/deshabilitado) | **no existen en el Figma**                                                                                                                  | spinner blanco en lugar de la flecha · opacidad 0,4     | Decisión propia (duda 5)                                      |
| **Segmented**                              | contenedor 252,5×48 `#F0F0F0` (trazo `#EAEAEA` exterior); activa blanca 44 de alto (opción + 3); etiquetas 13 Semibold, inactivas `#8F8F8F` | igual, cápsula animada, 2 o 3 opciones                  | XML (Rectangle 17/18/19/20), Muestreo                         |
| **TabsUnderline**                          | etiquetas 115 de ancho, 18 Bold; subrayado negro 50×4 (48 visibles) a 12,8 pt bajo el centro del texto                                      | igual, animado                                          | XML, Muestreo (grosor 4,0)                                    |
| **OtpInput**                               | 6 casillas 49×77 (paso 54,2), relleno `#EAEAEA`, radio ≈15; bloque x=42→359; cursor negro                                                   | `layout.otp` (317 de ancho, gap 5,4)                    | Muestreo (escaneo de fila), XML                               |

## Vidrio, navegación, gráfica y emoji

| Componente                  | Medida / color en el Figma                                                                                                                                                      | Valor implementado                                                                           | Fuente                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **GlassButton** (símbolo)   | círculo 50×50 en (20,20) / (325,20) / (325,40); la campana y el "+" se solapan 8 pt (x=283 y 325)                                                                               | `size=50`; `HeaderActions` con `gap: -8`                                                     | XML, `overlays.md`                                           |
| **GlassButton** (texto)     | píldoras de alto 50 y ancho 107 / 93 / 120                                                                                                                                      | alto 50, `paddingHorizontal 26`, texto 18 Bold                                               | XML, `overlays.md`                                           |
| **GlassSurface** (iOS 26+)  | Liquid Glass del sistema                                                                                                                                                        | `expo-glass-effect` (`GlassView`) si `isLiquidGlassAvailable()`                              | —                                                            |
| **GlassSurface** (respaldo) | perfil vertical: borde exterior `#EEE`, resalte `#F7F7F7`, sombra interior `#EBEBEB` a ≈15 % de la altura, aclara hacia abajo hasta brillo blanco; sombra suave                 | degradado con alfa blanco/negro (`tokens/shadows.ts`), borde `rgba(0,0,0,.035)`, `boxShadow` | Captura real (perfiles verticales en `measurements.md`)      |
| **FloatingTabBar**          | barra 249×61 a x=76 (centrada), 17 pt sobre el borde inferior; activa 85×61; íconos wallet 25×23 / bars 22,5 / layers 25 centrados cada 82 pt; activo negro, inactivo `#C1C1C1` | igual; íconos del mismo SVG recoloreado                                                      | XML, Muestreo, Captura real                                  |
| **ScreenHeader** (detalle)  | atrás en (20,20); título 32 Bold (alto 35) en x=36, y=98                                                                                                                        | igual                                                                                        | XML (Título 330×35 @ 36,98)                                  |
| **ScreenHeader** (tab)      | título 32 en (39,45); botones en y=40 a 27 del borde derecho                                                                                                                    | igual                                                                                        | XML                                                          |
| **LineChart**               | imagen 312×124 en (45,238); curva negra 2 pt; área con degradado; guía punteada, punto negro y tooltip `#262626` sobre el día; ejes Lun–Dom (activo negro)                      | vector SVG; curva cúbica monótona; tooltip `¢18.500` (el Figma usa coma: duda 8)             | XML, Muestreo (`chart.*`), `reference/chart-placeholder.png` |
| **EmojiPickerButton**       | círculo 80×80 blanco, trazo `#EAEAEA`; carita Lucide `smile` 33,3 `#C1C1C1`, trazo 3,333 pt                                                                                     | igual                                                                                        | XML, Muestreo, SVG (paths de la carita)                      |
| **EmojiBadge**              | emoji 35×35 en filas; 50 en menús                                                                                                                                               | `size`                                                                                       | XML                                                          |
| **Íconos**                  | tabs/ui/ajustes: 25 SVG monocromos (`#C1C1C1` o negro) · detalle/auth: Lucide con trazo absoluto 2 pt (2,5 en campos de auth)                                                   | `Icon` (color por prop, un solo SVG) y `LucideIcon`                                          | SVG (stroke-width), `assets/icons/**`                        |

## Tipografía (tamaños muestreados vs. implementados)

SF Pro Rounded (`ui-rounded`) en iOS · Nunito en Android. Tamaño medido = altura de mayúscula ÷ 0,724 (calibrada con títulos de 32 pt).

| Uso                                              | Medido      | Implementado                                       |
| ------------------------------------------------ | ----------- | -------------------------------------------------- |
| Título de detalle (Moneda, Límite)               | 32,2 / 31,8 | 32 Bold, alto de línea 35                          |
| Título/subtítulo de auth                         | 40,1 / 20,3 | 40 Bold (líneas de 48) / 20 Regular (líneas de 24) |
| Texto del botón negro                            | 20,3        | 20 Semibold                                        |
| Placeholder de campo                             | 15,7        | 16 Regular                                         |
| Etiqueta de fila (detalle) / detalle             | 16,1 / 12,0 | 16 Bold (19) / 12 Regular (16)                     |
| Descripción bajo el ícono, aviso, etiqueta "Hoy" | 13,8        | 14 Regular (19)                                    |
| Etiqueta de campo de información / valor         | 12,9 / 16,6 | 13 Regular (16) / 16 Semibold (19)                 |
| Etiquetas del segmentado                         | 13,4        | 13 Semibold                                        |
| Estado vacío: título / detalle                   | 18,4 / 13,8 | 18 Bold / 14 Regular                               |
| Porcentaje y etiquetas de objetivo               | 12,0        | 12 Regular                                         |

Los **pesos** (Bold/Semibold/Regular) no salen del XML ni de las medidas; se estimaron mirando las capturas (ver dudas).

## Componentes añadidos en el lote 7.1 (autenticación)

| Componente                    | Qué es                                                                                              | Medidas / fuente                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **AuthHeader**                | botón atrás de vidrio + título 40 Bold (líneas de 48) + subtítulo 20 gris (líneas de 24), margen 36 | XML (títulos en (42, 95)) normalizados a x=36; `docs/fidelity-auth.md` |
| **InlineMessage**             | mensaje breve bajo campo/botón: `error` rojo o `success` verde (`#308548`), 14 centrado             | estado no definido en el Figma; estilo del design-system               |
| **FooterLink**                | texto 16 centrado con acción en negrita ("¿No tienes cuenta? **Crear cuenta**"), área táctil ≥ 44   | XML (290×19)                                                           |
| **TextLink**                  | enlace 14 con `hitSlop` ampliado ("Olvidé mi contraseña")                                           | XML (caja 290×17)                                                      |
| **SplashLogo** (feature auth) | logo 160×160 centrado sobre blanco                                                                  | XML (nodo 1:3)                                                         |

## Lote 7.2

- **GoalRow**: tarjeta de objetivo (74 de alto): emoji, nombre y "Objetivo:" a la izquierda; ahorro (negro) y meta (azul `#007FFF`) a la derecha.
- **SelectionSheet**: hoja inferior de selección única (título, opciones con emoji, ✓ en la elegida), columna máx. 440.
- **EmptyState**: `actionLabel` / `onAction` (botón de texto, alto mínimo 44).
- **GlassButton**: `badge` (punto negro, variante ícono) y `fill` (flex:1, variante texto).
- **HeaderActions**: gap 10 (o solape −8 con `overlap`).
- **Screen**: prop `refreshControl`.
- **LineChart**: admite valores negativos (línea de cero).

## Lote 7.3

- **SelectorRow**: píldora blanca 60 con etiqueta, elección (emoji + nombre) y chevron; error opcional. Abre una `SelectionSheet`.
- **AddMenuRow**: fila del menú Agregar; cuerpo → lista, "+" (56 pt) → formulario.
- **SelectionSheet**: ahora admite `detail` (saldo de la cuenta) por opción.
- **core/forms**: `FormScreen` (esqueleto + botón + error), `FormField`, `MoneyField` (¢ y miles en vivo), `EmojiField`, `zodFormResolver`, `useFinishForm` (háptico de éxito + `dismissTo('/(tabs)')`).

## Lote 7.4

- **DetailIntro**: caja de ícono 56 + título + descripción centrados.
- **CardField**: fila "etiqueta pequeña + valor" (tocable) o con campo de texto; admite error, elemento a la derecha y estado atenuado.
- **FormSheet**: hoja inferior con teclado para editar un valor.
- **SubscriptionCard / GoalCard** (`DetailCards`): tarjetas de Ajustes · Suscripciones y Objetivos.
- **SettingsRow**: nueva prop `emoji` (emoji del usuario dentro de la caja 44).

## Lote 7.5

- **InfoSheet**: hoja informativa con scroll (máx. 55 % del alto) y botón Cerrar, sobre `FormSheet`.
