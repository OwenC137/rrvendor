# 🎨 Guía de Gluestack UI v3 - RRVendor
## Configuración y Uso para el Proyecto

**Plataforma**: Android Only
**Stack**: Expo SDK 53 + NativeWind v4 + Gluestack UI v3

---

## ⚠️ Diferencias Importantes: v2 vs v3

### Gluestack UI v3 - Enfoque Copy-Paste

Gluestack UI v3 NO es una dependencia npm tradicional. En su lugar, usa un CLI que copia los componentes directamente a tu proyecto, dándote control total sobre el código.

**Ventajas:**
- ✅ **Control Total**: Los componentes están en tu código fuente
- ✅ **Sin Vendor Lock-in**: Puedes modificar cualquier componente libremente
- ✅ **Bundle Más Pequeño**: Solo incluyes lo que usas
- ✅ **No hay actualizaciones forzadas**: Tú decides cuándo actualizar
- ✅ **TypeScript Nativo**: Todos los componentes están en TypeScript

**Desventajas:**
- ⚠️ Actualizaciones manuales de componentes
- ⚠️ Más archivos en tu repositorio

---

## 🚀 Instalación y Configuración

### Paso 1: Proyecto Expo Base
```bash
# Crear proyecto Expo con TypeScript
npx create-expo-app@latest rrvendor --template blank-typescript
cd rrvendor
```

### Paso 2: Instalar NativeWind v4
```bash
# NativeWind es REQUERIDO para Gluestack UI v3
npm install nativewind
npm install --save-dev tailwindcss@3.3.2

# Inicializar Tailwind
npx tailwindcss init
```

### Paso 3: Instalar Dependencias de React Native
```bash
# Dependencias necesarias para Gluestack UI
npx expo install react-native-svg
npx expo install react-native-safe-area-context
npx expo install react-native-reanimated
```

### Paso 4: Inicializar Gluestack UI v3
```bash
# Este comando configura toda la estructura
npx gluestack-ui@latest init
```

El comando `init` hará lo siguiente:
1. ✅ Configurará `tailwind.config.js`
2. ✅ Actualizará `babel.config.js` con plugins necesarios
3. ✅ Creará `metro.config.js` con configuración de NativeWind
4. ✅ Creará `nativewind-env.d.ts` para soporte TypeScript
5. ✅ Creará `global.css` con directivas de Tailwind
6. ✅ Configurará la estructura de carpetas para componentes UI

---

## 📦 Agregando Componentes

### Comando Básico
```bash
npx gluestack-ui add <component-name>
```

### Componentes Esenciales para RRVendor

#### UI Base
```bash
# Componentes que usaremos en el proyecto
npx gluestack-ui add button
npx gluestack-ui add input
npx gluestack-ui add card
npx gluestack-ui add badge
npx gluestack-ui add text
npx gluestack-ui add heading
npx gluestack-ui add divider
```

#### Formularios
```bash
npx gluestack-ui add form-control
npx gluestack-ui add checkbox
npx gluestack-ui add radio
npx gluestack-ui add select
npx gluestack-ui add textarea
```

#### Navegación y Feedback
```bash
npx gluestack-ui add modal
npx gluestack-ui add alert-dialog
npx gluestack-ui add toast
npx gluestack-ui add spinner
npx gluestack-ui add progress
```

#### Layout
```bash
npx gluestack-ui add box
npx gluestack-ui add hstack
npx gluestack-ui add vstack
npx gluestack-ui add center
```

### ¿Dónde se Guardan?
Los componentes se copian a: `src/components/ui/<component-name>/`

Ejemplo:
```
src/
└── components/
    └── ui/
        ├── button/
        │   ├── index.tsx
        │   └── styles.tsx
        ├── card/
        │   ├── index.tsx
        │   └── styles.tsx
        └── ...
```

---

## 🎨 Personalización para Romero Repuestos

### Configuración del Tema

Gluestack UI v3 usa Tailwind CSS tokens. Personaliza en `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores de Romero Repuestos
        primary: {
          50: '#f0f4f8',
          100: '#d9e6f2',
          200: '#b3cde0',
          300: '#6ea8d9',
          400: '#3182ce',  // Azul automotriz principal
          500: '#2563eb',
          600: '#1e40af',
          700: '#1e3a8a',
          800: '#1e2f5e',
          900: '#0f172a',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',  // Naranja principal
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        heading: ['Inter-Bold', 'sans-serif'],
        body: ['Inter-Regular', 'sans-serif'],
        mono: ['RobotoMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

---

## 🔧 Configuración de Archivos Clave

### babel.config.js
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }]
    ],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin", // DEBE ser el último
    ],
  };
};
```

### app/_layout.tsx (Root Layout)
```typescript
import "../global.css"; // IMPORTANTE: Importar CSS global
import { Stack } from "expo-router";
import "react-native-reanimated"; // Importar para Reanimated

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

---

## 📝 Uso de Componentes en el Código

### Ejemplo: Botón con Variantes
```typescript
import { Button, ButtonText } from "@/components/ui/button";

function MyScreen() {
  return (
    <>
      {/* Botón primario (azul) */}
      <Button className="bg-primary-400">
        <ButtonText>Guardar</ButtonText>
      </Button>

      {/* Botón acento (naranja) */}
      <Button className="bg-accent-500">
        <ButtonText>Nueva Venta</ButtonText>
      </Button>

      {/* Botón outline */}
      <Button variant="outline" className="border-primary-400">
        <ButtonText className="text-primary-400">Cancelar</ButtonText>
      </Button>
    </>
  );
}
```

### Ejemplo: Card Personalizado
```typescript
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

function PartCard({ part }) {
  return (
    <Card className="p-4 m-2 bg-white shadow-md">
      <Heading className="text-lg font-bold text-primary-700">
        {part.name}
      </Heading>
      <Text className="text-gray-600">{part.sku}</Text>
      <Text className="text-xl font-bold text-accent-500">
        ${part.unitPrice}
      </Text>
    </Card>
  );
}
```

---

## ⚠️ Problemas Conocidos y Soluciones

### Issue: Expo SDK 54 Compatibility
Hay reportes de problemas con Expo SDK 54 y componentes overlay (Modal, Drawer, Alert) en Gluestack UI v3.

**Solución:**
- Usar **Expo SDK 53** (última versión estable antes de 54)
- O esperar a que se resuelvan los issues en v3
- Monitorear: https://github.com/gluestack/gluestack-ui/issues/3200

```bash
# Usar Expo 53 (recomendado por ahora)
npx create-expo-app@latest rrvendor --template blank-typescript
# Luego verificar la versión de Expo en package.json
```

### Testing en Android
Para probar los componentes en Android:

```bash
# Modo desarrollo con Expo Go
npm start
# Escanear QR con Expo Go app

# O con development build
eas build --platform android --profile development
```

---

## 📚 Componentes Disponibles en v3

### Completos en v3
- ✅ Button
- ✅ Input
- ✅ Card
- ✅ Badge
- ✅ Text
- ✅ Heading
- ✅ Box, HStack, VStack
- ✅ Spinner
- ✅ Progress
- ✅ Divider
- ✅ Avatar
- ✅ Icon

### Con Overlays (verificar compatibilidad)
- ⚠️ Modal
- ⚠️ Alert Dialog
- ⚠️ Toast
- ⚠️ Drawer
- ⚠️ Menu
- ⚠️ Popover

---

## 📖 Recursos Adicionales

- **Documentación Oficial**: https://gluestack.io/ui/docs
- **GitHub**: https://github.com/gluestack/gluestack-ui
- **Discord**: https://discord.com/invite/95qQ84nf6f
- **Ejemplos**: https://github.com/gluestack/gluestack-ui-starter-kits

---

*Documento actualizado: Octubre 2025*
*Proyecto: RRVendor - Romero Repuestos*
