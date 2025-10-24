import "../global.css";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { initializeDatabase } from "../src/database/connection";
import { runMigrations } from "../src/database/migrate";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Inicializar base de datos
        await initializeDatabase();

        // Ejecutar migraciones
        await runMigrations();

        setIsReady(true);
      } catch (e) {
        console.error('Error al inicializar la app:', e);
        setError(e instanceof Error ? e.message : 'Error desconocido');
      }
    }

    prepare();
  }, []);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500 text-lg font-bold mb-2">Error</Text>
        <Text className="text-gray-600 text-center">{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3182ce" />
        <Text className="text-gray-600 mt-4">Inicializando base de datos...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
