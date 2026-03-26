import { Stack } from 'expo-router';

export default function BatchesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Batches' }} />
      <Stack.Screen name="[id]" options={{ title: 'Batch Details', headerShown: true }} />
    </Stack>
  );
}