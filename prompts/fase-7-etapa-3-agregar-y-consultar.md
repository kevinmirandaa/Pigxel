# Fase 7 · Etapa 3: Agregar, Consultar y Notificaciones

Lee primero `prompts/fase-7-protocolo-pantallas.md` y síguelo íntegro. Requisitos: etapas 7.0, 7.0b, 7.1 y 7.2 terminadas. Las pantallas llaman a `getRepositories()` (mock y supabase) y, tras cada creación, invalidan `HOME_SUMMARY_KEY` y las consultas de actividad.

## Pantallas (11) · capturas en `design-spec/app-screens/` y `screens/`
| Ruta | Captura | Contenido |
|---|---|---|
| `add/index` | `add-menu` | Atrás + "Agregar". Cuatro filas: Cuenta, Categoría, Suscripción, Objetivo (círculo de ícono de color 50×50, texto 20 Bold, "+" gris a la derecha). **El cuerpo de la fila abre la lista y el "+" abre el formulario**: Cuenta → `add/accounts-list`, Categoría → `add/categories-list`, Suscripción → `settings/subscriptions`, Objetivo → `settings/goals`. |
| `add/accounts-list` | `add-lista-cuentas` | "Cuentas": filas emoji + nombre. |
| `add/categories-list` | `add-lista-categorias` | "Categorías": filas emoji + nombre. |
| `add/account` | `add-cuenta` | Disparador de emoji arriba (círculo 80, mismo estilo de `add-categoria`), campos "Nombre" y "Monto inicial", botón "Crear →". |
| `add/category` | `add-categoria` | Disparador de emoji, campo "Nombre", "Crear →". |
| `add/subscription` | `add-suscripcion` | Disparador de emoji, "Nombre", "Costo", `Segmented` "Estado: Activo/Inactivo", `Segmented` "Plan: Semanal/Mensual/Anual", "Crear →". Título "Nueva suscripción" (un solo espacio). |
| `add/goal` | `add-objetivo` | Disparador de emoji, "Nombre", "Monto objetivo", "Monto inicial", "Crear →". |
| `add/income` | `add-ingreso` | "Agregar ingreso": "Monto", "Descripción", fila selectora "Cuenta" (con chevron), botón "Agregar →". |
| `add/expense` | `add-gasto` | "Agregar gasto": "Monto", "Descripción", selectores "Cuenta" y "Categoría", "Agregar →". |
| `consult` | `consultar` | Ver abajo. |
| `notifications` | `notificaciones` | Atrás + "Notificaciones" + `EmptyState` "Sin notificaciones / Ahora mismo no tienes ninguna notificación. Puedes volver más tarde para revisar tu bandeja." |

Los formularios de Cuenta, Suscripción y Objetivo reciben el disparador de emoji (decisión del cliente; antes solo lo tenía Categoría).

## Comportamiento de formularios (común)
- Esquemas zod de `src/features/*/schemas`. Montos en colones **enteros** con entrada numérica: prefijo "¢", separador de miles con punto en vivo (`700000` → `700.000`), sin decimales, tope razonable (≤ 999.999.999). Nombres recortados, 1–60 caracteres.
- Validación al enviar y, tras el primer intento, en vivo; mensajes en español bajo el campo; el botón muestra carga y evita doble envío. Errores de red/servidor bajo el botón.
- Éxito: háptico de éxito, invalida las consultas y vuelve a la pantalla anterior (a la raíz de la pestaña si venías del menú Agregar). Cerrar teclado al tocar fuera; `returnKeyType` encadenado; scroll y `KeyboardAvoidingView` para que el botón nunca quede tapado.
- **Selector de cuenta/categoría:** fila con etiqueta y chevron; al tocarla abre una hoja inferior con la lista (emoji, nombre y saldo en cuentas), marca de selección y, en categorías, una opción "Sin categoría". La fila muestra la elección con su emoji. Cuenta por defecto: la primera. Si no hay cuentas: mensaje "Primero crea una cuenta" con botón a `add/account` (no permitir enviar).
- **Gasto/ingreso:** descripción opcional (si está vacía el título queda vacío y la fila usa la categoría o "Ingreso"/"Gasto"). Un gasto mayor al saldo se permite (el saldo puede quedar negativo) sin bloquear.
- Nueva categoría: nombre único por usuario (el repositorio ya valida; muestra su mensaje).
- Nueva cuenta: si "Monto inicial" está vacío = 0.
- Nuevo objetivo: monto inicial ≤ meta; meta > 0.

## Consultar (`consult`, ref `consultar`)
Atrás + "Consultar". Campo editable "¢700.000"-style (placeholder "Monto") → "Ahora mismo tienes:" (etiqueta gris) + píldora de solo lectura con el saldo total real (`getConsultContext`) → "Te quedarán:" + píldora de solo lectura con el resultado de `computeConsult` en vivo mientras se escribe (sin enviar). El resultado se muestra en negro si es ≥ 0 y en rojo con signo menos si es negativo (el Figma lo pinta rojo siempre; se anota como normalización). Botón "Crear gasto →" → `add/expense` con el monto ya cargado (parámetro de ruta) y sin enviar nada por sí mismo. Si hay límite de gasto activo, debajo de las píldoras aparece **una sola línea discreta** de texto gris (no un aviso llamativo): "Con esto usarías el 85 % de tu límite mensual" (`near`) o "Superarías tu límite mensual en ¢X" (`exceeded`); nunca bloquea nada. Se anota en el resumen como elemento añadido para que el cliente lo apruebe.

## Pruebas
Unitarias: formateo y parseo de montos en vivo, esquemas de cada formulario (válidos/ inválidos/ bordes), selección por defecto de cuenta, texto de la línea de límite, resultado de Consultar con casos (positivo, cero, negativo, límite apagado/ok/near/exceeded). Integración: `scripts/test-forms-flow.ts` con repositorios reales (usuario `@pigxel-test.dev`): crear cuenta con emoji, categoría, objetivo, suscripción, ingreso y gasto con los mismos esquemas y verificar saldos y listas.

## Resumen final
Formato del protocolo (a–g). En (g): cómo recorrer cada formulario en Expo Go, con qué datos de prueba y qué comprobar (teclado, emoji, selectores, saldo actualizado en Cuentas tras crear un gasto).
