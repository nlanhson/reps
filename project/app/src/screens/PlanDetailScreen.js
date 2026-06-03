import ScreenPlaceholder from '../components/ScreenPlaceholder';

export default function PlanDetailScreen({ navigation }) {
  return (
    <ScreenPlaceholder
      title="Plan Detail"
      subtitle="A training split (e.g. 6-Day Split): the day's workouts."
      actions={[
        { label: 'Open Workout Detail →', onPress: () => navigation.navigate('WorkoutDetail') },
      ]}
    />
  );
}
