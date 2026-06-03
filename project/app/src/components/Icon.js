import { Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// One icon component for the whole app. On iOS it renders the real Apple
// SF Symbol (the iOS system icon set); on Android — and if a symbol is
// unavailable on the device's iOS version — it falls back to the matching
// @expo/vector-icons glyph.
//
// `name` keys are the original vector-icon names already used across the app,
// so call sites only swap <Ionicons/> → <Icon/> without renaming.
const LIBS = { Ionicons, MaterialCommunityIcons };

// name → { sf: <SF Symbol>, fallback: [library, glyph] }
const MAP = {
  // actions
  add: { sf: 'plus', fallback: ['Ionicons', 'add'] },
  play: { sf: 'play.fill', fallback: ['Ionicons', 'play'] },
  checkmark: { sf: 'checkmark', fallback: ['Ionicons', 'checkmark'] },
  'options-outline': { sf: 'slider.horizontal.3', fallback: ['Ionicons', 'options-outline'] },
  'sort-variant': { sf: 'line.3.horizontal.decrease', fallback: ['MaterialCommunityIcons', 'sort-variant'] },
  'plus-box-outline': { sf: 'plus.app', fallback: ['MaterialCommunityIcons', 'plus-box-outline'] },
  'pin-outline': { sf: 'pin', fallback: ['MaterialCommunityIcons', 'pin-outline'] },
  'ellipsis-horizontal': { sf: 'ellipsis', fallback: ['Ionicons', 'ellipsis-horizontal'] },
  'ellipsis-vertical': { sf: 'ellipsis', fallback: ['Ionicons', 'ellipsis-vertical'] },

  // chevrons
  'chevron-back': { sf: 'chevron.left', fallback: ['Ionicons', 'chevron-back'] },
  'chevron-forward': { sf: 'chevron.right', fallback: ['Ionicons', 'chevron-forward'] },
  'chevron-down': { sf: 'chevron.down', fallback: ['Ionicons', 'chevron-down'] },
  'chevron-up': { sf: 'chevron.up', fallback: ['Ionicons', 'chevron-up'] },

  // glyphs
  'notifications-outline': { sf: 'bell', fallback: ['Ionicons', 'notifications-outline'] },
  'barbell-outline': { sf: 'dumbbell', fallback: ['Ionicons', 'barbell-outline'] },
  'person-outline': { sf: 'person', fallback: ['Ionicons', 'person-outline'] },
  'time-outline': { sf: 'clock', fallback: ['Ionicons', 'time-outline'] },
  'timer-outline': { sf: 'timer', fallback: ['Ionicons', 'timer-outline'] },
  'layers-outline': { sf: 'square.stack.3d.up', fallback: ['Ionicons', 'layers-outline'] },
  'volume-high-outline': { sf: 'speaker.wave.3', fallback: ['Ionicons', 'volume-high-outline'] },

  // tab bar
  home: { sf: 'house.fill', fallback: ['Ionicons', 'home'] },
  list: { sf: 'list.bullet', fallback: ['Ionicons', 'list'] },
  person: { sf: 'person.fill', fallback: ['Ionicons', 'person'] },
};

export default function Icon({ name, size = 24, color, weight = 'regular', style }) {
  const entry = MAP[name];
  const [lib, glyph] = entry?.fallback || ['Ionicons', name];
  const Fallback = LIBS[lib] || Ionicons;
  const fallbackEl = <Fallback name={glyph} size={size} color={color} style={style} />;

  if (Platform.OS === 'ios' && entry?.sf) {
    return (
      <SymbolView
        name={entry.sf}
        tintColor={color}
        weight={weight}
        resizeMode="scaleAspectFit"
        fallback={fallbackEl}
        style={[{ width: size, height: size }, style]}
      />
    );
  }

  return fallbackEl;
}
