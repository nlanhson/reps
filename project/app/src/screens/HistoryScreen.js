import ScreenPlaceholder from '../components/ScreenPlaceholder';

export default function HistoryScreen({ navigation }) {
  return (
    <ScreenPlaceholder
      title="History"
      subtitle="Past workouts, grouped by date."
      actions={[
        { label: 'Open Calendar / Heatmap →', onPress: () => navigation.navigate('Calendar') },
      ]}
    />
  );
}
