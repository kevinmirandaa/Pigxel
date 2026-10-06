import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { colors, textVariants, type TextVariant } from '../tokens';

export type TextTone = 'primary' | 'secondary' | 'expense' | 'income' | 'inverse';

const toneColor: Record<TextTone, string> = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  expense: colors.expense,
  income: colors.income,
  inverse: colors.white,
};

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  tone?: TextTone;
}

export function Text({ variant = 'bodyStrong', tone = 'primary', style, ...rest }: TextProps) {
  return <RNText {...rest} style={[textVariants[variant], { color: toneColor[tone] }, style]} />;
}
