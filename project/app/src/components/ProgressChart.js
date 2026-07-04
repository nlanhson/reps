import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, typography, spacing } from '../theme';

// Single-series progress chart (Workout Detail): orange line + soft gradient
// area over a recessive 3-line grid, per the design screenshot. Axis text uses
// text tokens (never the series color); the series is the brand accent.
// Static/decorative for now — no touch layer until real history data lands.

const GUTTER = 52; // left gutter for y-axis labels ("10k kg" must fit one line)
const MARK_R = 3.5;
const LABEL_H = 18; // x-axis label strip

// Smallest "nice" ceiling (1/2/4/5/10 × power of ten) ≥ max, so the midline
// (half of it) is also a clean number.
function niceCeil(max) {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  for (const m of [1, 2, 4, 5, 10]) {
    if (m * pow >= max) return m * pow;
  }
  return 10 * pow;
}

const fmt = (v) => (v >= 1000 ? `${v / 1000}k` : `${v}`);

export default function ProgressChart({ labels, values, unit, height = 150 }) {
  const [width, setWidth] = useState(0);

  const plotW = width - GUTTER;
  const plotH = height - LABEL_H;
  const top = MARK_R + 3; // keep markers + top gridline label inside
  const bottom = plotH - MARK_R;
  const max = niceCeil(Math.max(...values));

  const x = (i) => GUTTER + MARK_R + (i * (plotW - MARK_R * 2)) / (values.length - 1);
  const y = (v) => bottom - (v / max) * (bottom - top);

  const pts = values.map((v, i) => ({ x: x(i), y: y(v) }));
  const lineD = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
  const areaD = `${lineD} L${pts[pts.length - 1].x} ${bottom} L${pts[0].x} ${bottom} Z`;

  const gridValues = [max, max / 2, 0];

  return (
    <View style={{ height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <>
          <Svg width={width} height={plotH}>
            <Defs>
              <LinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.accent} stopOpacity="0.35" />
                <Stop offset="1" stopColor={colors.accent} stopOpacity="0.02" />
              </LinearGradient>
            </Defs>
            {gridValues.map((v) => (
              <Line
                key={v}
                x1={GUTTER}
                x2={width}
                y1={y(v)}
                y2={y(v)}
                stroke={colors.hairline}
                strokeWidth={StyleSheet.hairlineWidth * 2}
              />
            ))}
            <Path d={areaD} fill="url(#areaFill)" />
            <Path d={lineD} stroke={colors.accent} strokeWidth={2} fill="none" strokeLinejoin="round" />
            {pts.map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r={MARK_R} fill={colors.accent} />
            ))}
          </Svg>
          {/* y-axis labels in the gutter, aligned to their gridline */}
          {gridValues.map((v) => (
            <Text
              key={v}
              style={[
                typography.label,
                styles.yLabel,
                { top: y(v) - typography.label.lineHeight / 2 },
              ]}
            >
              {fmt(v)} {unit}
            </Text>
          ))}
          <View style={styles.xRow}>
            {labels.map((l) => (
              <Text key={l} style={[typography.label, styles.xLabel]}>
                {l}
              </Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  yLabel: {
    position: 'absolute',
    left: 0,
    width: GUTTER - spacing.xs,
    color: colors.textMuted,
  },
  xRow: {
    height: LABEL_H,
    marginLeft: GUTTER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  xLabel: { color: colors.textMuted },
});
