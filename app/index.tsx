import { View, Text } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-bold text-primary-400">
        RRVendor
      </Text>
      <Text className="text-lg text-gray-600 mt-4">
        Romero Repuestos
      </Text>
      <Text className="text-sm text-accent-500 mt-2">
        Sistema de Gestión de Ventas
      </Text>
    </View>
  );
}
