# Verificación de ancho responsivo

Generado por `npm run responsive-check` (`scripts/responsive-check.ts`). No editar a mano.
Usa las mismas funciones puras que el layout (`design-system/tokens/metrics.ts`, cubiertas por `npm run test:unit`).

**Modelo:** márgenes laterales FIJOS (36 pt; 51 en los botones de bienvenida; 39 en el menú de Ajustes) y contenido FLEXIBLE:
`ancho de contenido = min(ancho de pantalla, 440) − 2 × margen`. En iPad (768) la app es una columna de 440 pt centrada.

## 1. Ancho que ocupa cada componente (pt) y sobrante

Cada celda: `ancho (sobra N)`. **Sobra 0** = ocupa exactamente el ancho disponible; un valor negativo sería un desborde.

| Componente | Regla | 360 | 375 | 390 | 402 | 430 | 768 |
|---|---|---|---|---|---|---|---|
| Contenido estándar (margen 36) | columna − 72 | 288 (sobra 0) | 303 (sobra 0) | 318 (sobra 0) | 330 (sobra 0) | 358 (sobra 0) | 368 (sobra 0) |
| Card / ListRow (alto 74) | se estira (stretch) | 288 (sobra 0) | 303 (sobra 0) | 318 (sobra 0) | 330 (sobra 0) | 358 (sobra 0) | 368 (sobra 0) |
| SettingsGroup (detalle) | se estira | 288 (sobra 0) | 303 (sobra 0) | 318 (sobra 0) | 330 (sobra 0) | 358 (sobra 0) | 368 (sobra 0) |
| SettingsGroup (menú, margen 39) | columna − 78 | 282 (sobra 0) | 297 (sobra 0) | 312 (sobra 0) | 324 (sobra 0) | 352 (sobra 0) | 362 (sobra 0) |
| PillInput (alto 60) | se estira | 288 (sobra 0) | 303 (sobra 0) | 318 (sobra 0) | 330 (sobra 0) | 358 (sobra 0) | 368 (sobra 0) |
| SearchField (alto 53) | se estira | 288 (sobra 0) | 303 (sobra 0) | 318 (sobra 0) | 330 (sobra 0) | 358 (sobra 0) | 368 (sobra 0) |
| PrimaryButton (alto 60) | se estira | 288 (sobra 0) | 303 (sobra 0) | 318 (sobra 0) | 330 (sobra 0) | 358 (sobra 0) | 368 (sobra 0) |
| PrimaryButton de bienvenida (margen 51) | columna − 102 | 258 (sobra 0) | 273 (sobra 0) | 288 (sobra 0) | 300 (sobra 0) | 328 (sobra 0) | 338 (sobra 0) |
| InfoNote | se estira | 288 (sobra 0) | 303 (sobra 0) | 318 (sobra 0) | 330 (sobra 0) | 358 (sobra 0) | 368 (sobra 0) |
| ProgressBar | se estira | 288 (sobra 0) | 303 (sobra 0) | 318 (sobra 0) | 330 (sobra 0) | 358 (sobra 0) | 368 (sobra 0) |
| Segmented (máx. 252,5) | min(contenido, 252,5) | 252.5 (sobra 35.5) | 252.5 (sobra 50.5) | 252.5 (sobra 65.5) | 252.5 (sobra 77.5) | 252.5 (sobra 105.5) | 252.5 (sobra 115.5) |
| TabsUnderline (2 × 115) | fijo, centrado | 230 (sobra 58) | 230 (sobra 73) | 230 (sobra 88) | 230 (sobra 100) | 230 (sobra 128) | 230 (sobra 138) |
| LineChart (ancho por onLayout) | se estira | 288 (sobra 0) | 303 (sobra 0) | 318 (sobra 0) | 330 (sobra 0) | 358 (sobra 0) | 368 (sobra 0) |
| OtpInput (bloque, margen +6) | contenido − 12 | 276 (sobra 12) | 291 (sobra 12) | 306 (sobra 12) | 318 (sobra 12) | 346 (sobra 12) | 356 (sobra 12) |
| EmptyState (texto máx. 266) | min(contenido, 266) | 266 (sobra 22) | 266 (sobra 37) | 266 (sobra 52) | 266 (sobra 64) | 266 (sobra 92) | 266 (sobra 102) |
| FloatingTabBar (249, centrada) | fijo, centrado en la pantalla | 249 (sobra 111) | 249 (sobra 126) | 249 (sobra 141) | 249 (sobra 153) | 249 (sobra 181) | 249 (sobra 191) |

## 2. Medidas derivadas

| Medida | 360 | 375 | 390 | 402 | 430 | 768 |
|---|---|---|---|---|---|---|
| Ancho de la columna de la app | 360 | 375 | 390 | 402 | 430 | 440 |
| Casilla OTP (6 + 5 espacios de 5,4) | 41.5 | 44 | 46.5 | 48.5 | 53.2 | 54.8 |
| Margen izquierdo del tab bar (249 centrado) | 55.5 | 63 | 70.5 | 76.5 | 90.5 | 259.5 |
| Espacio de texto en una fila (junto a emoji y monto) | 117 | 132 | 147 | 159 | 187 | 197 |
| Paso entre días en la gráfica (7 puntos, 22 pt de relleno) | 40.7 | 43.2 | 45.7 | 47.7 | 52.3 | 54 |
| Botones de vidrio en una fila (3 × 50 + 2 espacios de 12) | 174 | 174 | 174 | 174 | 174 | 174 (cabe en todos) |

## 3. Comparación con el problema original (ancho fijo del Figma)

Antes los componentes usaban `width: 330` (tarjetas, campos), `351` (buscador) y `300` (botones): a menos de 402 pt se salían.

| Ancho fijo antiguo | 360 | 375 | 390 | 402 | 430 | 768 |
|---|---|---|---|---|---|---|
| 330 pt | **se desborda 42** | **se desborda 27** | **se desborda 12** | sobra 0 | sobra 28 | sobra 38 |
| 351 pt | **se desborda 63** | **se desborda 48** | **se desborda 33** | **se desborda 21** | sobra 7 | sobra 17 |
| 300 pt | **se desborda 42** | **se desborda 27** | **se desborda 12** | sobra 0 | sobra 28 | sobra 38 |

**Resultado:** ningún componente se desborda en ningún ancho (360 → 768).
