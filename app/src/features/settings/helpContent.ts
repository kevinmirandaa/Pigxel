/** Contenido de ayuda (texto real sobre el uso de la app). */
export interface HelpItem {
  question: string;
  answer: string;
}

/** Centro de ayuda: cómo se usa Pigxel. */
export const HELP_CENTER: readonly HelpItem[] = [
  {
    question: 'Crear tu primera cuenta',
    answer:
      'En Cuentas toca "+", elige Cuenta, escribe un nombre, el monto inicial y un emoji. Tu saldo total es la suma de todas tus cuentas.',
  },
  {
    question: 'Registrar un ingreso o un gasto',
    answer:
      'Usa los botones Ingreso o Gasto de Cuentas. Escribe el monto, elige la cuenta (y la categoría en los gastos) y toca Agregar. El saldo de la cuenta se actualiza al instante.',
  },
  {
    question: 'Revisar tu actividad',
    answer:
      'En Actividad verás el total de la semana y una gráfica de lunes a domingo. Cambia entre Gastos, Ingresos y Ambos, busca por nombre y filtra por categoría con el botón de arriba.',
  },
  {
    question: 'Probar una compra antes de hacerla',
    answer:
      'Consultar te muestra cuánto te quedaría si gastas un monto. No guarda nada: es solo una simulación. Si decides comprar, "Crear gasto" abre el formulario con el monto ya escrito.',
  },
  {
    question: 'Cuidar tu límite de gastos',
    answer:
      'En Ajustes › Límite activas un monto semanal o mensual. Pigxel te avisa en Consultar cuando te acercas o lo superas, pero nunca te impide registrar un gasto.',
  },
  {
    question: 'Ahorrar con objetivos',
    answer:
      'Crea una meta con su monto objetivo y cuánto llevas ahorrado. Los objetivos no mueven dinero solos: tu ahorro se registra manualmente.',
  },
];

/** Preguntas frecuentes. */
export const FAQ: readonly HelpItem[] = [
  {
    question: '¿Pigxel se conecta con mi banco?',
    answer:
      'No. Tú registras tus cuentas y movimientos manualmente, así tú decides qué información guardas.',
  },
  {
    question: '¿Puedo tener un saldo negativo?',
    answer:
      'Sí. Si registras un gasto mayor al saldo de una cuenta, se guarda igual y el saldo queda en negativo. Pigxel solo informa, no bloquea.',
  },
  {
    question: '¿Las suscripciones se cobran solas?',
    answer:
      'No. Pigxel solo te recuerda sus fechas y costos. Para reflejar un pago, regístralo como un gasto.',
  },
  {
    question: '¿Cambiar la moneda convierte mis montos?',
    answer:
      'No. Cambiar la moneda solo cambia el símbolo que se muestra. Los montos se quedan tal como los escribiste.',
  },
  {
    question: '¿Quién puede ver mis datos?',
    answer:
      'Solo tú. Tus datos están protegidos por usuario: nadie más puede leer ni modificar tu información.',
  },
  {
    question: '¿Cómo recupero mi contraseña?',
    answer:
      'En Iniciar sesión toca "Olvidé mi contraseña", escribe tu correo y sigue los pasos para crear una nueva.',
  },
];
