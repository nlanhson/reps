import { useState } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import Icon from './Icon';
import { colors, useTypography, gradients, radius, spacing } from '../theme';

// Library folder card, shaped like an iOS folder: a lighter back sheet peeks
// out top-right behind a gradient front panel whose top-left tab shoulders
// down in an S-curve. Options icon top-right on the front panel; routine
// name + item count anchored bottom-left.

// Proportions of the folder silhouette, relative to card size.
const DROP = 0.16; // how far the right top edge sits below the tab (of height)
const TAB_END = 0.48; // where the flat tab ends (of width)
const SHOULDER = 0.16; // width of the S-curve shoulder (of width)

const STROKE = 1;
// SVG centers strokes on the path, so shapes flush with the canvas get their
// outer half clipped — inset the outline by half the stroke to keep it inside.
const INSET = STROKE / 2;

function folderPath(w, h) {
  const r = radius.lg - INSET;
  const drop = DROP * h;
  const tabEnd = TAB_END * w;
  const curve = SHOULDER * w;
  const left = INSET;
  const top = INSET;
  const right = w - INSET;
  const bottom = h - INSET;
  return [
    `M ${left} ${top + r}`,
    `A ${r} ${r} 0 0 1 ${left + r} ${top}`,
    `H ${tabEnd}`,
    `C ${tabEnd + curve * 0.55} ${top} ${tabEnd + curve * 0.45} ${drop} ${tabEnd + curve} ${drop}`,
    `H ${right - r}`,
    `A ${r} ${r} 0 0 1 ${right} ${drop + r}`,
    `V ${bottom - r}`,
    `A ${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    `H ${left + r}`,
    `A ${r} ${r} 0 0 1 ${left} ${bottom - r}`,
    'Z',
  ].join(' ');
}

export default function FolderCard({ name, items, onPress }) {
  const typography = useTypography();
  const [size, setSize] = useState(null);
  return (
    <Pressable
      onPress={onPress}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize({ width, height });
      }}
      style={({ pressed }) => [styles.cell, pressed && { opacity: 0.85 }]}
    >
      {size && (
        <Svg width={size.width} height={size.height} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="folderFront" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={gradients.surfaceElevated[0]} />
              <Stop offset="1" stopColor={gradients.surfaceElevated[1]} />
            </LinearGradient>
          </Defs>
          {/* Back sheet, separated from the front panel by the strokes alone */}
          <Rect
            x={INSET}
            y={INSET}
            width={size.width - STROKE}
            height={size.height - STROKE}
            rx={radius.lg - INSET}
            fill={gradients.surfaceElevated[0]}
            stroke={colors.hairlineBright}
            strokeWidth={STROKE}
          />
          {/* Mirrored horizontally: tab sits top-right, drop on the left */}
          <Path
            d={folderPath(size.width, size.height)}
            transform={`translate(${size.width},0) scale(-1,1)`}
            fill="url(#folderFront)"
            stroke={colors.hairlineBright}
            strokeWidth={STROKE}
          />
        </Svg>
      )}
      <Icon name="options-outline" size={18} color={colors.textMuted} style={styles.options} />

      <View style={styles.label}>
        <Text style={[typography.h6, { color: colors.textPrimary }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>{items} items</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { width: '48%', aspectRatio: 1.5, padding: spacing.lg },
  options: { position: 'absolute', top: spacing.md, right: spacing.md },
  label: { flex: 1, justifyContent: 'flex-end' },
});
