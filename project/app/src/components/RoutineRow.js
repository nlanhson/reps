import { Pressable, View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, typography, gradients, spacing } from '../theme';
import Card from './Card';

// A routine/workout list row as seen on Home: dark gradient card (with the
// shared hairline border + soft shadow) showing the workout name, an
// "N exercises" subtitle, and a trailing play affordance.
export default function RoutineRow({ name, subtitle, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
      <Card gradient={gradients.surface} style={styles.row}>
        <View style={styles.text}>
          <Text style={[typography.h6, { color: colors.textPrimary }]} numberOfLines={1}>
            {name}
          </Text>
          {subtitle ? (
            <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Icon name="play" size={20} color={colors.textPrimary} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { flex: 1 },
});
