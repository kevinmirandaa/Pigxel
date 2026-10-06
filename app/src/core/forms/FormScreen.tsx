import { useRouter, type Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import { Content, InlineMessage, PrimaryButton, Screen, ScreenHeader } from '@/design-system';

export interface FormScreenProps {
  title: string;
  submitLabel: string;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** Error de red/servidor, bajo el botón. */
  error?: string | null;
  children: ReactNode;
}

/**
 * Esqueleto común de los formularios: cabecera con atrás, campos con margen 36, botón negro al final y
 * error del servidor debajo. Scroll + KeyboardAvoidingView para que el botón nunca quede tapado.
 */
export function FormScreen({
  title,
  submitLabel,
  onSubmit,
  loading = false,
  disabled = false,
  error,
  children,
}: FormScreenProps) {
  const router = useRouter();
  return (
    <Screen scroll avoidKeyboard>
      <ScreenHeader title={title} onBack={() => goBackOr(router, '/(tabs)')} />
      <Content style={styles.form}>
        {children}
        <View style={styles.action}>
          <PrimaryButton
            label={submitLabel}
            loading={loading}
            disabled={disabled}
            onPress={onSubmit}
          />
          {error ? <InlineMessage>{error}</InlineMessage> : null}
        </View>
      </Content>
    </Screen>
  );
}

/** Éxito de un formulario: háptico de éxito y vuelta a la raíz de la pestaña (cierra Agregar). */
export function useFinishForm() {
  const router = useRouter();
  return () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.dismissTo('/(tabs)' as Href);
  };
}

const styles = StyleSheet.create({
  form: { marginTop: 28, gap: 16 },
  action: { marginTop: 24, gap: 12 },
});
