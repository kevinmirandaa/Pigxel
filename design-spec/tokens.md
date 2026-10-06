# Pigxel: tokens extraídos del Figma (solo lectura)

Fuente: archivo Figma `Pigxel` (fileKey `p2fQoITKvEWtet3H73rrBg`). Frame base: 402×874 (iPhone 17 Pro).
Valores leídos con `get_design_context` en: cuentas, actividad, agregar, ajustes, bienvenida. Los demás frames siguen el mismo sistema; verificar contra su PNG.

## Colores
| Token | Valor | Uso |
|---|---|---|
| `bg` | `#F4F4F4` | fondo de pantallas (bienvenida usa blanco + imagen) |
| `card` | `#FFFFFF` | tarjetas, borde `#EAEAEA` 1 px |
| `textPrimary` | `#000000` | títulos, montos |
| `textSecondary` | `#8F8F8F` | subtítulos, "Saldo total", pestañas inactivas |
| `segmentBg` | `#F0F0F0` | control segmentado (borde `#EAEAEA`) |
| `searchBg` | `#EBEBEB` | buscador (borde `#EAEAEA`) |
| `expense` | `#FF0000` ("red") | SOLO montos de gasto e íconos de categoría |
| `income` | `#65CA60` | SOLO montos de ingreso e íconos de categoría |
| `buttonPrimary` | `#000000` | botón negro, texto blanco |
| `titleMuted1` / `titleMuted2` | `#5E5E5F` / `#AFAFAF` | segunda y tercera parte del título de bienvenida |

Regla confirmada por el cliente: rojo y verde solo en números (ingresos/gastos) y en íconos de categoría. El resto es monocromático.

## Tipografía: SF Pro Rounded
Pesos: Bold, Semibold, Regular. Si no carga en iOS o en Android → Nunito.
| Uso | Tamaño | Peso |
|---|---|---|
| Saldo total (cuentas) | 64 | Bold |
| Monto grande (actividad) | 40 | Bold |
| Título de pantalla ("Pigxel", "Ajustes", "Actividad", "Agregar") | 32 | Bold |
| Título de sección (Cuenta, Finanzas, App) / fila de Agregar | 20 | Bold |
| Título de fila, "Recientes", "Cuentas" | 18 | Bold |
| Fila de ajustes | 16 | Bold |
| Subtítulo de fila | 14 | Regular |
| Etiquetas del control segmentado | 13 | Semibold |
| Bienvenida: título | 40 | Bold |
| Bienvenida: botones | 20 | Semibold |

## Forma y espaciado
- Margen lateral de tarjetas: 36 (ajustes: 39). Tarjeta de fila: 330×74, radio **20**.
- Píldoras: radio **50** (botón negro 300×60, segmentado 253×48, búsqueda 351×53).
- Ícono en fila: contenedor 50×50 (ajustes y agregar), emoji de categoría 35×35.
- Separador de filas en ajustes: línea de 268 px desde x=99.
- Grupos de ajustes: tarjeta 328 de ancho; filas cada 67 px.

## Moneda
Símbolo `¢` (colón costarricense). Separador de miles con punto, sin decimales: `¢ 830.000` (con espacio en el saldo grande) y `¢20.000` (sin espacio en filas). Gastos: `-¢18.000` en rojo. Ingresos: `+¢718.000` en verde.

## Componentes
- **Button – Liquid Glass – Symbol** (iOS/iPadOS 27): atrás, "+", campana, filtro. Estilo Glass, modo Light.
- **Button – Liquid Glass – Text**: píldoras de Ingreso / Gasto / Consulta y piezas del tab bar.
- **Tab bar flotante**: píldora de vidrio 249×61 con 3 pestañas (wallet, bars, layers). La pestaña activa es una píldora de vidrio 85×61 con ícono negro; las inactivas en gris.
- **Gráfica de línea** (actividad): en Figma es un PNG (`reference/chart-placeholder.png`). Reconstruir como vector con tooltip (`¢18,500` sobre "Vie"), eje Lun–Dom.
