# Fidelidad · Lote 7.2 · Pestañas (Cuentas, Actividad, Ajustes)

Normalizaciones (valor Figma → aplicado → motivo). Cada una es reversible.

| Pantalla  | Elemento                                    | Figma                     | Aplicado                                                                  | Motivo                                           |
| --------- | ------------------------------------------- | ------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------ |
| Todas     | Título de pestaña                           | x=39                      | margen 36                                                                 | Margen único del sistema                         |
| Cuentas   | Botones campana y "+"                       | solapados, margen der. 27 | separados 10 pt, margen der. 36                                           | Evitar solape (pedido en el prompt)              |
| Cuentas   | Píldoras Ingreso/Gasto/Consulta             | anchos fijos              | ancho igual flexible, gap 10                                              | Responsivo 360–440                               |
| Cuentas   | ListRow (cuentas, recientes, suscripciones) | insets/gaps variables     | inset 18, gap 14, separación 8                                            | Un solo valor por tipo de fila                   |
| Cuentas   | Espacios entre secciones                    | variables                 | 28; título→filas 12                                                       | Cuadrícula 4/8                                   |
| Cuentas   | Saldo                                       | 64 Bold                   | 64 Bold con `adjustsFontSizeToFit`, margen superior 28                    | Saldos largos                                    |
| Actividad | Total "Ambos"                               | no existe                 | "Balance" = ingresos − gastos, con signo y color, gráfica con neto diario | Decisión necesaria (el Figma solo dibuja Gastos) |
| Actividad | Botón filtro                                | sin estado                | punto negro (badge) si hay categoría activa                               | Indicar filtro activo (adición mínima)           |
| Actividad | Hoja de categorías                          | no existe                 | `SelectionSheet` ("Todas", categorías, "Sin categoría")                   | Lo pide el prompt; filtro local                  |
| Ajustes   | Grupos                                      | margen 39                 | margen 39 (se mantiene, es el de la captura)                              | —                                                |
| Ajustes   | "Cerrar sesión"                             | no existe                 | Grupo extra, texto rojo (acción destructiva), confirmación nativa         | Adición necesaria; la app la requiere            |

Componentes nuevos/ampliados del design-system: `GoalRow`, `SelectionSheet`, `EmptyState` (acción), `GlassButton` (`badge`, `fill`), `HeaderActions` (gap), `Screen` (`refreshControl`), `LineChart` (valores negativos), ícono `log-out`.

Datos: Cuentas usa `useHomeSummary`; Actividad `useWeeklyActivity` / `useTransactionList` (claves en `features/transactions/queryKeys.ts`); `invalidateFinancialQueries` invalida resumen, actividad y contexto de Consultar.
