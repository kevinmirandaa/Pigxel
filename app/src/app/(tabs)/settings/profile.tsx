// design-spec: app-screens/ajustes-informacion-personal.png · screens/ajustes-informacion-personal.png
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  CardField,
  Content,
  FormSheet,
  Icon,
  InlineMessage,
  PillInput,
  PrimaryButton,
  Screen,
  ScreenHeader,
  SettingsGroup,
  Text,
  colors,
} from '@/design-system';
import {
  fullNameSchema,
  phoneSchema,
  useProfile,
  useUpdateProfile,
  usernameSchema,
} from '@/features/settings';

type EditField = 'fullName' | 'username' | 'phone';

const FIELDS = {
  fullName: { title: 'Nombre completo', schema: fullNameSchema, keyboard: 'default' as const },
  username: { title: 'Nombre de usuario', schema: usernameSchema, keyboard: 'default' as const },
  phone: { title: 'Teléfono', schema: phoneSchema, keyboard: 'phone-pad' as const },
};

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useProfile();
  const update = useUpdateProfile();
  const [editing, setEditing] = useState<EditField | null>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const p = profile.data;

  const open = (field: EditField) => {
    setDraft(field === 'phone' ? (p?.phone ?? '') : (p?.[field] ?? ''));
    setError(null);
    update.reset();
    setEditing(field);
  };
  const save = () => {
    if (!editing) return;
    const parsed = FIELDS[editing].schema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Valor no válido');
      return;
    }
    const value = String(parsed.data);
    const patch =
      editing === 'phone' ? { phone: value === '' ? null : value } : { [editing]: value };
    update.mutate(patch, { onSuccess: () => setEditing(null) });
  };

  return (
    <Screen scroll tabBar>
      <ScreenHeader
        title="Información personal"
        onBack={() => goBackOr(router, '/(tabs)/settings')}
      />
      <Content style={styles.body}>
        {profile.isPending ? (
          <ActivityIndicator color={colors.textSecondary} />
        ) : !p ? (
          <InlineMessage>No pudimos cargar tu información. Inténtalo de nuevo.</InlineMessage>
        ) : (
          <>
            <View style={styles.hero}>
              <View style={styles.avatar}>
                <Icon name="user-round" size={40} color={colors.iconMuted} />
              </View>
              <Text variant="heading" numberOfLines={1}>
                {p.fullName}
              </Text>
              <Text variant="caption" tone="secondary" numberOfLines={1}>
                {p.email}
              </Text>
            </View>
            <SettingsGroup dividerInset={0}>
              <CardField
                label="Nombre completo"
                value={p.fullName}
                onPress={() => open('fullName')}
              />
              <CardField
                label="Nombre de usuario"
                value={p.username}
                onPress={() => open('username')}
              />
              <CardField
                label="Correo electrónico"
                value={p.email}
                onPress={() => router.push('/(tabs)/settings/email')}
              />
              <CardField
                label="Teléfono"
                value={p.phone ?? undefined}
                emptyText="Agregar"
                onPress={() => open('phone')}
              />
            </SettingsGroup>
          </>
        )}
      </Content>
      <FormSheet
        visible={editing !== null}
        title={editing ? FIELDS[editing].title : ''}
        onClose={() => setEditing(null)}
      >
        <PillInput
          value={draft}
          onChangeText={(t) => {
            setDraft(t);
            setError(null);
          }}
          placeholder={editing ? FIELDS[editing].title : undefined}
          keyboardType={editing ? FIELDS[editing].keyboard : 'default'}
          autoCapitalize={editing === 'fullName' ? 'words' : 'none'}
          autoCorrect={false}
          autoFocus
          error={error ?? undefined}
          returnKeyType="done"
          onSubmitEditing={save}
        />
        <PrimaryButton label="Guardar" loading={update.isPending} onPress={save} />
        {update.error ? <InlineMessage>{update.error.message}</InlineMessage> : null}
      </FormSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 20, gap: 24 },
  hero: { alignItems: 'center', gap: 6 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.headerIconBox,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
});
