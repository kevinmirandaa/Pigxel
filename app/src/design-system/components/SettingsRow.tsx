import { Children, isValidElement, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { iconSize, iconStroke, type LucideName } from '../icons';
import { EmojiBadge } from '../primitives/EmojiBadge';
import { Icon } from '../primitives/Icon';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { colors, layout, radii } from '../tokens';
import { Card } from './Card';
import { Toggle } from './Toggle';

export type SettingsTrailing = 'chevron' | 'check' | 'none';

export interface SettingsRowProps {
  title: string;
  /** Línea de detalle (12 Regular gris). */
  subtitle?: string;
  /** Ícono de línea dentro de caja 44×44 — pantallas de detalle. */
  icon?: LucideName;
  /** Ícono del menú principal de Ajustes dentro de caja 50×50. */
  menuIcon?: LucideName;
  /** Emoji del usuario dentro de la caja 44×44 (Categorías). */
  emoji?: string;
  trailing?: SettingsTrailing;
  /** Interruptor a la derecha (reemplaza al chevron). */
  toggle?: { value: boolean; onChange: (value: boolean) => void };
  /** Texto e ícono rojos (Eliminar cuenta). */
  destructive?: boolean;
  /** Contenido propio a la derecha (valor, etiqueta "Verificado"…). */
  right?: ReactNode;
  onPress?: () => void;
}

/**
 * Fila de ajustes (ancho flexible). Dos medidas del Figma:
 *  · detalle: alto 67, caja de ícono 44 a x=12, texto a x=68, chevron a 12 del borde derecho.
 *  · menú principal: caja de ícono 50 a x=8, texto a x=74.
 * Los textos largos se recortan; el chevron/interruptor nunca se mueve.
 */
export function SettingsRow({
  title,
  subtitle,
  icon,
  menuIcon,
  emoji,
  trailing = 'chevron',
  toggle,
  destructive = false,
  right,
  onPress,
}: SettingsRowProps) {
  const isMenu = Boolean(menuIcon);
  const box = isMenu ? layout.menuIconBox : layout.rowIconBox;
  const glyph = icon ?? menuIcon ?? emoji;
  const titleColor = destructive ? colors.expense : colors.textPrimary;

  const content = (
    <View
      style={[styles.row, { paddingLeft: glyph ? (isMenu ? 8 : layout.settingsRow.iconLeft) : 20 }]}
    >
      {glyph ? (
        <View
          style={[
            styles.iconBox,
            {
              width: box,
              height: box,
              backgroundColor: isMenu ? colors.menuIconBox : colors.iconBox,
            },
          ]}
        >
          {emoji ? (
            <EmojiBadge emoji={emoji} size={24} />
          ) : (
            <Icon
              name={glyph as LucideName}
              size={iconSize.settingsRow}
              color={destructive ? colors.expense : colors.black}
            />
          )}
        </View>
      ) : null}
      <View style={[styles.texts, glyph && { marginLeft: isMenu ? 16 : 12 }]}>
        <Text variant="rowLabel" style={{ color: titleColor }} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="rowDetail" tone="secondary" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
      {toggle ? (
        <Toggle value={toggle.value} onValueChange={toggle.onChange} accessibilityLabel={title} />
      ) : trailing === 'chevron' ? (
        <Icon
          name="chevron-right"
          size={iconSize.trailing}
          color={colors.chevron}
          strokeWidth={iconStroke.default}
        />
      ) : trailing === 'check' ? (
        <Icon name="check" size={20} color={colors.black} />
      ) : null}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      haptic={false}
      accessibilityRole="button"
      accessibilityLabel={[title, subtitle].filter(Boolean).join(', ')}
    >
      {content}
    </Pressable>
  );
}

export interface SettingsGroupProps {
  children: ReactNode;
  /** Los divisores empiezan bajo el texto: x=60 con ícono, x=20 sin ícono. */
  dividerInset?: 'icon' | 'noIcon' | number;
}

/** Tarjeta blanca (ancho flexible) con filas separadas por divisores de 1 pt `#EAEAEA` (el último no lleva). */
export function SettingsGroup({ children, dividerInset = 'icon' }: SettingsGroupProps) {
  const rows = Children.toArray(children).filter(isValidElement);
  const inset =
    typeof dividerInset === 'number'
      ? dividerInset
      : dividerInset === 'icon'
        ? layout.dividerInset.withIcon
        : layout.dividerInset.noIcon;
  return (
    <Card style={styles.group}>
      {rows.map((row, i) => (
        <View key={i}>
          {row}
          {i < rows.length - 1 ? <View style={[styles.divider, { marginLeft: inset }]} /> : null}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  group: { alignSelf: 'stretch' },
  row: {
    minHeight: layout.settingsRow.height,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: layout.settingsRow.chevronRight,
  },
  iconBox: { borderRadius: radii.rowIcon, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, minWidth: 0, justifyContent: 'center', paddingVertical: 14 },
  divider: { height: 1, backgroundColor: colors.divider },
});
