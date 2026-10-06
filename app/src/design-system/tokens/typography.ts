import { Platform, type TextStyle } from 'react-native';

export type FontWeightName = 'regular' | 'semibold' | 'bold';

/**
 * Tipografía de la app: SF Pro Rounded.
 * - iOS: `ui-rounded` = UIFontDescriptorSystemDesignRounded (SF Pro Rounded del sistema).
 * - Android: Nunito (alternativa libre más parecida), cargada con useAppFonts().
 * Pendiente de comprobar en un dispositivo iOS real: en simulador iOS que `ui-rounded` renderiza como en Figma.
 */
const NUNITO: Record<FontWeightName, string> = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
};

const IOS_WEIGHT: Record<FontWeightName, TextStyle['fontWeight']> = {
  regular: '400',
  semibold: '600',
  bold: '700',
};

export const nunitoFontFamilies = NUNITO;

export function font(weight: FontWeightName): Pick<TextStyle, 'fontFamily' | 'fontWeight'> {
  return Platform.OS === 'ios'
    ? { fontFamily: 'ui-rounded', fontWeight: IOS_WEIGHT[weight] }
    : { fontFamily: NUNITO[weight] };
}

/** Escala de tamaños leída del Figma. */
export const fontSize = {
  display: 64, // saldo total
  amount: 40, // monto grande en Actividad, título de bienvenida y de auth
  title: 32, // título de pantalla
  heading: 20, // sección / fila de Agregar / botones / subtítulo de auth
  bodyStrong: 18, // título de fila
  row: 16, // fila de ajustes
  caption: 14, // subtítulos
  label: 13, // control segmentado, etiqueta de campo de información
  micro: 12, // detalle de fila, porcentajes, etiquetas de objetivo
} as const;

export type TextVariant =
  | 'display'
  | 'amount'
  | 'title'
  | 'heading'
  | 'bodyStrong'
  | 'row'
  | 'caption'
  | 'label'
  | 'micro'
  | 'button'
  | 'authTitle'
  | 'authSubtitle'
  | 'detailTitle'
  | 'rowLabel'
  | 'rowDetail'
  | 'description'
  | 'fieldLabel'
  | 'fieldValue'
  | 'fieldInput';

export const textVariants: Record<TextVariant, TextStyle> = {
  display: { ...font('bold'), fontSize: fontSize.display },
  amount: { ...font('bold'), fontSize: fontSize.amount },
  title: { ...font('bold'), fontSize: fontSize.title },
  heading: { ...font('bold'), fontSize: fontSize.heading },
  bodyStrong: { ...font('bold'), fontSize: fontSize.bodyStrong },
  row: { ...font('bold'), fontSize: fontSize.row },
  caption: { ...font('regular'), fontSize: fontSize.caption },
  label: { ...font('semibold'), fontSize: fontSize.label },
  micro: { ...font('regular'), fontSize: fontSize.micro },
  button: { ...font('semibold'), fontSize: fontSize.heading },
  // Auth: título 40 Bold (2 líneas de 48), subtítulo 20 gris (líneas de 24).
  authTitle: { ...font('bold'), fontSize: fontSize.amount, lineHeight: 48 },
  authSubtitle: { ...font('regular'), fontSize: fontSize.heading, lineHeight: 24 },
  // Pantallas de detalle (capas "Título", "Etiqueta", "Detalle", "Descripción" del Figma).
  detailTitle: { ...font('bold'), fontSize: fontSize.title, lineHeight: 35 },
  rowLabel: { ...font('bold'), fontSize: fontSize.row, lineHeight: 19 },
  rowDetail: { ...font('regular'), fontSize: fontSize.micro, lineHeight: 16 },
  description: { ...font('regular'), fontSize: fontSize.caption, lineHeight: 19 },
  fieldLabel: { ...font('regular'), fontSize: fontSize.label, lineHeight: 16 },
  fieldValue: { ...font('semibold'), fontSize: fontSize.row, lineHeight: 19 },
  // Texto escrito en campos en píldora (placeholder 16 gris `#C1C1C1`).
  fieldInput: { ...font('regular'), fontSize: fontSize.row },
};
