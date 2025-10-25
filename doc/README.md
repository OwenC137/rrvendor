# 🚗 RRVendor - Sistema de Gestión de Ventas
## Romero Repuestos

Aplicación móvil **Android** para registro y gestión de ventas de autopartes.

**Plataforma**: Android Only (optimizado para tablets y smartphones)

---

## 📚 Documentación Disponible

### 📘 **DOCUMENTACION_COMPLETA.md** ⭐
**Documento principal consolidado** que incluye:
- Stack tecnológico completo
- Guía de instalación paso a paso
- Estructura del proyecto
- Modelo de datos (SQL + TypeScript)
- Funcionalidades del MVP
- Diseño y branding de Romero Repuestos
- Plan de implementación (75 tareas)
- Guía rápida de Gluestack UI v3

### 📗 **GLUESTACK_V3_GUIA.md**
Guía específica de Gluestack UI v3:
- Diferencias entre v2 y v3
- Instalación y configuración
- Comandos del CLI
- Personalización para el proyecto
- Ejemplos de código
- Problemas conocidos y soluciones

### 📱 **DEPLOYMENT_ANDROID.md**
Guía completa de deployment Android:
- Configuración EAS Build para Android
- Local builds y distribución privada
- OTA Updates workflow
- Métodos de distribución interna
- Backup y export de datos

---

## 🚀 Quick Start

```bash
# 1. Crear proyecto
npx create-expo-app@latest rrvendor --template blank-typescript
cd rrvendor

# 2. Instalar NativeWind (requerido)
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npx tailwindcss init

# 3. Instalar dependencias React Native
npx expo install react-native-svg react-native-safe-area-context react-native-reanimated

# 4. Inicializar Gluestack UI v3
npx gluestack-ui@latest init

# 5. Instalar base de datos
npx expo install expo-sqlite
npm install drizzle-orm
npm install --save-dev drizzle-kit

# 6. Instalar navegación
npx expo install expo-router react-native-screens expo-linking expo-constants expo-status-bar

# 7. Instalar estado
npm install zustand @tanstack/react-query

# 8. Instalar formularios
npm install react-hook-form zod @hookform/resolvers

# 9. Ejecutar
npm start
```

---

## 🛠️ Stack Tecnológico

```
Platform:    Android Only
Core:        Expo SDK 53 + React Native + TypeScript + Expo Router
UI:          Gluestack UI v3 (copy-paste) + NativeWind v4
Database:    SQLite + Drizzle ORM
State:       Zustand + TanStack Query
Forms:       react-hook-form + Zod
Distribution: EAS Build (local) + OTA Updates
```

---

## 🎨 Diseño - Romero Repuestos

**Colores corporativos:**
- **Azul primario**: #3182ce (confianza, automotriz)
- **Naranja acento**: #f97316 (energía, velocidad)

**Identidad:**
- Logo: "RR" con elementos automotrices
- Tagline: "Tu confianza en movimiento"

---

## ✨ Funcionalidades MVP

- 📦 **Gestión de Autopartes**: CRUD completo
- 💰 **Registro de Ventas**: Carrito, precios diferenciados
- 🔍 **Búsqueda**: Tiempo real, filtros
- 📊 **Historial**: Ventas por fecha, reportes
- 🏠 **Dashboard**: Métricas y accesos rápidos

---

## 📋 Plan de Implementación

**13 Fases | 75 Tareas**

1. Configuración del Proyecto (5)
2. Sistema de Base de Datos (5)
3. Componentes UI Base (5)
4. Gestión de Autopartes (8)
5. Sistema de Búsqueda (4)
6. Sistema de Ventas (9)
7. Historial de Ventas (5)
8. Dashboard (6)
9. Personalización de Marca (5)
10. Optimización y Performance (5)
11. Testing (6)
12. Preparación para Producción (8)
13. Documentación (4)

Ver **DOCUMENTACION_COMPLETA.md** para el detalle de cada tarea.

---

## 💾 Modelo de Datos

### Tablas SQLite
- **parts**: Autopartes (nombre, precios, stock)
- **sales**: Ventas (número, total, cliente)
- **sale_items**: Items de venta (relación many-to-many)

Ver schema completo en **DOCUMENTACION_COMPLETA.md**

---

## ⚡ Gluestack UI v3 - Copy-Paste

**Importante**: Gluestack UI v3 NO es una dependencia npm tradicional.

Los componentes se **copian** a tu proyecto con el CLI:

```bash
# Agregar componentes
npx gluestack-ui add button
npx gluestack-ui add card
npx gluestack-ui add input
```

Se guardan en: `src/components/ui/<component-name>/`

**Ventaja**: Control total del código, puedes modificar cualquier cosa.

Ver **GLUESTACK_V3_GUIA.md** para más detalles.

---

## 📁 Estructura del Proyecto

```
rrvendor/
├── app/                    # Expo Router (navegación)
│   ├── (tabs)/            # Tabs: home, inventory, search, history
│   ├── sale/              # Pantallas de ventas
│   └── part/              # Pantallas de autopartes
├── src/
│   ├── components/
│   │   ├── ui/            # Gluestack UI v3 (copiados)
│   │   └── custom/        # Componentes personalizados
│   ├── database/          # SQLite + Drizzle
│   ├── services/          # Lógica de negocio
│   ├── hooks/             # Custom hooks
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript types
├── assets/
├── tests/
└── global.css
```

---

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests E2E (Maestro)
maestro test
```

---

## 📦 Build y Deployment Android

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Configurar (una sola vez)
eas build:configure

# Build local para distribución privada
eas build --platform android --profile preview --local

# OTA Update (sin rebuild)
eas update --branch preview --message "Descripción del cambio"
```

Ver **DEPLOYMENT_ANDROID.md** para guía completa de distribución privada.

---

## ⚠️ Notas Importantes

1. **Android Only** - Enfoque exclusivo en plataforma Android
2. **Distribución privada** - EAS Build local + self-hosting
3. **Usar Expo SDK 53** (no 54) - mejor compatibilidad con Gluestack UI v3
4. **Gluestack UI v3** usa copy-paste, no es npm package
5. **NativeWind v4** es requerido para Gluestack UI v3
6. **SQLite** para persistencia local (offline-first)
7. **OTA Updates** para actualizaciones instantáneas sin rebuild

---

## 📖 Recursos

- **Expo Docs**: https://docs.expo.dev/
- **Gluestack UI**: https://gluestack.io/ui/docs
- **NativeWind**: https://www.nativewind.dev/
- **Drizzle ORM**: https://orm.drizzle.team/
- **React Query**: https://tanstack.com/query/latest

---

## 📞 Info del Proyecto

**Cliente**: Romero Repuestos
**Aplicación**: RRVendor
**Plataforma**: Android Only
**Distribución**: Privada (Internal)
**Versión**: 1.0 (MVP)
**Fecha**: Octubre 2025
**Estado**: En Planificación  

---

## 🤝 Comenzar el Desarrollo

1. **Leer** DOCUMENTACION_COMPLETA.md
2. **Instalar** dependencias (ver Quick Start arriba)
3. **Seguir** el plan de implementación fase por fase
4. **Consultar** GLUESTACK_V3_GUIA.md cuando uses componentes UI

---

*¡Listo para digitalizar las ventas de Romero Repuestos! 🚀*
