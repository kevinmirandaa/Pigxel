import {
  FlatList,
  Modal,
  Pressable as RNPressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { iconStroke } from '../icons';
import { EmojiBadge } from '../primitives/EmojiBadge';
import { Icon } from '../primitives/Icon';
import { Text } from '../primitives/Text';
import { MAX_SCREEN_WIDTH, colors } from '../tokens';

export interface SelectionOption<T extends string> {
  value: T;
  label: string;
  /** Emoji opcional a la izquierda. */
  emoji?: string;
  /** Texto secundario a la derecha (saldo de una cuenta). */
  detail?: string;
}

export interface SelectionSheetProps<T extends string> {
  visible: boolean;
  title: string;
  options: readonly SelectionOption<T>[];
  selected: T | null;
  onSelect: (value: T) => void;
  onClose: () => void;
}

/** Hoja inferior de selección única (filtro por categoría…): título, lista con emoji y marca ✓ en la elegida. */
export function SelectionSheet<T extends string>({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: SelectionSheetProps<T>) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <RNPressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar" />
      <View
        style={[
          styles.sheet,
          { maxHeight: Math.round(height * 0.7), paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.grabber} />
        <Text variant="heading" style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <FlatList
          data={options}
          keyExtractor={(o) => o.value}
          renderItem={({ item }) => {
            const active = item.value === selected;
            return (
              <RNPressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={item.label}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
                style={styles.row}
              >
                {item.emoji ? (
                  <EmojiBadge emoji={item.emoji} size={28} />
                ) : (
                  <View style={styles.noEmoji} />
                )}
                <Text variant="rowLabel" style={styles.label} numberOfLines={1}>
                  {item.label}
                </Text>
                {item.detail ? (
                  <Text variant="caption" tone="secondary" numberOfLines={1}>
                    {item.detail}
                  </Text>
                ) : null}
                {active ? (
                  <Icon name="check" size={20} color={colors.black} strokeWidth={iconStroke.firm} />
                ) : null}
              </RNPressable>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 8,
    width: '100%',
    maxWidth: MAX_SCREEN_WIDTH,
    alignSelf: 'center',
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.brand.life,
    marginBottom: 12,
  },
  title: { marginBottom: 8 },
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12 },
  noEmoji: { width: 28, height: 28 },
  label: { flex: 1, fontSize: 17 },
});
