# Fase 7 · Etapa 0b: ancho responsivo e iconografía unificada

Contexto: el cliente revisó la galería en un **iPhone 13 (390 pt de ancho, iOS 27, Expo Go)**. Le encantó el resultado general, con dos hallazgos que deben corregirse ANTES de construir las pantallas (lotes 7.1+).

Lee `design-spec/README.md`, `app/ARCHITECTURE.md`, `app/docs/fidelity-components.md` y `prompts/fase-7-protocolo-pantallas.md`. Mismas reglas de siempre: prohibido tocar `design-spec/` y `prompts/`, no borrar nada de `app/assets/`, sin cambios de esquema, todo debe funcionar en Expo Go, nada de service_role.

## Hallazgo 1 (crítico): los elementos se salen del ancho de la pantalla
El Figma está dibujado a 402 pt de ancho y los componentes usaron anchos fijos de Figma (330 para tarjetas y campos, 300 para botones principales, 351 para el buscador…). En un iPhone de 390 pt (y en uno de 375 pt) esos elementos se desbordan por la derecha: los campos `PillInput`, el buscador `SearchField`, las filas/tarjetas y los botones aparecen más anchos que la pantalla; en la galería se cortan al borde.

### Qué hacer
1. **Regla:** el diseño de referencia es de 402 pt; la app debe verse bien desde **360 hasta 440 pt de ancho** (y en iPad, centrado con ancho máximo, sin romper). Los márgenes laterales son FIJOS (36 pt para tarjetas, campos y listas; 51 pt para los botones principales de bienvenida) y el contenido se ESTIRA al ancho disponible (`alignSelf: 'stretch'`/`width: '100%'` dentro de un contenedor con `paddingHorizontal`). **Prohibido** usar el ancho del Figma como `width` fijo en componentes de contenido. Los elementos que sí tienen tamaño intrínseco fijo (botones de vidrio 50×50, círculo del emoji 80, casilla OTP, tab bar 249×61 centrado) se mantienen, pero se centran/alinean sin desbordar. Las 6 casillas OTP deben repartirse el ancho disponible (con tope y mismo espaciado) y nunca desbordar.
2. **Auditoría completa:** revisa TODOS los componentes de `src/design-system/components/` y `primitives/` (Screen, Card, ListRow, SettingsRow/Group, PillInput, SearchField, PrimaryButton, GlassButton variantes de texto, Segmented, TabsUnderline, ProgressBar, LineChart, InfoNote, OtpInput, EmptyState, ScreenHeader, FloatingTabBar) y la galería. Cada uno debe usar medidas relativas con márgenes fijos. El `LineChart` calcula su ancho con `onLayout`. Los textos largos usan `numberOfLines`/`flexShrink` para no empujar los montos; los montos grandes usan `adjustsFontSizeToFit`.
3. **Helper:** crea `src/design-system/tokens/layout.ts`/`useScreenMetrics` con `contentWidth(screenWidth, margin)` y el margen estándar, y úsalo en un solo sitio por componente. Cubre con pruebas unitarias las funciones de medida en anchos 360, 375, 390, 402, 430 y 768.
4. **Galería con simulador de ancho:** añade a la galería un selector (Segmented) "Ancho: 360 · 375 · 390 · 402 · 430" que limite el ancho del contenedor de prueba para poder revisar todos los componentes a cada ancho desde el mismo teléfono. Quita el relleno doble que hace que las tarjetas de demostración se vean cortadas.
5. **Verificación visual indirecta:** como no puedes ver nada renderizado, genera `app/docs/responsive-check.md` con una tabla componente × ancho (360/375/390/402/430) y las medidas resultantes calculadas (ancho de contenido, márgenes, sobrante) para demostrar que no hay desbordamiento.

## Hallazgo 2: iconografía unificada con el estilo de los íconos de línea que agregaste
Al cliente le gustaron mucho los íconos de línea (Lucide) que añadiste al final de la galería: los encuentra "más Apple" que los que venían del Figma. Quiere:
- **Reemplazar los íconos SVG que venían del Figma por equivalentes de ese mismo estilo** donde corresponda, y poder usar más íconos de ese estilo.
- Los emojis de usuario NO cambian. El logo de marca NO cambia.

### Qué hacer
1. **Política:** un único sistema de íconos de línea (`lucide-react-native`, import por ícono, como ya haces), trazo coherente (2 pt a 24 px, mismo `strokeWidth` en toda la app; en campos de auth lo medido), esquinas redondeadas, tamaños consistentes por contexto (tab bar, fila de ajustes 20–24, campo 20, encabezado). Un solo componente `Icon` con prop `name`, `size`, `color` y `strokeWidth`.
2. **Mapa de reemplazo** (ajusta si encuentras uno mejor; documenta todo en `docs/fidelity-iconos.md`):
   - Menú de Ajustes: `person→user-round`, `mail→mail`, `key→key-round`, `wallet→wallet`, `limit→gauge`, `note→notebook-text` (o `tags`), `card→credit-card`, `goal→target`, `bell→bell`, `moon→moon`, `globe→globe`, `lock→lock`, `help→circle-help`.
   - UI: `search→search`, `filter→list-filter`, `plus→plus`, `chevron-back→chevron-left`, `chevron-row→chevron-right`, campana con punto → `bell-dot`, flecha de botón → `arrow-right`.
   - Menú Agregar (hoy 4 íconos de color): `piggy-bank` (verde `#69D95E`), `notebook-text` (azul), `credit-card` (amarillo, el tono medido), `target` (rojo). Mismo tono de color que el Figma, mismo círculo de fondo 50×50.
   - Tab bar: `wallet`, `chart-no-axes-column` y `layers`. El estado activo es negro y **relleno** cuando el glifo lo permita (`fill="currentColor"` solo en las formas cerradas) y trazo algo más firme; el inactivo gris `#C1C1C1`. Si el relleno se ve mal en alguno, usa el trazo firme y anótalo.
   - Pantallas de detalle: usa los que ya añadiste y completa lo que falte para las 36 pantallas (lista de necesidades: `book-open`, `circle-help`, `headphones`, `message-square`, `bug`, `info`, `shield-check`, `download`, `trash-2`, `file-text`, `file-lock-2`, `lock-keyhole`, `eye`, `eye-off`, `sun`, `moon`, `monitor`, `globe`, `check`, `banknote`, `bell`, `chart-column`, `sparkles`, `utensils`, `bus`, `popcorn`, `film`, `heart`, `house`, `graduation-cap`, `shopping-bag`, `ellipsis`, `badge-check`, etc.). Añade los que hagan falta.
3. **No borres** los SVG antiguos de `assets/icons/**` (el cliente los quiere conservar como respaldo), pero deja de usarlos en la app; retira `icons/generated.tsx` del uso (puede quedar como archivo sin importar o marcarse obsoleto en `ARCHITECTURE.md`). Nada debe importar íconos de `assets/icons/**` salvo el logo de marca.
4. **Galería:** actualiza la sección de íconos para mostrar el catálogo completo en uso, agrupado (tabs, ajustes, UI, agregar, detalle) y sus estados activo/inactivo.
5. **Tests:** prueba unitaria que garantice que todos los nombres usados en el mapa existen en lucide y que ninguna importación apunta a `assets/icons/**` salvo marca.

## Verificación
`npx tsc --noEmit`, `npm run lint`, `npx prettier --check .`, `npm run test:unit`, `npx expo-doctor`, `npx expo export` (iOS y Android, mock y supabase). Confirma que `design-spec/`, `prompts/` y `app/assets/` no cambiaron (los SVG viejos siguen en disco).

## Resumen final (formato exacto)
(a) archivos creados/modificados, (b) cómo quedó el modelo de ancho (márgenes fijos / contenido flexible) y la tabla de `responsive-check.md`, (c) mapa final de íconos viejos → nuevos, (d) problemas y cómo se resolvieron, (e) resultado de cada verificación, (f) desviaciones y dudas, (g) qué debe revisar el cliente en la galería (incluye usar el selector de ancho y mirar tab bar, ajustes y campos).
