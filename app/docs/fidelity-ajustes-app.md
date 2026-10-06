# Fidelidad · Lote 7.5 (Ajustes › App)

Valor Figma → valor aplicado → motivo. Margen lateral 36, ancho flexible.

| Pantalla       | Elemento                    | Figma                     | Aplicado                                                                                                                                       | Motivo                        |
| -------------- | --------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Todas          | Margen / tarjetas           | 29–39, anchos variables   | 36, ancho flexible                                                                                                                             | Un solo margen                |
| Notificaciones | Filas                       | Íconos de línea distintos | Lucide: credit-card, target, gauge, chart-no-axes-column, sparkles                                                                             | Sistema único                 |
| Notificaciones | Push                        | —                         | No hay push reales: solo se guardan las preferencias (`notify_*`)                                                                              | Limitación del MVP            |
| Apariencia     | Vista previa                | `¢ 830.000` fijo          | Saldo real del usuario con `formatCurrency`                                                                                                    | Dato real                     |
| Apariencia     | Modo oscuro                 | —                         | La app sigue en claro; la preferencia se guarda                                                                                                | Decisión del MVP              |
| Idioma         | Idioma                      | —                         | La app sigue en español; la preferencia se guarda                                                                                              | Sin traducciones aún          |
| Privacidad     | Permisos de datos           | Fila                      | Hoja informativa breve                                                                                                                         | Pedido del lote               |
| Privacidad     | Descargar datos             | Fila                      | JSON legible compartido con la hoja nativa                                                                                                     | Pedido del lote               |
| Privacidad     | Eliminar cuenta             | Fila roja                 | Confirmación en dos pasos + `settings.deleteAccount()`; sin función en el servidor → "Esta función aún no está disponible"                     | Pedido del lote               |
| Privacidad     | Política y Términos         | Filas                     | Hoja "Documento en preparación"                                                                                                                | No se inventan textos legales |
| Ayuda          | Centro de ayuda / FAQ       | Filas                     | Hojas con 6 textos cada una sobre el uso real                                                                                                  | Pedido del lote               |
| Ayuda          | Soporte, Comentarios, Error | Filas                     | `mailto:` a `EXPO_PUBLIC_SUPPORT_EMAIL` (error: incluye versión, plataforma y sistema); sin variable → alerta "Configura el correo de soporte" | Pedido del lote               |
| Ayuda          | Acerca de                   | Fila                      | Hoja con versión (`expo-constants`)                                                                                                            | Pedido del lote               |

## Elementos añadidos (no están en el Figma)

Hojas informativas (permisos, legal, ayuda, FAQ, acerca de), confirmación de eliminación en dos pasos, mensajes de error.
