import { StyleSheet } from 'react-native';

import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';

export interface TextLinkProps {
  children: string;
  onPress: () => void;
  align?: 'left' | 'right' | 'center';
}

/** Enlace de texto 14 ("Olvidé mi contraseña"); el área táctil se amplía con `hitSlop` sin mover el layout. */
export function TextLink({ children, onPress, align = 'right' }: TextLinkProps) {
  const self = align === 'right' ? 'flex-end' : align === 'left' ? 'flex-start' : 'center';
  return (
    <Pressable
      onPress={onPress}
      haptic={false}
      hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      accessibilityRole="link"
      style={[styles.link, { alignSelf: self }]}
    >
      <Text variant="caption" style={styles.text}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({ link: { paddingHorizontal: 4 }, text: { lineHeight: 17 } });
