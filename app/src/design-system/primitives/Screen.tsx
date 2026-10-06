import type { ReactElement, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  type RefreshControlProps,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MAX_SCREEN_WIDTH, SCREEN_MARGIN, colors, layout } from '../tokens';

export interface ScreenProps {
  children: ReactNode;
  /** Contenido con scroll (listas largas, formularios). */
  scroll?: boolean;
  /** Deja espacio al final para no quedar bajo la barra flotante (pantallas con tab bar). */
  tabBar?: boolean;
  /** `page` = #F4F4F4 (tabs, Agregar, detalle) · `auth` = blanco (bienvenida, auth, 404). */
  background?: 'page' | 'auth';
  /** Elementos fijos sobre el contenido (p. ej. botón negro fijo abajo). */
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  /** Evita que el teclado tape los campos (formularios). */
  avoidKeyboard?: boolean;
  /** Control nativo de "tirar para actualizar" (solo con `scroll`). */
  refreshControl?: ReactElement<RefreshControlProps>;
}

/**
 * Contenedor de pantalla. El fondo ocupa TODO el ancho; el contenido vive en una columna centrada de
 * 440 pt como máximo (iPad), sin márgenes: los márgenes los pone `Content` (36 pt fijos) para que las
 * cabeceras de vidrio puedan ir pegadas a x=20.
 * Las posiciones `y` del Figma se miden desde el borde SUPERIOR DEL ÁREA SEGURA.
 */
export function Screen({
  children,
  scroll = false,
  tabBar = false,
  background = 'page',
  footer,
  contentStyle,
  avoidKeyboard = false,
  refreshControl,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const backgroundColor = background === 'auth' ? colors.authBg : colors.bg;
  const bottom = tabBar ? layout.tabBarClearance : Math.max(insets.bottom, 16) + 8;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.column,
        { paddingTop: insets.top, paddingBottom: bottom, flexGrow: 1 },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.flex,
        styles.column,
        { paddingTop: insets.top, paddingBottom: bottom },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  const content = (
    <View style={[styles.flex, { backgroundColor }]}>
      {body}
      {footer}
    </View>
  );
  if (!avoidKeyboard) return content;
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  );
}

export interface ContentProps {
  children: ReactNode;
  /** Margen lateral FIJO (36 por defecto; 51 en los botones de bienvenida; 39 en el menú de Ajustes). */
  margin?: number;
  style?: StyleProp<ViewStyle>;
}

/** Zona de contenido con margen lateral fijo: los hijos se ESTIRAN al ancho que queda (nunca un `width` fijo). */
export function Content({ children, margin = SCREEN_MARGIN, style }: ContentProps) {
  return (
    <View style={[{ paddingHorizontal: margin, alignSelf: 'stretch' }, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  /** Columna centrada de ancho máximo (iPad). En teléfonos (≤ 440) ocupa todo el ancho. */
  column: { width: '100%', maxWidth: MAX_SCREEN_WIDTH, alignSelf: 'center' },
});
