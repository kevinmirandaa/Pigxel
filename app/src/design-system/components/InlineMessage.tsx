import { StyleSheet } from 'react-native';

import { Text } from '../primitives/Text';
import { colors } from '../tokens';

export interface InlineMessageProps {
  /** `error` (validación/servidor, rojo) o `success` (aviso breve, verde del aviso de Límite). */
  tone?: 'error' | 'success';
  children: string;
}

/** Mensaje breve bajo un campo o botón (estado que el Figma no define; discreto y en español). */
export function InlineMessage({ tone = 'error', children }: InlineMessageProps) {
  return (
    <Text
      variant="fieldLabel"
      accessibilityRole={tone === 'error' ? 'alert' : 'text'}
      accessibilityLiveRegion="polite"
      style={[styles.text, { color: tone === 'error' ? colors.expense : colors.infoNoteText }]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({ text: { textAlign: 'center', fontSize: 14, lineHeight: 19 } });
