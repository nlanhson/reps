import { Switch } from 'react-native';
import { colors, useTier, useMaterialYou } from '../theme';

// Themed on/off switch for settings rows (e.g. kg/lb, sound & vibration).
// Wraps RN's native Switch — free platform-correct behavior + accessibility —
// tinted with the brand accent. On the material-you tier the "on" tint
// follows the device's dynamic palette instead of the fixed brand color.
export default function Toggle({ value, onValueChange, disabled = false }) {
  const tier = useTier();
  const scheme = useMaterialYou();
  const onTint = tier === 'material-you' && scheme ? scheme.primary : colors.accent;
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ true: onTint, false: colors.border }}
      thumbColor={colors.textPrimary}
      ios_backgroundColor={colors.border}
    />
  );
}
