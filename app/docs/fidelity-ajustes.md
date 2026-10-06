# Fidelidad · Lote 7.4 (Ajustes con datos)

Valor Figma → valor aplicado → motivo. Márgenes laterales 36 y ancho flexible en todas.

| Pantalla             | Elemento                                         | Figma                                         | Aplicado                                                                                    | Motivo                       |
| -------------------- | ------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------- |
| Todas                | Margen lateral                                   | 29–39 según pantalla                          | 36                                                                                          | Un solo margen               |
| Todas                | Tarjetas                                         | Anchos y x distintos entre pantallas          | Ancho flexible alineado al margen                                                           | Responsivo                   |
| Todas                | Título → contenido                               | 20–36 pt                                      | 20 (introducción) / 16 (listas)                                                             | Cuadrícula 4/8               |
| Información personal | Edición                                          | Solo muestra datos                            | **Añadido**: tocar una fila abre hoja con campo y "Guardar" (Correo remite a su pantalla)   | Necesario para editar        |
| Información personal | Avatar                                           | Círculo gris con persona                      | 96 pt, ícono Lucide `user-round`                                                            | Íconos unificados            |
| Correo               | Cambiar correo                                   | Fila con chevron                              | Abre hoja con campo y botón; aviso de confirmación a ambas direcciones                      | Secure email change activo   |
| Contraseña           | Botón                                            | Sin flecha                                    | Sin flecha (`withArrow=false`)                                                              | Fiel al Figma                |
| Contraseña           | Ojo por campo + interruptor "Mostrar contraseña" | Ambos                                         | Ambos sincronizados (revelan los tres campos)                                               | Fiel                         |
| Moneda               | Símbolo del colón                                | "₡"                                           | "¢"                                                                                         | La app usa ¢ en todas partes |
| Moneda               | Nota al pie                                      | "CRC es la moneda principal seleccionada."    | Dinámica con el código elegido                                                              | Pedido del lote              |
| Moneda               | Moneda principal                                 | Colón fijo arriba                             | La elegida va arriba; las otras debajo                                                      | Coherencia con la nota       |
| Límite               | Guardado                                         | (implícito)                                   | Automático: al cambiar interruptor/periodo y al terminar el monto (600 ms o al perder foco) | Estilo iOS                   |
| Límite               | Filas de periodo                                 | "Semanal / Período del límite"                | Igual; apagado = atenuado y no editable                                                     | Pedido del lote              |
| Límite               | Interruptor encendido con monto 0                | —                                             | Muestra "Debe ser mayor que 0" y no guarda                                                  | Regla del lote               |
| Categorías           | Íconos de fila                                   | Íconos de línea                               | Emoji de la categoría en la caja 44                                                         | Pedido del lote              |
| Categorías           | Chevron                                          | Sí                                            | No (no hay detalle)                                                                         | Normalización                |
| Suscripciones        | Íconos                                           | Mezcla de imágenes e íconos                   | Emoji de la suscripción                                                                     | Consistencia                 |
| Suscripciones        | Inactivas                                        | —                                             | Atenuadas con "· Inactiva"                                                                  | Estado no definido           |
| Objetivos            | Pin 📌                                           | Emoji                                         | Emoji real del objetivo                                                                     | Dato real                    |
| Objetivos            | Tarjeta                                          | Etiquetas pequeñas (Ahorro actual / Objetivo) | Igual, montos con ajuste de tamaño                                                          | Evita desbordes              |

## Moneda (limitación del MVP)

Elegir otra moneda **solo cambia el símbolo** que muestran `formatCurrency` y toda la app; **no convierte montos**. La moneda se guarda en `user_settings.currency` y se carga con `CurrencySync` al iniciar sesión.

## Elementos añadidos

Hojas de edición (perfil y correo), mensajes de error/éxito y estados vacíos.
