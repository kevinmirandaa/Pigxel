# Fase 7 · Etapa 2: las 4 pantallas de pestañas

Lee primero `prompts/fase-7-protocolo-pantallas.md` (reglas, criterio de diseño Apple, ancho responsivo, íconos) y síguelo íntegro. Requisitos: etapas 7.0, 7.0b y 7.1 terminadas. Fuente de datos: `getRepositories()` + TanStack Query; usa `useHomeSummary`, `HOME_SUMMARY_KEY` y los hooks existentes.

## Estructura de navegación
`src/app/(tabs)/_layout.tsx` usa la `FloatingTabBar` (wallet · chart · layers): **Cuentas** (`index`), **Actividad** (`activity`), **Ajustes** (`settings`, con su Stack interno). La barra queda visible también en las pantallas de detalle de Ajustes (como en el Figma). Contenido de cada pestaña con scroll y relleno inferior para no quedar bajo la barra. Cambiar de pestaña conserva el estado.

## 1. Cuentas (`(tabs)/index`) · refs `tab-cuentas` y `tab-cuentas-objetivos`
Misma pantalla con dos modos (`TabsUnderline` "Cuentas | Objetivos"; el modo Objetivos corresponde a `tab-cuentas-objetivos`).
- **Encabezado:** título "Pigxel" (32 Bold) a la izquierda; a la derecha dos botones de vidrio 50×50: campana con punto (`bell-dot`) → `/notifications` y "+" → `/add`. En el Figma están solapados; sepáralos con un espacio limpio de 8–12 pt y margen derecho 36 (se anota como normalización).
- **Saldo:** `¢ 830.000`-style, 64 pt Bold, centrado, con ajuste automático; "Saldo total" 18 gris. Es la suma real de saldos (`getTotalBalance`). Sin cuentas: `¢ 0`.
- **Píldoras de vidrio** (alto 50): "Ingreso" → `/add/income`, "Gasto" → `/add/expense`, "Consulta" → `/consult`. Distribúyelas con el mismo espaciado en el ancho disponible.
- **Modo Cuentas:** lista de cuentas (`ListRow`: emoji, nombre, descripción gris si existe, saldo a la derecha). Luego "Recientes" (3 últimos movimientos: emoji de la categoría, título o categoría, "Categoría, hora", monto con signo y color rojo/verde). Luego "Suscripciones" (emoji, nombre, plan en español "Mensual/Semanal/Anual", costo). Cada sección solo aparece si tiene datos; si no hay nada en absoluto, muestra un estado vacío discreto "Aún no tienes cuentas" con un botón de texto "Agregar cuenta" → `/add/account`.
- **Modo Objetivos:** tarjeta por objetivo: emoji, nombre y debajo "Objetivo:"; a la derecha el ahorro actual en negro y el monto meta en azul `#007FFF` (como `tab-cuentas-objetivos`). Estado vacío: "Aún no tienes objetivos" + "Agregar objetivo" → `/add/goal`.
- Las filas no navegan (el Figma no tiene detalle); sin efecto de pulsación engañoso.
- Pull-to-refresh invisible en el diseño (solo el control nativo).

## 2. Actividad (`(tabs)/activity`) · ref `tab-actividad`
- Título "Actividad" 32 + botón de vidrio de filtro (`list-filter`).
- `Segmented` "Gastos | Ingresos | Ambos" (ancho 252,5).
- Texto gris con el tipo ("Gastos" / "Ingresos" / "Balance") y el total grande (40 Bold): `getPeriodTotal(type)`; periodo = semana actual lunes–domingo (hora local). **Ambos**: muestra "Balance" con ingresos − gastos de la semana (con signo y color) y la gráfica con el neto diario; anótalo como decisión de diseño necesaria.
- `LineChart` con `getWeeklySeries(type)`: por defecto selecciona el día de hoy; tocar un día mueve el punto y el tooltip (monto con `formatCurrency`).
- `SearchField` "Buscar" (debounce ~250 ms) → `transactions.list({type, search})`. Resultados agrupados por día con encabezados "Hoy", "Ayer" y después fecha larga en español ("martes 6 de octubre"); filas como en el Figma. Estados: cargando discreto, "Sin movimientos" (con `EmptyState`) si no hay.
- Botón de filtro: abre una hoja inferior para filtrar por categoría (lista con emoji y marca de selección, "Todas") aplicada localmente sobre la lista; si el tiempo no alcanza, deja el botón sin acción visible y repórtalo.
- Pull-to-refresh.

## 3. Ajustes (`(tabs)/settings/index`) · ref `tab-ajustes`
Título "Ajustes"; tres grupos con encabezado y `SettingsGroup`: **Cuenta** (Información personal, Correo electrónico, Contraseña), **Finanzas** (Moneda, Límite, Categorías, Suscripciones, Objetivos), **App** (Notificaciones, Apariencia, Idioma, Privacidad, Ayuda). Cada fila navega a su ruta en `(tabs)/settings/*` (algunas pantallas se construyen en las etapas 7.4 y 7.5; hasta entonces son stubs). **Añade** al final un grupo con una sola fila "Cerrar sesión" (texto destructivo rojo, sin chevron, con confirmación nativa "¿Cerrar sesión?") que llama a `auth.signOut()` y vuelve a bienvenida. Es un elemento que el Figma no tiene pero la app necesita; anótalo en el resumen como adición necesaria.

## Datos y refresco
Cualquier mutación futura (otras etapas) invalida `HOME_SUMMARY_KEY` y las claves de actividad; deja exportadas las claves en un solo módulo (`src/features/*/queryKeys.ts`). Los montos siempre con `formatCurrency`; fechas y horas con formateadores de `src/lib` en español, hora local.

## Pruebas
Unitarias para: agrupación de movimientos por día (Hoy/Ayer/fecha), cálculo de "Balance" del modo Ambos, elección de día seleccionado, filtro por categoría, formato de encabezados de fecha en español. Mantén verdes todas las pruebas existentes.

## Resumen final
Formato del protocolo (a–g). En (g) indica cómo cargar los datos de demostración con `npm run seed:demo` para ver las pestañas con contenido y qué comprobar en cada pestaña.
