import ScreenPlaceholder from '../components/ScreenPlaceholder';

export default function ProfileScreen({ navigation }) {
  return (
    <ScreenPlaceholder
      title="Profile"
      subtitle="Your stats and account."
      actions={[
        { label: 'Open Settings →', onPress: () => navigation.navigate('Settings') },
      ]}
    />
  );
}
