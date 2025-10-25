# 🚗 RRVendor - Documentación Completa del Proyecto
## Sistema de Gestión de Ventas para Romero Repuestos

**Cliente**: Romero Repuestos
**Aplicación**: RRVendor MVP
**Plataforma**: Android Only
**Distribución**: Privada (Internal)
**Fecha**: Octubre 2025
**Stack**: Expo + React Native + TypeScript + Gluestack UI v3 + SQLite

---

## 📋 TABLA DE CONTENIDOS

1. [Stack Tecnológico](#stack-tecnológico)
2. [Instalación Inicial](#instalación-inicial)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Modelo de Datos](#modelo-de-datos)
5. [Funcionalidades MVP](#funcionalidades-mvp)
6. [Diseño y Branding](#diseño-y-branding)
7. [Plan de Implementación](#plan-de-implementación)
8. [Gluestack UI v3](#gluestack-ui-v3)

---

## 🛠️ STACK TECNOLÓGICO

### Plataforma
- **Android Only** (Optimizado para smartphones y tablets Android)

### Core Framework
- **Expo SDK 53** (recomendado - mejor compatibilidad con Gluestack UI v3)
- **React Native** con Nueva Arquitectura
- **TypeScript** (Strict mode)
- **Expo Router** (File-based routing)

### UI Framework
- **Gluestack UI v3** (Copy-paste components)
- **NativeWind v4** (Tailwind CSS para React Native)
- **React Native Reanimated** (Animaciones)
- **React Native Gesture Handler** (Touch interactions)

### Base de Datos
- **expo-sqlite** (SQLite local)
- **Drizzle ORM** (Type-safe queries)
- **expo-drizzle-studio-plugin** (Database explorer)

### Estado y Navegación
- **Zustand** (Global state)
- **TanStack Query** (Server state & cache)
- **Expo Router** (Built-in navigation)

### Formularios y Validación
- **react-hook-form** (Forms)
- **zod** (Schema validation)

### Build y Distribución
- **EAS Build** (Local builds para Android)
- **EAS Update** (OTA updates - actualizaciones instantáneas)
- **Self-hosting** (Google Drive / Firebase / Servidor propio)

---

## 🚀 INSTALACIÓN INICIAL

### Paso 1: Crear Proyecto Expo
```bash
npx create-expo-app@latest rrvendor --template blank-typescript
cd rrvendor
```

### Paso 2: Instalar Gluestack UI v3

**IMPORTANTE**: Gluestack UI v3 NO es una dependencia npm. Usa un CLI que copia componentes a tu proyecto.

```bash
# 1. Instalar NativeWind (REQUERIDO)
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npx tailwindcss init

# 2. Instalar dependencias React Native
npx expo install react-native-svg
npx expo install react-native-safe-area-context
npx expo install react-native-reanimated

# 3. Inicializar Gluestack UI v3
npx gluestack-ui@latest init
```

El comando `npx gluestack-ui init` configurará:
- ✅ tailwind.config.js
- ✅ babel.config.js con plugins
- ✅ metro.config.js con NativeWind
- ✅ nativewind-env.d.ts
- ✅ global.css
- ✅ Estructura de carpetas

### Paso 3: Instalar Base de Datos
```bash
npx expo install expo-sqlite
npm install drizzle-orm
npm install --save-dev drizzle-kit
npm install --save-dev expo-drizzle-studio-plugin
```

### Paso 4: Instalar Navegación (Expo Router)
```bash
npx expo install expo-router react-native-safe-area-context
npx expo install react-native-screens expo-linking expo-constants expo-status-bar
```

### Paso 5: Instalar Estado
```bash
npm install zustand
npm install @tanstack/react-query
```

### Paso 6: Instalar Formularios
```bash
npm install react-hook-form zod @hookform/resolvers
npm install date-fns
```

### Paso 7: Dev Tools
```bash
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev eslint-config-prettier eslint-plugin-prettier prettier
```

### Paso 8: Agregar Componentes Base de Gluestack
```bash
npx gluestack-ui add button
npx gluestack-ui add input
npx gluestack-ui add card
npx gluestack-ui add badge
npx gluestack-ui add text
npx gluestack-ui add heading
npx gluestack-ui add form-control
npx gluestack-ui add spinner
```

### Paso 9: Configurar EAS Build (Deployment)
```bash
npm install -g eas-cli
eas login
eas build:configure
# Seleccionar solo Android cuando pregunte
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
rrvendor/
├── app/                          # Expo Router
│   ├── (tabs)/                   # Navegación principal
│   │   ├── index.tsx             # 🏠 Dashboard
│   │   ├── inventory.tsx         # 📦 Inventario
│   │   ├── search.tsx            # 🔍 Búsqueda
│   │   └── history.tsx           # 📊 Historial
│   ├── _layout.tsx               # Layout principal
│   ├── sale/
│   │   ├── new.tsx               # Nueva venta
│   │   └── [id].tsx              # Detalle venta
│   └── part/
│       ├── new.tsx               # Nueva autoparte
│       ├── [id].tsx              # Detalle autoparte
│       └── edit/[id].tsx         # Editar autoparte
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Gluestack UI v3 (copiados)
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── input/
│   │   │   └── ...
│   │   ├── custom/               # Componentes personalizados
│   │   ├── sales/
│   │   ├── parts/
│   │   └── layout/
│   │
│   ├── database/
│   │   ├── schema.ts             # Drizzle schema
│   │   ├── connection.ts         # SQLite connection
│   │   └── migrations/
│   │
│   ├── services/
│   │   ├── parts.service.ts
│   │   ├── sales.service.ts
│   │   └── search.service.ts
│   │
│   ├── hooks/
│   │   ├── useParts.ts
│   │   ├── useSales.ts
│   │   └── useSearch.ts
│   │
│   ├── store/
│   │   ├── salesStore.ts
│   │   └── partsStore.ts
│   │
│   ├── types/
│   │   └── models.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   └── config/
│       └── theme.ts
│
├── assets/
├── tests/
├── global.css
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 💾 MODELO DE DATOS

### Base de Datos SQLite

#### Tabla: `parts` (Autopartes)
```sql
CREATE TABLE parts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  unit_price REAL NOT NULL,
  wholesale_price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT,
  brand TEXT,
  sku TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1
);

CREATE INDEX idx_parts_name ON parts(name);
CREATE INDEX idx_parts_sku ON parts(sku);
```

#### Tabla: `sales` (Ventas)
```sql
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  sale_number TEXT UNIQUE NOT NULL,
  total_amount REAL NOT NULL,
  payment_method TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_date ON sales(created_at);
```

#### Tabla: `sale_items` (Items de venta)
```sql
CREATE TABLE sale_items (
  id TEXT PRIMARY KEY,
  sale_id TEXT NOT NULL,
  part_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  price_type TEXT NOT NULL,
  subtotal REAL NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE RESTRICT
);
```

### TypeScript Types
```typescript
export interface Part {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
  wholesalePrice: number;
  stock: number;
  category?: string;
  brand?: string;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Sale {
  id: string;
  saleNumber: string;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: Date;
  items: SaleItem[];
}

export interface SaleItem {
  id: string;
  saleId: string;
  partId: string;
  part?: Part;
  quantity: number;
  unitPrice: number;
  priceType: 'unit' | 'wholesale';
  subtotal: number;
}
```

---

## ✨ FUNCIONALIDADES MVP

### 1. 📦 Gestión de Autopartes
- ✅ Crear autoparte (nombre, precios, stock)
- ✅ Listar autopartes
- ✅ Editar autoparte
- ✅ Eliminar autoparte (soft delete)
- ✅ Ver detalle de autoparte

### 2. 💰 Registro de Ventas
- ✅ Nueva venta con carrito
- ✅ Buscar y agregar autopartes
- ✅ Seleccionar precio (unitario/mayorista)
- ✅ Calcular totales automáticamente
- ✅ Datos opcionales de cliente
- ✅ Confirmación y guardado
- ✅ Actualización automática de stock

### 3. 🔍 Búsqueda
- ✅ Búsqueda por nombre
- ✅ Búsqueda por SKU
- ✅ Resultados en tiempo real
- ✅ Filtros básicos

### 4. 📊 Historial
- ✅ Lista de ventas por fecha
- ✅ Detalle de venta
- ✅ Filtros por fecha
- ✅ Resumen de totales

### 5. 🏠 Dashboard
- ✅ Ventas del día
- ✅ Ventas del mes
- ✅ Estado del inventario
- ✅ Accesos rápidos

---

## 🎨 DISEÑO Y BRANDING - ROMERO REPUESTOS

### Paleta de Colores
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e6f2',
          200: '#b3cde0',
          300: '#6ea8d9',
          400: '#3182ce',  // Azul automotriz
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
          500: '#f97316',  // Naranja
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
    },
  },
};
```

### Tipografía
- **Headings**: Inter Bold / Poppins Bold
- **Body**: Inter Regular / Roboto
- **Monospace**: Roboto Mono (SKUs)

### Identidad Visual
- Logo: "RR" estilizado con elementos automotrices
- Colores corporativos: Azul (#3182ce) + Naranja (#f97316)
- Iconografía: Lucide Icons / Phosphor Icons
- Tagline: "Tu confianza en movimiento"

---

## 📋 PLAN DE IMPLEMENTACIÓN (75 TAREAS)

### FASE 1: Configuración (6 tareas)
1. ✅ Inicialización del proyecto Expo
2. ✅ Configuración de Gluestack UI v3
3. ✅ Configuración de TypeScript
4. ✅ Configuración de base de datos
5. ✅ Configuración de navegación
6. ✅ Configuración de EAS Build (Android)

### FASE 2: Base de Datos (5 tareas)
7. Modelado de datos
8. Schema de SQLite con Drizzle
9. Migraciones
10. Servicios de BD
11. Testing de BD

### FASE 3: UI Base (5 tareas)
12. Sistema de diseño
13. Componentes básicos de Gluestack
14. Componentes de formulario
15. Componentes de layout
16. Componentes de feedback

### FASE 4: Autopartes (8 tareas)
17. Modelo y tipos
18. Servicio de autopartes
19. Hook useParts
20. Pantalla de lista
21. Componente PartCard
22. Pantalla de detalle
23. Formulario nueva autoparte
24. Formulario edición

### FASE 5: Búsqueda (4 tareas)
25. Servicio de búsqueda
26. Componente SearchBar
27. Pantalla de búsqueda
28. Integración de búsqueda

### FASE 6: Ventas (9 tareas)
29. Modelo y tipos de ventas
30. Servicio de ventas
31. Hook useSales
32. Componente carrito
33. Selector de productos
34. Cálculos
35. Pantalla nueva venta
36. Confirmación
37. Feedback post-venta

### FASE 7: Historial (5 tareas)
38. Pantalla de historial
39. Componente SaleCard
40. Pantalla detalle venta
41. Filtros
42. Resumen de totales

### FASE 8: Dashboard (6 tareas)
43. Diseño del dashboard
44. Componente MetricCard
45. Métricas del día
46. Métricas del mes
47. Estado del inventario
48. Accesos rápidos

### FASE 9: Branding (5 tareas)
49. Logo y branding
50. Tema personalizado
51. Tipografía
52. Iconografía
53. Animaciones

### FASE 10: Optimización (5 tareas)
54. Optimización de listas
55. Optimización de BD
56. Gestión de memoria
57. Bundle size Android
58. Caché

### FASE 11: Testing (6 tareas)
59. Setup de testing
60. Tests servicios
61. Tests hooks
62. Tests componentes
63. Tests integración
64. Tests E2E (Android)

### FASE 12: Producción Android (9 tareas)
65. Manejo de errores
66. Validaciones
67. Backup y restore (Android)
68. Onboarding
69. EAS Build config (Android only)
70. App icons y splash (Android)
71. Permisos Android
72. Build local y testing
73. Configurar OTA Updates

### FASE 13: Documentación (4 tareas)
74. README
75. Docs API/Servicios
76. Guía de deployment Android
77. Manual de usuario

**TOTAL: 77 TAREAS** (ajustado para Android-only + EAS)

---

## 🎯 GLUESTACK UI V3 - GUÍA RÁPIDA

### ¿Qué es Gluestack UI v3?
NO es una librería npm tradicional. Es un **sistema copy-paste** donde los componentes se copian directamente a tu proyecto.

### Ventajas
- ✅ Control total del código
- ✅ Sin vendor lock-in
- ✅ Bundle más pequeño
- ✅ TypeScript nativo

### Comandos Esenciales
```bash
# Inicializar (una sola vez)
npx gluestack-ui@latest init

# Agregar componentes
npx gluestack-ui add button
npx gluestack-ui add card
npx gluestack-ui add input

# Ver componentes disponibles
npx gluestack-ui help
```

### Dónde se Guardan
Los componentes se copian a: `src/components/ui/<component-name>/`

### Uso en Código
```typescript
import { Button, ButtonText } from "@/components/ui/button";

<Button className="bg-primary-400">
  <ButtonText>Guardar</ButtonText>
</Button>
```

### Personalización
Modifica directamente los archivos en `src/components/ui/` - tienes control total.

### ⚠️ Problema Conocido
Hay issues reportados con **Expo SDK 54** y componentes overlay.

**Solución**: Usar **Expo SDK 53** (última estable antes de 54)

---

## 🚀 INICIAR DESARROLLO

### 1. Clonar/Crear Proyecto
```bash
npx create-expo-app@latest rrvendor --template blank-typescript
cd rrvendor
```

### 2. Instalar Todo
```bash
# Seguir pasos de "INSTALACIÓN INICIAL" arriba
```

### 3. Ejecutar
```bash
npm start
# Presiona 'i' para iOS o 'a' para Android
```

### 4. Desarrollo
Seguir el plan de implementación fase por fase.

---

## 📞 INFORMACIÓN DEL PROYECTO

**Cliente**: Romero Repuestos
**Aplicación**: RRVendor
**Objetivo**: Digitalizar ventas de autopartes
**Plataforma**: Android Only
**Distribución**: Privada (Internal)
**Modo**: Offline-first (SQLite)  

**Características**:
- 📦 Gestión de inventario
- 💰 Registro de ventas
- 🔍 Búsqueda de productos
- 📊 Historial y reportes
- 🏠 Dashboard con métricas

---

## 📚 RECURSOS

- **Expo**: https://docs.expo.dev/
- **Gluestack UI v3**: https://gluestack.io/ui/docs
- **NativeWind**: https://www.nativewind.dev/
- **Drizzle ORM**: https://orm.drizzle.team/
- **React Query**: https://tanstack.com/query/latest

---

*Documentación generada: Octubre 2025*
*Estado: En Planificación*
*Versión: 1.0*
