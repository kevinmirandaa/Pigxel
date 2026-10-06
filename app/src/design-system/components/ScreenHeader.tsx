import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../primitives/Text';
import { SCREEN_MARGIN, layout } from '../tokens';
import { GlassButton } from './GlassButton';

export interface ScreenHeaderProps {
  title: string;
  /** Pantallas de formulario/detalle: botón de vidrio "atrás" (y=20) y título bajo él (y=98). */
  onBack?: () => void;
  /** Acciones a la derecha (botones de vidrio). En detalle va en la fila del botón atrás (x=325, y=20). */
  right?: ReactNode;
  /** `tab` = pestañas principales: título 32 a la izquierda (39, 45) y acciones a la derecha (y=40). */
  variant?: 'detail' | 'tab';
}

/**
 * Cabecera de pantalla.
 *  · `detail` (por defecto): botón atrás + título 32 Bold (alto de línea 35) en x=36, y=98.
 *  · `tab`: título 32 Bold en (39, 45) y botones de vidrio a la derecha, solapados 8 pt como en Figma.
 */
export function ScreenHeader({ title, onBack, right, variant = 'detail' }: ScreenHeaderProps) {
  if (variant === 'tab') {
    return (
      <View style={styles.tabRow}>
        <Text variant="title" style={styles.tabTitle} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
        {right ? <View style={styles.tabActions}>{right}</View> : null}
      </View>
    );
  }
  return (
    <View>
      <View style={styles.topRow}>
        {onBack ? (
          <GlassButton icon="chevron-left" accessibilityLabel="Volver" onPress={onBack} />
        ) : (
          <View style={styles.backSpacer} />
        )}
        {right ? <View style={styles.detailActions}>{right}</View> : null}
      </View>
      <Text
        variant="detailTitle"
        style={styles.detailTitle}
        numberOfLines={2}
        accessibilityRole="header"
      >
        {title}
      </Text>
    </View>
  );
}

/**
 * Acciones de la cabecera (campana + "+" en Cuentas). En el Figma los botones de 50 se solapan 8 pt (x=283 y 325);
 * aquí van SEPARADOS con 10 pt limpios (normalización) y `overlap` permite recuperar el solape original.
 */
export function HeaderActions({
  children,
  overlap = false,
}: {
  children: ReactNode;
  overlap?: boolean;
}) {
  return <View style={[styles.actions, { gap: overlap ? -8 : 10 }]}>{children}</View>;
}

const styles = StyleSheet.create({
  topRow: {
    marginTop: layout.backButtonTop,
    paddingHorizontal: layout.backButtonLeft,
    height: layout.glassButtonSize,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backSpacer: { width: layout.glassButtonSize },
  detailActions: { marginRight: 7 },
  // El título está 28 pt bajo el botón (20 + 50 + 28 = 98).
  detailTitle: {
    marginTop: layout.titleTop - (layout.backButtonTop + layout.glassButtonSize),
    marginHorizontal: SCREEN_MARGIN,
  },
  tabRow: {
    marginTop: layout.tabTitleTop - 0,
    paddingLeft: layout.tabTitleLeft,
    paddingRight: layout.headerButtonsRight,
    height: 50,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tabTitle: { flexShrink: 1 },
  // Los botones están en y=40; el título, en y=45 → los botones suben 5 pt respecto al título.
  tabActions: { marginTop: layout.headerButtonsTop - layout.tabTitleTop },
  actions: { flexDirection: 'row', alignItems: 'center' },
});
