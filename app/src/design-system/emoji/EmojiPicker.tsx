import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable as RNPressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Emoji } from '@/data';
import { useRecentEmojisStore } from '@/stores/recentEmojis';

import { Text } from '../primitives/Text';
import { MAX_SCREEN_WIDTH, colors, columnWidth, font, radii } from '../tokens';
import { GROUP_ICONS, emojiCatalog, emojiGroups } from './data';
import { buildIndex, searchEmojis, supportedOnly } from './search';
import { maxEmojiVersion } from './support';

const COLUMNS = 8;
const SIDE_PADDING = 16;
const HEADER_HEIGHT = 36;

const index = buildIndex(emojiCatalog);

type Item =
  { type: 'header'; key: string; label: string } | { type: 'row'; key: string; emojis: Emoji[] };

function toRows(emojis: readonly Emoji[], prefix: string): Item[] {
  const rows: Item[] = [];
  for (let i = 0; i < emojis.length; i += COLUMNS) {
    rows.push({ type: 'row', key: `${prefix}-${i}`, emojis: emojis.slice(i, i + COLUMNS) });
  }
  return rows;
}

export interface EmojiPickerProps {
  visible: boolean;
  onClose: () => void;
  /** Se llama con el emoji elegido (el selector se cierra solo). */
  onSelect: (emoji: Emoji) => void;
  /** Emoji actual, se resalta en la cuadrícula. */
  selected?: Emoji | null;
}

/**
 * Selector de emoji en hoja inferior: búsqueda en español, categorías y recientes.
 * Solo muestra emojis que el sistema (iOS/Android) sabe dibujar; ver ./support.ts.
 * Se reutiliza arriba de Nueva cuenta, Nueva categoría, Nuevo objetivo y Nueva suscripción.
 */
export function EmojiPicker({ visible, onClose, onSelect, selected }: EmojiPickerProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const recents = useRecentEmojisStore((s) => s.recents);
  const pushRecent = useRecentEmojisStore((s) => s.push);
  const [query, setQuery] = useState('');
  const listRef = useRef<FlatList<Item>>(null);

  const maxVersion = useMemo(
    () => maxEmojiVersion({ os: Platform.OS, version: Platform.Version }),
    [],
  );
  const cell = Math.floor((columnWidth(width) - SIDE_PADDING * 2) / COLUMNS);

  const supported = useMemo(() => supportedOnly(index, maxVersion), [maxVersion]);
  const supportedSet = useMemo(() => new Set(supported.map((e) => e.e)), [supported]);

  const { items, groupOffsets } = useMemo(() => {
    const out: Item[] = [];
    const offsets: number[] = [];
    let y = 0;
    const push = (list: Item[]) => {
      for (const item of list) {
        out.push(item);
        y += item.type === 'header' ? HEADER_HEIGHT : cell;
      }
    };

    const validRecents = recents.filter((e) => supportedSet.has(e));
    if (validRecents.length > 0) {
      push([{ type: 'header', key: 'h-recents', label: 'Recientes' }]);
      push(toRows(validRecents, 'recents'));
    }
    emojiGroups.forEach((group, g) => {
      const inGroup = supported.filter((e) => e.g === g).map((e) => e.e);
      offsets[g] = y;
      push([{ type: 'header', key: `h-${group.key}`, label: capitalize(group.label) }]);
      push(toRows(inGroup, group.key));
    });
    return { items: out, groupOffsets: offsets };
  }, [recents, supported, supportedSet, cell]);

  const results = useMemo(() => {
    const found = searchEmojis(index, query, maxVersion).map((e) => e.e);
    return toRows(found, 'q');
  }, [query, maxVersion]);

  const searching = query.trim().length > 0;
  const data = searching ? results : items;

  const close = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  const choose = useCallback(
    (emoji: Emoji) => {
      pushRecent(emoji);
      setQuery('');
      onSelect(emoji);
      onClose();
    },
    [onClose, onSelect, pushRecent],
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <RNPressable style={styles.backdrop} onPress={close} accessibilityLabel="Cerrar" />
      <View
        style={[
          styles.sheet,
          { height: Math.round(height * 0.72), paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View style={styles.grabber} />
        <View style={styles.searchBox}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar emoji"
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            returnKeyType="search"
            accessibilityLabel="Buscar emoji"
          />
        </View>

        {searching ? null : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.groupBar}
            contentContainerStyle={styles.groupBarContent}
            keyboardShouldPersistTaps="handled"
          >
            {emojiGroups.map((group, g) => (
              <RNPressable
                key={group.key}
                accessibilityRole="button"
                accessibilityLabel={capitalize(group.label)}
                onPress={() =>
                  listRef.current?.scrollToOffset({ offset: groupOffsets[g] ?? 0, animated: true })
                }
                style={styles.groupButton}
              >
                <Text allowFontScaling={false} style={styles.groupIcon}>
                  {GROUP_ICONS[g]}
                </Text>
              </RNPressable>
            ))}
          </ScrollView>
        )}

        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(item) => item.key}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={14}
          windowSize={9}
          getItemLayout={(list, i) => {
            const rows = (list ?? []) as Item[];
            let offset = 0;
            for (let k = 0; k < i; k += 1) {
              offset += rows[k]?.type === 'header' ? HEADER_HEIGHT : cell;
            }
            const length = rows[i]?.type === 'header' ? HEADER_HEIGHT : cell;
            return { length, offset, index: i };
          }}
          ListEmptyComponent={
            <Text variant="caption" tone="secondary" style={styles.empty}>
              {searching ? 'No encontramos ese emoji' : ''}
            </Text>
          }
          renderItem={({ item }) =>
            item.type === 'header' ? (
              <View style={styles.header}>
                <Text variant="caption" tone="secondary">
                  {item.label}
                </Text>
              </View>
            ) : (
              <View style={[styles.row, { height: cell }]}>
                {item.emojis.map((emoji) => (
                  <RNPressable
                    key={emoji}
                    accessibilityRole="button"
                    accessibilityLabel={`Emoji ${emoji}`}
                    onPress={() => choose(emoji)}
                    style={[
                      styles.cell,
                      { width: cell, height: cell },
                      emoji === selected && styles.cellSelected,
                    ]}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: Math.round(cell * 0.6),
                        lineHeight: Math.round(cell * 0.75),
                      }}
                    >
                      {emoji}
                    </Text>
                  </RNPressable>
                ))}
              </View>
            )
          }
        />
      </View>
    </Modal>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SIDE_PADDING,
    paddingTop: 8,
    // iPad: la hoja es una columna centrada de 440 pt como máximo.
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
  searchBox: {
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.search,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchInput: { ...font('regular'), fontSize: 16, color: colors.textPrimary, padding: 0 },
  groupBar: { flexGrow: 0, marginTop: 8 },
  groupBarContent: { gap: 4, paddingVertical: 4 },
  groupButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  groupIcon: { fontSize: 22, lineHeight: 28 },
  header: { height: HEADER_HEIGHT, justifyContent: 'flex-end', paddingBottom: 6, paddingLeft: 4 },
  row: { flexDirection: 'row' },
  cell: { alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  cellSelected: { backgroundColor: colors.segment },
  empty: { textAlign: 'center', marginTop: 32 },
});
