import ScreenPlaceholder from '../components/ScreenPlaceholder';

export default function WorkoutDetailScreen({ navigation }) {
  return (
    <ScreenPlaceholder
      title="Workout Detail"
      subtitle="Exercises in this workout, with a progress chart. Start to begin logging."
      actions={[
        { label: 'Start Workout →', onPress: () => navigation.navigate('InSession') },
      ]}
    />
  );
}
