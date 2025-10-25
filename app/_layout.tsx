import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { initializeDatabase } from "../src/database/connection";
import { runMigrations, resetDatabase } from "../src/database/migrate";
import { useOTAUpdates } from "../src/hooks/useOTAUpdates";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3182ce',
    secondary: '#f97316',
  },
};

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook para manejar OTA Updates automáticamente
  const { isDownloading } = useOTAUpdates();

  useEffect(() => {
    async function prepare() {
      try {
        // Inicializar base de datos
        await initializeDatabase();

        // TEMPORAL: Reset de la base de datos para actualizar el esquema
        // Esto eliminará todos los datos existentes
        //await resetDatabase();

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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingHorizontal: 16 }}>
        <Text style={{ color: '#ef4444', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Error</Text>
        <Text style={{ color: '#6b7280', textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#3182ce" />
        <Text style={{ color: '#6b7280', marginTop: 16 }}>
          {isDownloading ? 'Descargando actualización...' : 'Inicializando base de datos...'}
        </Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="all-history" />
      </Stack>
    </PaperProvider>
  );
}
