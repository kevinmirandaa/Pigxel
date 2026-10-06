# Medidas y colores extraídos del Figma

Generado por `npm run measure` (`scripts/extract-measurements.ts`). No editar a mano.
Fuentes: `design-spec/figma-metadata.xml` (medidas) y muestreo de `design-spec/screens/*.png` a 3x (colores, radios, tamaños).
Tamaño de fuente estimado = altura de la primera mayúscula ÷ 0,724 (relación calibrada con títulos de 32 pt de SF Pro Rounded; ±0,5 pt).

## 1. Medidas observadas (figma-metadata.xml)

Posiciones relativas al frame de la pantalla (402 × 874). `×N` = cuántas veces aparece en ese frame.

| Componente | Pantalla | Capa | Ancho×Alto | Posición (x, y) |
|---|---|---|---|---|
| Botón de vidrio · símbolo (pestañas) | tab-cuentas-objetivos | "Button - Liquid Glass - Symbol" | 50×50 | (325, 40) |
| Botón de vidrio · atrás | add-categoria | "Button - Liquid Glass - Symbol" | 50×50 | (20, 20) |
| Botón de vidrio · Volver (detalle) | ajustes-ayuda | "Volver" | 50×50 | (20, 20) |
| Botón de vidrio · Crear "+" (detalle) | ajustes-objetivos | "Crear" | 50×50 | (325, 20) |
| Título de pantalla (detalle) | ajustes-limite | "Título" | 330×35 | (36, 98) |
| Título de pantalla (Agregar/Nueva…) | add-cuenta | "Nueva cuenta" | 211×27 | (45, 98) |
| Título de pestaña (Actividad) | tab-actividad | "Actividad" | 162×27 | (39, 45) |
| Título de pestaña (Pigxel) | tab-cuentas-objetivos | "Pigxel" | 93×27 | (39, 45) |
| Saldo grande (64) | tab-cuentas-objetivos | "¢ 830.000" | 323×86 | (39, 124) |
| Etiqueta "Saldo total" | tab-cuentas-objetivos | "Saldo total" | 274×27 | (64, 220) |
| Tarjeta de fila 330×74 (Agregar) | add-menu | "Rectangle 32" | 330×74 | (36, 175) |
| ↳ | add-menu | "Rectangle 33" | 330×74 | (36, 267) |
| ↳ | add-menu | "Rectangle 34" | 330×74 | (36, 359) |
| ↳ | add-menu | "Rectangle 35" | 330×74 | (36, 451) |
| Tarjeta de fila 330×74 (Actividad) | tab-actividad | "Rectangle 34" | 330×74 | (36, 483) |
| ↳ | tab-actividad | "Rectangle 35" | 330×74 | (36, 591) |
| ↳ | tab-actividad | "Rectangle 36" | 330×74 | (36, 671) |
| ↳ | tab-actividad | "Rectangle 37" | 330×74 | (36, 751) |
| Tarjeta de fila 330×74 (Objetivos) | tab-cuentas-objetivos | "Rectangle 32" | 330×74 | (36, 417) |
| ↳ | tab-cuentas-objetivos | "Rectangle 33" | 330×74 | (36, 501) |
| Emoji de fila 35×35 | tab-actividad | "2239 1" | 35×35 | (52, 501) |
| ↳ | tab-actividad | "1635 1" | 35×35 | (52, 688) |
| ↳ | tab-actividad | "62 1" | 35×35 | (52, 610) |
| ↳ | tab-actividad | "2112 1" | 35×35 | (52, 765) |
| Campo en píldora (fondo + trazo) | auth-iniciar-sesion | "Rectangle 3" | 330×60 | (36, 234) |
| Campo en píldora (Agregar) | add-cuenta | "Rectangle 14" | 330×60 | (36, 172) |
| Botón negro con flecha | add-categoria | "Rectangle 3" | 330×60 | (36, 440) |
| Botón negro con flecha (flecha) | add-categoria | "Vector" | 15×14.2 | (329, 463) |
| Control segmentado (contenedor) | tab-actividad | "Rectangle 17" | 253×48 | (39, 98) |
| Control segmentado (activa) | tab-actividad | "Rectangle 18" | 85×44 | (42, 100) |
| Control segmentado · etiquetas | tab-actividad | "Gastos" | 52×18 | (59, 113) |
| Buscador | tab-actividad | "Rectangle 25" | 351×53 | (32, 384) |
| Subrayado de pestañas (Cuentas/Objetivos) | tab-cuentas-objetivos | "Line 2" | 50×0 | (234, 382) |
| Pestañas Cuentas / Objetivos (texto) | tab-cuentas-objetivos | "Cuentas" | 115×27 | (86, 352) |
| Círculo disparador de emoji | add-categoria | "Rectangle 15" | 80×80 | (160, 172) |
| Círculo del emoji (glifo) | add-categoria | "Group" | 33.3×33.3 | (183, 195) |
| Ícono de encabezado (detalle) | ajustes-ayuda | "Icono" | 56×56 | (173, 157) |
| Descripción bajo el ícono (detalle) | ajustes-ayuda | "Descripción" | 330×38 | (36, 223) |
| Tarjeta de ajustes (detalle) | ajustes-ayuda | "Tarjeta" | 330×407 | (36, 281) |
| Fila de ajustes (detalle · con ícono) | ajustes-ayuda | "Opción" | 330×68 | (36, 281) |
| ↳ | ajustes-ayuda | "Opción" | 330×68 | (36, 349) |
| ↳ | ajustes-ayuda | "Opción" | 330×68 | (36, 417) |
| Ícono en caja de la fila (detalle) | ajustes-ayuda | "Icono" | 44×44 | (48, 292.5) |
| ↳ | ajustes-ayuda | "Icono" | 44×44 | (48, 360.5) |
| Chevron de fila (detalle) | ajustes-ayuda | "chevron-right" | 14×14 | (340, 307.5) |
| Divisor de fila con ícono | ajustes-ayuda | "Divisor" | 270×1 | (96, 348) |
| ↳ | ajustes-ayuda | "Divisor" | 270×1 | (96, 416) |
| Divisor de fila sin ícono | ajustes-moneda | "Divisor" | 310×1 | (56, 503) |
| ↳ | ajustes-moneda | "Divisor" | 310×1 | (56, 571) |
| Fila de ajustes con interruptor | ajustes-notificaciones | "Opción" | 330×68 | (36, 262) |
| ↳ | ajustes-notificaciones | "Opción" | 330×68 | (36, 330) |
| Interruptor (encendido) | ajustes-limite | "Activado" | 50×30 | (304, 333.5) |
| Interruptor (perilla) | ajustes-limite | "Control" | 26×26 | (326, 335.5) |
| Interruptor (apagado) | ajustes-notificaciones | "Desactivado" | 50×30 | (304, 484.5) |
| Campo de información (detalle) | ajustes-informacion-personal | "Campo" | 330×73 | (36, 318) |
| ↳ | ajustes-informacion-personal | "Campo" | 330×73 | (36, 391) |
| Texto del campo (etiqueta + valor) | ajustes-informacion-personal | "Texto" | 290×40 | (56, 334) |
| Caja informativa (Límite) | ajustes-limite | "Aviso de límite" | 330×89 | (36, 649) |
| Caja informativa · ícono | ajustes-limite | "info" | 18×18 | (52, 665) |
| Caja informativa · texto | ajustes-limite | "Descripción" | 270×57 | (80, 665) |
| Objetivo (tarjeta) | ajustes-objetivos | "Objetivo" | 330×176 | (36, 196) |
| Objetivo · barra (pista) | ajustes-objetivos | "Barra" | 290×6 | (56, 325) |
| ↳ | ajustes-objetivos | "Barra" | 290×6 | (56, 513) |
| Objetivo · barra (avance) | ajustes-objetivos | "Avance" | 58×6 | (56, 325) |
| ↳ | ajustes-objetivos | "Avance" | 168.2×6 | (56, 513) |
| Objetivo · porcentaje | ajustes-objetivos | "Porcentaje" | 290×14 | (56, 338) |
| Código OTP · casilla visible | auth-codigo-verificacion | "Rectangle 15" | 49×77 | (95, 339) |
| Código OTP · cursor | auth-codigo-verificacion | "l" | 9×48 | (62, 354) |
| Código OTP · texto de reenvío | auth-codigo-verificacion | "¿No recibiste el código? Reenviar en 00:59" | 347×19 | (27, 459) |
| Estado vacío · ícono | notificaciones | "Group" | 41×37.8 | (180, 384) |
| Estado vacío · texto | notificaciones | "Información" | 266×82 | (68, 451) |
| Gráfica de línea (imagen) | tab-actividad | "Screenshot 2026-10-04 at 7.19.42 PM 1" | 312×124 | (45, 238) |
| Tab bar (flotante, pantallas de detalle) | ajustes-ayuda | "Barra inferior" | 249×61 | (76, 798) |
| Tab bar · fondo de vidrio | ajustes-ayuda | "Fondo Liquid Glass" | 249×61 | (76, 798) |
| Tab bar · pestaña seleccionada | ajustes-ayuda | "Ajustes seleccionado" | 85×61 | (240, 798) |
| Tab bar · ícono Wallet | ajustes-ayuda | "Wallet" | 25×23 | (106, 816) |
| Tab bar · ícono Actividad | ajustes-ayuda | "Actividad" | 22.5×22.5 | (190, 816) |
| Tab bar · ícono Ajustes | ajustes-ayuda | "Ajustes" | 25×25 | (272, 816) |
| Fila de ajustes principal (caja 50) | tab-ajustes | "Rectangle 48" | 50×50 | (47, 140) |


## 1.1 Separación vertical entre tarjetas de fila

Distancia entre el borde inferior de una tarjeta y el superior de la siguiente (puntos).

| Pantalla | y de cada tarjeta | gap entre tarjetas |
|---|---|---|
| tab-cuentas | 413, 494, 625, 766, 847 | 7, 57, 67, 7 |
| tab-cuentas-objetivos | 417, 501 | 10 |
| tab-actividad | 483, 591, 671, 751 | 34, 6, 6 |
| add-menu | 175, 267, 359, 451 | 18, 18, 18 |
| add-lista-cuentas | 172, 264 | 18 |
| add-lista-categorias | 172, 264, 356, 448 | 18, 18, 18 |


## 2. Muestreo de capturas (design-spec/screens/*.png a 3x)

Colores = píxel exacto del relleno/trazo, o promedio del 15 % de píxeles de tinta más oscuros. Radios = medidos en la esquina (solo fiables con contraste alto).

| Token | Valor | Cómo / dónde se midió |
|---|---|---|
| card.fill | `#FFFFFF` | add-menu · centro de la tarjeta 330×74 |
| card.border | `#EAEAEA` | add-menu · borde: 1 pt FUERA del relleno (trazo exterior) |
| card.borderWidth | `1` | add-menu · escaneo de borde (3 px a 3x) |
| card.radius | `20` | get_design_context (rounded-[20px]); el muestreo da ≈17 por bajo contraste |
| screen.auth.bg | `#FFFFFF` | auth-recuperar-contrasena · fondo de pantalla (las pantallas de auth son BLANCAS) |
| field.auth.fill | `#F0F0F0` | auth-recuperar-contrasena · campo (extremo derecho, sin texto) |
| field.auth.border | `#EAEAEA` | auth-recuperar-contrasena · borde (exterior) |
| field.auth.radius | `27.3` | auth-recuperar-contrasena · esquina (≈ alto/2 = pastilla) |
| field.icon.color | `#C1C1C1` | auth-iniciar-sesion · ícono del campo |
| field.icon.size | `20×20 @ x=60` | auth-iniciar-sesion · mail 20×20 |
| field.form.fill | `#FFFFFF` | add-cuenta · campo blanco (extremo derecho) |
| field.form.border | `#EAEAEA` | add-cuenta · borde (exterior) |
| field.form.radius | `27.3` | add-cuenta · esquina |
| field.placeholder.color | `#C1C1C1` | add-cuenta · placeholder "Nombre" |
| field.placeholder.size | `15.7` | add-cuenta · altura de "N" / 0,724 |
| field.auth.placeholder.color | `#C1C1C1` | auth-recuperar-contrasena · placeholder |
| primaryButton.fill | `#000000` | add-categoria · botón negro |
| primaryButton.radius | `29.6` | add-categoria · esquina (alto 60 → 30) |
| primaryButton.text.color | `#FFFFFF` | add-categoria · texto "Crear" |
| primaryButton.text.size | `20.3` | add-categoria · altura de "C" / 0,724 |
| segmented.fill | `#F0F0F0` | tab-actividad · contenedor (zona derecha, sin la activa) |
| segmented.border | `#EAEAEA` | tab-actividad · borde (exterior) |
| segmented.active.fill | `#FFFFFF` | tab-actividad · pestaña activa |
| segmented.radius | `21.6` | tab-actividad · esquina |
| segmented.label.active | `#000000` | tab-actividad · "Gastos" |
| segmented.label.inactive | `#8F8F8F` | tab-actividad · "Ingresos" |
| segmented.label.size | `13.4` | tab-actividad · altura de "G" / 0,724 |
| search.fill | `#EBEBEB` | tab-actividad · buscador |
| search.border | `#EAEAEA` | tab-actividad · borde (exterior) |
| emojiCircle.size | `80×80` | add-categoria · Rectangle 15 |
| emojiCircle.fill | `#FFFFFF` | add-categoria · relleno |
| emojiCircle.border | `#EAEAEA` | add-categoria · borde |
| emojiCircle.glyph.color | `#C1C1C1` | add-categoria · carita |
| emojiCircle.glyph.size | `33.3×33.3` | add-categoria · Group |
| headerIcon.fill | `#EBEBEB` | ajustes-ayuda · caja 56×56 del encabezado |
| headerIcon.radius | `15.9` | ajustes-ayuda · esquina (aprox.) |
| rowIcon.fill | `#F4F4F4` | ajustes-ayuda · caja 44×44 de la fila |
| detail.title.color | `#000000` | ajustes-ayuda · "Ayuda" |
| detail.title.size | `32.2` | ajustes-moneda · altura de "M" de "Moneda" / 0,724 |
| detail.title.size.check | `31.8` | ajustes-limite · altura de "L" de "Límite" / 0,724 (verificación) |
| detail.description.color | `#8F8F8F` | ajustes-ayuda · "Encuentra respuestas…" |
| detail.description.size | `13.8` | ajustes-ayuda · altura de "E" / 0,724 |
| detail.row.label.color | `#000000` | ajustes-ayuda · "Centro de ayuda" |
| detail.row.label.size | `16.1` | ajustes-ayuda · altura de "C" / 0,724 |
| detail.row.detail.color | `#8F8F8F` | ajustes-ayuda · "Aprende a usar Pigxel" |
| detail.row.detail.size | `12` | ajustes-ayuda · altura de "A" / 0,724 |
| divider.color | `#EAEAEA` | ajustes-ayuda · Divisor |
| chevron.color | `#C1C1C1` | ajustes-ayuda · chevron-right |
| rowIcon.glyph.color | `#000000` | ajustes-ayuda · book-open |
| field.info.label.color | `#8F8F8F` | ajustes-informacion-personal · "Nombre completo" |
| field.info.label.size | `12.9` | ajustes-informacion-personal · altura de "N" / 0,724 |
| field.info.value.color | `#000000` | ajustes-informacion-personal · "Kevin…" |
| field.info.value.size | `16.6` | ajustes-informacion-personal · altura de "K" / 0,724 |
| toggle.on.fill | `#34C759` | ajustes-limite · fondo encendido |
| toggle.knob.fill | `#FFFFFF` | ajustes-limite · perilla |
| toggle.size | `50×30 (perilla 26)` | ajustes-limite · Activado / Control |
| toggle.off.fill | `#E9E9EB` | ajustes-notificaciones · fondo apagado |
| progress.track | `#E9E9EB` | ajustes-objetivos · pista |
| progress.fill | `#007FFF` | ajustes-objetivos · avance (azul) |
| progress.height | `6 (radio 3)` | ajustes-objetivos · Barra |
| progress.percent.color | `#8F8F8F` | ajustes-objetivos · "20% de tu meta" |
| progress.percent.size | `12` | ajustes-objetivos · altura de la 1.ª cifra / 0,724 |
| goalAmount.blue | `#007FFF` | tab-cuentas-objetivos · monto "Objetivo" (azul) |
| goalSaved.color | `#000000` | ajustes-objetivos · "Ahorro actual" |
| goalTarget.color | `#007FFF` | ajustes-objetivos · "Objetivo" |
| goalLabel.color | `#8F8F8F` | ajustes-objetivos · "Ahorro actual" |
| goalLabel.size | `12` | ajustes-objetivos · altura de "A" / 0,724 |
| infoNote.fill | `#EAF8EE` | ajustes-limite · fondo |
| infoNote.border | `#F4F4F4` | ajustes-limite · borde (exterior; igual al fondo si no hay trazo) |
| infoNote.radius | `20.5` | ajustes-limite · esquina (aprox.) |
| infoNote.text.color | `#308548` | ajustes-limite · texto del aviso |
| infoNote.text.size | `13.8` | ajustes-limite · altura de la 1.ª mayúscula (1.ª línea) / 0,724 |
| infoNote.icon.color | `#308548` | ajustes-limite · ícono info |
| otp.cells (x0→x1 · ancho) | `42→90 · 48 | 95→144 · 49 | 149→198 · 49 | 203→252 · 49 | 257→305 · 48 | 310→359 · 49` | auth-codigo-verificacion · escaneo de la fila y=395.5 |
| otp.cell.fill | `#EAEAEA` | auth-codigo-verificacion · casilla vacía |
| otp.cell.size | `49×77` | auth-codigo-verificacion · Rectangle 15 |
| otp.cell.radius | `14.8` | auth-codigo-verificacion · esquina (aprox.) |
| otp.resend.size | `16.1` | auth-codigo-verificacion · altura de una mayúscula del texto de reenvío (aprox.) |
| auth.title.size | `40.1` | auth-codigo-verificacion · altura de "I" (1.ª línea) / 0,724 |
| auth.title.color | `#000000` | auth-codigo-verificacion · título |
| auth.subtitle.color | `#8F8F8F` | auth-codigo-verificacion · subtítulo gris |
| auth.subtitle.size | `20.3` | auth-codigo-verificacion · altura de "H" (1.ª línea) / 0,724 |
| empty.icon.color | `#C1C1C1` | notificaciones · ícono |
| empty.title.color | `#000000` | notificaciones · "Sin notificaciones" |
| empty.title.size | `18.4` | notificaciones · altura de "S" / 0,724 |
| empty.detail.color | `#C1C1C1` | notificaciones · detalle |
| empty.detail.size | `13.8` | notificaciones · altura de "A" / 0,724 |
| empty.layout | `bloque de texto 266×82 @ (68, 451); ícono 41×37.8 @ (180, 384)` | notificaciones · XML |
| mainTab.balanceLabel.color | `#8F8F8F` | tab-cuentas · "Saldo total" |
| mainTab.inactiveTab.color | `#8F8F8F` | tab-cuentas · "Objetivos" (inactiva) |
| mainTab.activeTab.color | `#000000` | tab-cuentas · "Cuentas" (activa) |
| row.subtitle.color | `#8F8F8F` | tab-cuentas · subtítulo de fila |
| amount.expense.color | `#FF0000` | tab-cuentas · monto de gasto |
| amount.income.color | `#65CA60` | tab-actividad · monto de ingreso |
| sectionLabel.color | `#8F8F8F` | tab-actividad · "Hoy" |
| sectionLabel.size | `13.8` | tab-actividad · altura de "H" / 0,724 |
| activity.caption.color | `#8F8F8F` | tab-actividad · "Gastos" sobre el monto |
| settingsMenu.sectionTitle.size | `20.3` | tab-ajustes · altura de "C" / 0,724 |
| chart.line.color | `#262626` | tab-actividad · píxeles oscuros de la curva |
| chart.area.fill | `#F6F6F6` | tab-actividad · degradado bajo la curva (cerca de la base) |
| chart.size | `312×124 @ (45, 238)` | tab-actividad · imagen de la gráfica |
| glass.reference | `388×1058 px (≈ 0.97x)` | reference/tab-cuentas-composed-reference.png (captura real de Figma con vidrio) |
| glass.pill.profile(x=centro de "Ingreso", y 258→322) | `258–264pt #F4F4F4 · 264.5–265pt #EEEEEE · 265.5–266pt #F4F4F4 · 266.5–267pt #F7F7F7 · 267.5–268pt #F3F3F3 · 268.5–269pt #F0F0F0 · 269.5–270pt #EFEFEF · 270.5–272pt #EDEDED · 272.5–274.5pt #EBEBEB · 275–275.5pt #ECECEC · 276–277.5pt #EDEDED · 278–279.5pt #EEEEEE · 280–281.5pt #EFEFEF · 282–282.5pt #F0F0F0 · 283–284.5pt #F1F1F1 · 285–286.5pt #F2F2F2 · 287–288pt #C3C3C3 · 288.5–289pt #969696 · 289.5–290pt #ACACAC · 290.5–291pt #B4B4B4 · 291.5–292pt #999999 · 292.5–293pt #8F8F8F · 293.5–294pt #959595 · 294.5–295pt #ABABAB · 295.5–296pt #DEDEDE · 296.5–297pt #F2F2F2 · 297.5–300pt #F3F3F3 · 300.5–306.5pt #F4F4F4 · 307–307.5pt #F5F5F5 · 308–308.5pt #F6F6F6 · 309–309.5pt #F7F7F7 · 310–310.5pt #F8F8F8 · 311–311.5pt #FBFBFB · 312–312.5pt #FDFDFD · 313–314.5pt #FFFFFF · 315–316pt #F6F6F6 · 316.5–317pt #EDEDED · 317.5–321pt #F0F0F0 · 321.5–322pt #F1F1F1` | píldora 107×50 en (34, 265): fondo → aro claro → relleno → sombra |
| glass.tabBar.profile(x=200, y 975→1050) | `975–985pt #F4F4F4 · 985.5–986pt #EDEDED · 986.5–987pt #F5F5F5 · 987.5–988pt #F6F6F6 · 988.5–989pt #F2F2F2 · 989.5–990pt #F0F0F0 · 990.5–991.5pt #EFEFEF · 992–992.5pt #EDEDED · 993–994.5pt #ECECEC · 995–996.5pt #EBEBEB · 997–997.5pt #ECECEC · 998–998.5pt #EDEDED · 999–1000.5pt #EEEEEE · 1001–1002.5pt #EFEFEF · 1003–1004.5pt #F0F0F0 · 1005–1006pt #F1F1F1 · 1006.5–1010pt #F2F2F2 · 1010.5–1012pt #F3F3F3 · 1012.5–1013pt #EDEDED · 1013.5–1014pt #D2D2D2 · 1014.5–1015pt #C3C3C3 · 1015.5–1027.5pt #C1C1C1 · 1028–1028.5pt #D5D5D5 · 1029–1029.5pt #EDEDED · 1030–1038pt #F4F4F4 · 1038.5–1040pt #F5F5F5 · 1040.5–1041pt #F6F6F6 · 1041.5–1042pt #F7F7F7 · 1042.5–1043pt #F8F8F8 · 1043.5–1044pt #FBFBFB · 1044.5–1045pt #FDFDFD · 1045.5–1047pt #FFFFFF · 1047.5–1048.5pt #F2F2F2 · 1049–1049.5pt #EEEEEE · 1050–1050pt #EFEFEF` | tab bar 249×61 en (76, 982): zona entre los íconos |
| glass.tabBar.activeProfile(x=118, y 975→1050) | `975–985pt #F4F4F4 · 985.5–986pt #E7E7E7 · 986.5–987pt #F1F1F1 · 987.5–988pt #F4F4F4 · 988.5–989pt #F0F0F0 · 989.5–990pt #EEEEEE · 990.5–991.5pt #ECECEC · 992–992.5pt #EBEBEB · 993–993.5pt #EAEAEA · 994–996.5pt #E9E9E9 · 997–997.5pt #EAEAEA · 998–998.5pt #EBEBEB · 999–1000.5pt #ECECEC · 1001–1003.5pt #EDEDED · 1004–1004.5pt #EEEEEE · 1005–1007pt #EFEFEF · 1007.5–1008pt #EAEAEA · 1008.5–1009pt #656565 · 1009.5–1010pt #A7A7A7 · 1010.5–1011pt #A6A6A6 · 1011.5–1012pt #282828 · 1012.5–1028.5pt #000000 · 1029–1029.5pt #838383 · 1030–1030.5pt #E2E2E2 · 1031–1038pt #F3F3F3 · 1038.5–1039pt #F4F4F4 · 1039.5–1041pt #F5F5F5 · 1041.5–1042pt #F6F6F6 · 1042.5–1043pt #F8F8F8 · 1043.5–1044pt #FAFAFA · 1044.5–1045pt #FDFDFD · 1045.5–1047pt #FFFFFF · 1047.5–1048.5pt #EAEAEA · 1049–1049.5pt #E6E6E6 · 1050–1050pt #ECECEC` | pestaña activa 85×61 en (76, 982): borde → relleno → borde |
| glass.button.profile(x=367, y 30→100) | `30–38pt #F4F4F4 · 38.5–39pt #F1F1F1 · 39.5–40pt #F6F6F6 · 40.5–41pt #F3F3F3 · 41.5–42pt #F0F0F0 · 42.5–43.5pt #EFEFEF · 44–44.5pt #EDEDED · 45–45.5pt #ECECEC · 46–46.5pt #EBEBEB · 47–47.5pt #EAEAEA · 48–48.5pt #EBEBEB · 49–50.5pt #ECECEC · 51–52.5pt #EDEDED · 53–53.5pt #EEEEEE · 54–54.5pt #BCBCBC · 55–55.5pt #141414 · 56–72.5pt #000000 · 73–73.5pt #424242 · 74–74.5pt #DEDEDE · 75–75.5pt #F3F3F3 · 76–80.5pt #F4F4F4 · 81–81.5pt #F5F5F5 · 82–82.5pt #F7F7F7 · 83–83.5pt #F8F8F8 · 84–84.5pt #F9F9F9 · 85–85.5pt #FCFCFC · 86–89pt #FFFFFF · 89.5–90pt #F1F1F1 · 90.5–91pt #EDEDED · 91.5–92pt #F0F0F0 · 92.5–94pt #F1F1F1 · 94.5–98pt #F2F2F2 · 98.5–100pt #F3F3F3` | botón + 50×50 (aprox.) |


## 3. Colores de los SVG de los íconos fijos

| Ícono | Colores usados |
|---|---|
| tabs/bars | #C1C1C1 |
| tabs/layers | black |
| tabs/wallet | #C1C1C1 |
| ui/chevron-back | black |
| ui/chevron-row | #C1C1C1 |
| ui/circle-bg-50 | #D0D0D0 |
| ui/filter | black |
| ui/plus-gray | #C1C1C1 |
| ui/plus | black |
| ui/search | #5E5E5F |
| ui/separator | #EAEAEA |
| settings/bell | black |
| settings/card | black |
| settings/globe | black |
| settings/goal | black |
| settings/help | black |
| settings/icon-bg | #D0D0D0 |
| settings/key | black |
| settings/limit | black |
| settings/lock | black |
| settings/mail | black |
| settings/moon | black |
| settings/note | black |
| settings/person | black |
| settings/wallet | black |
| add/card-yellow | #D0C63F |
| add/goal-red | #FF0303 |
| add/note-blue | #1261FF |
| add/piggy-green | #69D95E, black |
