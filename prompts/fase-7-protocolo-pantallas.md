# Fase 7 · Protocolo común para construir pantallas

Este documento aplica a TODOS los lotes 7.1–7.5. Cada prompt de lote lo referencia. Léelo completo antes de empezar un lote, junto con `app/ARCHITECTURE.md`, `app/docs/fidelity-components.md`, `app/docs/measurements.md` y `design-spec/README.md`.

## Reglas generales
- Prohibido modificar `design-spec/` y `prompts/`, y borrar nada de `app/assets/`. No cambies el esquema de la base. Nunca service_role.
- **Fidelidad primero.** Cada pantalla replica su captura real `design-spec/app-screens/<nombre>.png` (aspecto) y sus medidas de `design-spec/screens/<nombre>.png` y `design-spec/figma-metadata.xml` (posiciones, tamaños). No inventes elementos, no reordenes, no "mejores".
- **Criterio de diseño (decisión del cliente, prevalece sobre cualquier regla anterior de "replicar inconsistencias"):** el Figma es la base, pero el cliente reconoce que puede tener pequeños errores de margen o detalle y pide un resultado **minimalista y con jerarquía visual al estilo Apple** (HIG). Por tanto: conserva SIEMPRE los elementos, textos, orden, colores, tipografía y la intención de cada pantalla; pero **normaliza** las inconsistencias menores de medidas a un sistema coherente basado en una cuadrícula de 4/8 pt: un solo margen lateral de pantalla (36 pt, el valor dominante en las tarjetas), títulos de pantalla alineados al mismo margen, un solo inset y gap por tipo de fila, espacios verticales consistentes entre secciones, alineaciones al margen de las tarjetas. Cuando la medida del Figma sea una variación evidente de un valor dominante (±1–12 pt), usa el valor dominante. Cuando veas algo que visualmente se vea mal (texto pegado, desbalance, desalineación, contraste pobre), corrígelo con criterio Apple. **Cada normalización o corrección se anota** en `docs/fidelity-<lote>.md` (valor Figma → valor aplicado → motivo), para que el cliente pueda revertirla. Corrige también erratas de texto evidentes ("Categorias" → "Categorías", " Suscripciones" → "Suscripciones", "Nueva  suscripción" → "Nueva suscripción", "Iniciar Sesión" → "Iniciar sesión" en minúscula como el resto de la app) y anótalas. **No agregues funciones ni elementos nuevos** que el Figma no tenga. Los valores dinámicos (montos, fechas) siempre pasan por los formateadores de `src/lib` (`formatCurrency`), aunque el Figma tenga otro formato (ej. `¢18,500`).
- Posiciones verticales: el Figma no dibuja la barra de estado; las medidas se aplican **desde el borde superior del área segura** (safe area) y el tab bar a 17 pt del borde físico inferior.
- **Ancho responsivo (obligatorio):** el Figma mide 402 pt pero el dispositivo del cliente es de 390 pt; la app debe verse bien de 360 a 440 pt. Márgenes laterales fijos (36 pt) y contenido flexible. Prohibido `width` fijo con medidas del Figma en contenido (campos, tarjetas, botones principales, listas). Ningún elemento puede salirse de la pantalla ni solaparse con otro en ningún ancho.
- **Iconografía:** un único sistema de íconos de línea (Lucide, un `Icon` común, trazo coherente). No uses los SVG de `assets/icons/**` (son respaldo); los íconos nuevos se añaden al mapa del design-system. Los emojis de usuario se dibujan como texto del sistema.
- Ignora capas ocultas o invisibles del Figma; manda lo que se ve en `app-screens/`.
- Reutiliza los componentes de `src/design-system`. Si falta algo, crea el componente en el design-system (no estilos sueltos en la pantalla) y documéntalo en `docs/fidelity-components.md`.
- Las pantallas viven en `src/app/` y son delgadas: componen componentes y hooks de `src/features/*`. Los datos SIEMPRE por `getRepositories()` (y los hooks de TanStack Query). Cada mutación invalida las consultas afectadas (`HOME_SUMMARY_KEY`, etc.).
- Todo funciona en **Expo Go** y con `EXPO_PUBLIC_DATA_SOURCE=mock` **y** `=supabase`.
- Estados que el Figma no define (cargando, error, vacío, deshabilitado) siguen el estilo ya establecido en el design-system; deben ser discretos y en español. Errores de validación debajo del campo o botón, texto pequeño en `#FF0000`... pero no uses rojo para nada que no sea monto, error de validación o acción destructiva.
- Teclado: `KeyboardAvoidingView`/scroll para que ningún campo ni botón quede tapado; `returnKeyType` y enfoque encadenado entre campos; `autoCapitalize`/`autoComplete`/`textContentType` correctos; sin zoom raro.
- Accesibilidad: roles, etiquetas en español, áreas táctiles ≥ 44 pt, `allowFontScaling` solo donde el diseño lo tolere.
- Textos 100 % en español, idénticos a la captura.

## Entregables por lote
1. Las pantallas del lote, navegables y con datos reales (mock y supabase).
2. `app/docs/fidelity-<lote>.md`: tabla por pantalla con elemento, medida/posición del Figma, valor implementado y fuente.
3. Pruebas unitarias de la lógica nueva (esquemas zod, utilidades, reducers) en `scripts/unit.test.ts`.
4. Si el lote lo pide, ampliar el índice dev de pantallas.
5. Verificación: `npx tsc --noEmit`, `npm run lint`, `npx prettier --check .`, `npm run test:unit`, `npm run test:supabase`, `npm run test:supabase-data`, `npm run test:supabase-extra` (solo si tocaste datos), `npx expo-doctor`, `npx expo export` iOS y Android (mock y supabase). Confirma que `design-spec/`, `prompts/` y `app/assets/` no cambiaron.

## Resumen final (formato exacto, siempre)
(a) archivos creados/modificados, (b) tabla pantalla → ruta → qué hace y a qué repositorio/hook llama, (c) decisiones y por qué, (d) elementos del Figma que no pudiste replicar exactamente y por qué, (e) problemas y cómo se resolvieron, (f) resultado de cada verificación, (g) **lista de qué debe revisar el cliente en Expo Go**, pantalla por pantalla, y dudas de diseño que requieran su decisión.
