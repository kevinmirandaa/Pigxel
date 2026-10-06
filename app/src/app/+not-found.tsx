// design-spec: app-screens/error-404.png · screens/error-404.png
import { useRouter } from 'expo-router';

import { AuthHeader, Screen } from '@/design-system';

/** Ruta inexistente: "Error 404" con botón atrás de vidrio que vuelve al inicio. */
export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <Screen background="auth">
      <AuthHeader
        title="Error 404"
        subtitle="La aplicación no responde"
        onBack={() => router.replace('/')}
      />
    </Screen>
  );
}
