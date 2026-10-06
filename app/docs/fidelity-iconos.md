# Iconografía unificada (Fase 7 · Etapa 0b)

Generado por `npm run docs:icons` (`scripts/build-icon-docs.ts`) desde `icons/iconTokens.ts` y `icons/lucide.tsx`. No editar a mano.

## Política
- **Un solo sistema de íconos de línea:** `lucide-react-native`, importado ícono por ícono (`lucide-react-native/icons/<nombre>`), para que el bundle incluya solo los usados.
- **Un solo componente:** `<Icon name size color strokeWidth />` (`primitives/Icon.tsx`). El nombre es del catálogo (`icons/lucide.tsx`) y está tipado.
- **Trazo coherente:** ABSOLUTO, 2 pt en toda la app (así lo dibuja el Figma, a cualquier tamaño); 2.5 pt en campos de auth y botones de vidrio (medido); 3.333 pt en íconos grandes. Puntas y esquinas redondeadas (propias de Lucide).
- **Los emojis de usuario NO cambian** (texto del sistema) y **el logo de marca NO cambia**.
- **Los SVG antiguos de `assets/icons/**` siguen en disco como respaldo, pero la app ya no los importa** (lo verifica una prueba unitaria). `icons/generated.tsx` y `scripts/build-icons.ts` quedan OBSOLETOS (sin importar).
- La carita del disparador de emoji (`SmileGlyph`) conserva los trazos exactos del Figma (es del mismo estilo de línea).

## Tamaños por contexto
| Contexto | Tamaño (pt) |
|---|---|
| tab | 28 |
| settingsRow | 20 |
| field | 20 |
| glass | 22 |
| header | 24 |
| trailing | 16 |
| arrow | 18 |
| addMenu | 24 |
| empty | 40 |

## Mapa de reemplazo: SVG del Figma → Lucide
| Ícono antiguo | Ícono actual |
|---|---|
| `settings/person` | `user-round` |
| `settings/mail` | `mail` |
| `settings/key` | `key-round` |
| `settings/wallet` | `wallet` |
| `settings/limit` | `gauge` |
| `settings/note` | `notebook-text` |
| `settings/card` | `credit-card` |
| `settings/goal` | `target` |
| `settings/bell` | `bell` |
| `settings/moon` | `moon` |
| `settings/globe` | `globe` |
| `settings/lock` | `lock` |
| `settings/help` | `circle-help` |
| `ui/search` | `search` |
| `ui/filter` | `list-filter` |
| `ui/plus` | `plus` |
| `ui/plus-gray` | `plus` |
| `ui/chevron-back` | `chevron-left` |
| `ui/chevron-row` | `chevron-right` |
| `ui/arrow-button (Figma: vector de 15×14)` | `arrow-right` |
| `notificaciones (campana con punto)` | `bell-dot` |
| `add/piggy-green` | `piggy-bank` |
| `add/note-blue` | `notebook-text` |
| `add/card-yellow` | `credit-card` |
| `add/goal-red` | `target` |
| `tabs/wallet` | `wallet` |
| `tabs/bars` | `chart-no-axes-column-increasing` |
| `tabs/layers` | `layers` |

### Menú Agregar (de color)
Mismos tonos que el Figma dentro del círculo de 50×50 (`IconCircle`): `piggy-bank` **#69D95E**, `notebook-text` **#1261FF**, `credit-card` **#D0C63F**, `target` **#FF0303** (medidos en los SVG originales).

### Barra de pestañas
- Inactiva: línea gris `#C1C1C1`, trazo 2 pt. Activa: negro y más firme.
- **Cartera** y **capas**: la forma cerrada va RELLENA en negro (la cartera con el cierre en punto blanco, como el ícono activo del Figma); las bandas inferiores de las capas, con trazo firme.
- **Actividad**: tres barras con trazo grueso redondeado (3,25 pt) — Lucide solo trae contorno, y a ese grosor leen como barras sólidas.
- **Desviación:** para Actividad se usa `chart-no-axes-column-increasing` (barras ascendentes, como el glifo del Figma) en lugar de `chart-no-axes-column` (la del medio más alta).
- Aviso: las siluetas rellenas están construidas con los mismos trazos de Lucide, pero **no pude verlas renderizadas** (sin simulador): el cliente debe confirmarlas en la galería.

## Alias de nombre en Lucide v1 (archivo ≠ nombre usado en el Figma)
- `circle-help` → `lucide-react-native/icons/circle-question-mark`
- `file-lock-2` → `lucide-react-native/icons/file-lock`
- `trash-2` → `lucide-react-native/icons/trash`

## Catálogo en uso (61 íconos)
`arrow-right` · `badge-check` · `banknote` · `bell` · `bell-dot` · `book-open` · `bug` · `bus` · `calendar` · `chart-column` · `chart-no-axes-column` · `chart-no-axes-column-increasing` · `check` · `chevron-left` · `chevron-right` · `circle-help` · `cloud` · `credit-card` · `download` · `ellipsis` · `eye` · `eye-off` · `file-lock-2` · `file-text` · `film` · `gauge` · `globe` · `graduation-cap` · `headphones` · `heart` · `house` · `info` · `key-round` · `layers` · `list-filter` · `lock` · `lock-keyhole` · `mail` · `message-square` · `message-square-text` · `monitor` · `moon` · `notebook-text` · `pencil` · `piggy-bank` · `play` · `plus` · `popcorn` · `search` · `shield-check` · `shopping-bag` · `sparkles` · `sun` · `tags` · `target` · `trash-2` · `user` · `user-round` · `utensils` · `wallet` · `x`
