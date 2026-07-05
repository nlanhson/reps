import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, useTypography } from '../theme';

// Circular profile avatar. Pass `uri` for a photo; otherwise renders the
// person's initials on a brand-tinted fill (same fallback pattern as iOS
// Contacts/Messages). `size` is a token name or a raw number.
const SIZES = { sm: 32, md: 48, lg: 96 };

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export default function Avatar({ name, uri, size = 'md' }) {
  const typography = useTypography();
  const d = SIZES[size] ?? size;
  const shape = { width: d, height: d, borderRadius: d / 2 };

  if (uri) {
    return <Image source={{ uri }} style={shape} />;
  }
  return (
    <View style={[shape, styles.fallback]}>
      <Text style={[typography.h3, { color: colors.textOnAccent, fontSize: d * 0.36 }]}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
