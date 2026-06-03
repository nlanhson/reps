import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

// Thin divider between list items (shadcn `<Separator />`). `inset` aligns
// it past a leading icon/avatar when rows have one.
export default function Separator({ inset = 0, style }) {
  return <View style={[styles.line, inset ? { marginLeft: inset } : null, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.hairline,
    marginVertical: spacing.xs,
  },
});
