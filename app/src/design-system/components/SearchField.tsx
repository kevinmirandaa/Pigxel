import type { Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { iconSize, iconStroke } from '../icons';
import { Icon } from '../primitives/Icon';
import { colors, font, layout } from '../tokens';

export interface SearchFieldProps extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  ref?: Ref<TextInput>;
}

/** Buscador de Actividad: píldora de alto 53 `#EBEBEB` (ancho flexible) con lupa a la izquierda. */
export function SearchField({ placeholder = 'Buscar', ref, ...rest }: SearchFieldProps) {
  return (
    <View style={styles.box}>
      <View pointerEvents="none" style={styles.border} />
      <View pointerEvents="none" style={styles.icon}>
        <Icon
          name="search"
          size={iconSize.glass}
          color="#5E5E5F"
          strokeWidth={iconStroke.default}
        />
      </View>
      <TextInput
        ref={ref}
        {...rest}
        placeholder={placeholder}
        placeholderTextColor="#5E5E5F"
        accessibilityLabel={placeholder}
        returnKeyType="search"
        clearButtonMode="while-editing"
        selectionColor={colors.black}
        allowFontScaling={false}
        style={styles.input}
      />
    </View>
  );
}

const H = layout.search.height;
const styles = StyleSheet.create({
  box: {
    alignSelf: 'stretch',
    height: H,
    borderRadius: H / 2,
    backgroundColor: colors.search,
    justifyContent: 'center',
  },
  border: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: H / 2 + 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { position: 'absolute', left: 24 },
  input: {
    ...font('regular'),
    fontSize: 16,
    color: colors.textPrimary,
    height: H,
    paddingLeft: 60,
    paddingRight: 20,
    paddingVertical: 0,
  },
});
