import { StyleSheet, View } from 'react-native';

import { iconStroke } from '../icons';
import { Icon } from '../primitives/Icon';
import { Text } from '../primitives/Text';
import { colors, layout, radii } from '../tokens';

export interface InfoNoteProps {
  children: string;
}

/** Caja informativa verde (Límite): fondo `#EAF8EE`, radio 20, ícono info 18 y texto 14 `#308548`. Sin borde. */
export function InfoNote({ children }: InfoNoteProps) {
  return (
    <View accessibilityRole="text" style={styles.box}>
      <View style={styles.icon}>
        <Icon
          name="info"
          size={layout.infoNote.icon}
          color={colors.infoNoteText}
          strokeWidth={iconStroke.default}
        />
      </View>
      <Text variant="description" style={styles.text}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignSelf: 'stretch',
    borderRadius: radii.card,
    backgroundColor: colors.infoNoteBg,
    padding: layout.infoNote.padding,
    flexDirection: 'row',
    gap: layout.infoNote.textLeft - layout.infoNote.padding - layout.infoNote.icon,
  },
  icon: { width: layout.infoNote.icon, height: layout.infoNote.icon, marginTop: 0 },
  text: { flex: 1, color: colors.infoNoteText },
});
