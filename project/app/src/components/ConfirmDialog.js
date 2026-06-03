import { Modal, View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing, borderCurve } from '../theme';
import AppButton from './AppButton';

// Centered confirmation modal ("Popup/dark" sheet entry). Used for the
// discard-workout prompt. The confirm button is the destructive/primary
// orange; cancel is the subtle secondary.
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {title ? (
            <Text style={[typography.h6, styles.title]}>{title}</Text>
          ) : null}
          {message ? (
            <Text style={[typography.body, styles.message]}>{message}</Text>
          ) : null}
          <View style={styles.actions}>
            <AppButton label={confirmLabel} onPress={onConfirm} />
            <AppButton label={cancelLabel} variant="secondary" onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    borderCurve,
    padding: spacing.xl,
  },
  title: { color: colors.textPrimary, textAlign: 'center' },
  message: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  actions: { gap: spacing.sm },
});
