import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

import { FormSheet } from './FormSheet';
import { PrimaryButton } from './PrimaryButton';

export interface InfoSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  closeLabel?: string;
}

/** Hoja informativa: contenido con scroll (máx. 55 % del alto) y botón Cerrar. */
export function InfoSheet({
  visible,
  title,
  onClose,
  children,
  closeLabel = 'Cerrar',
}: InfoSheetProps) {
  const { height } = useWindowDimensions();
  return (
    <FormSheet visible={visible} title={title} onClose={onClose}>
      <ScrollView
        style={{ maxHeight: Math.round(height * 0.55) }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      <PrimaryButton label={closeLabel} withArrow={false} onPress={onClose} />
    </FormSheet>
  );
}

const styles = StyleSheet.create({ content: { gap: 16, paddingBottom: 4 } });
