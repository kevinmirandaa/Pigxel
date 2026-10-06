import { StyleSheet, View } from 'react-native';

import { Screen } from './Screen';
import { Text } from './Text';

export interface ScreenPlaceholderProps {
  /** Nombre del archivo en design-spec (sin extensión), ej. "auth-bienvenida". */
  name: string;
}

/** Marcador temporal de la Fase 4. Se reemplaza al construir cada pantalla en la Fase 7. */
export function ScreenPlaceholder({ name }: ScreenPlaceholderProps) {
  return (
    <Screen>
      <View style={styles.center}>
        <Text variant="title">{name}</Text>
        <Text variant="caption" tone="secondary">
          design-spec/app-screens/{name}.png
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
});
