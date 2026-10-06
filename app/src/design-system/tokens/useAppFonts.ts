import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { useFonts } from 'expo-font';
import { Platform } from 'react-native';

/** Carga Nunito solo fuera de iOS (iOS usa SF Pro Rounded del sistema). Devuelve true al terminar. */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts(
    Platform.OS === 'ios' ? {} : { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold },
  );
  return loaded || error != null;
}
