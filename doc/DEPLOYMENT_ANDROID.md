# 📱 Guía de Deployment Android - RRVendor
## Distribución Privada e Interna

**Proyecto**: RRVendor - Romero Repuestos
**Plataforma**: Android Only
**Tipo de Distribución**: Privada/Internal (sin Google Play Store)
**Método**: EAS Build + Local Builds + OTA Updates

---

## 📋 Tabla de Contenidos

1. [Configuración Inicial EAS](#configuración-inicial-eas)
2. [Builds Locales Android](#builds-locales-android)
3. [OTA Updates](#ota-updates)
4. [Métodos de Distribución](#métodos-de-distribución)
5. [Backup y Export](#backup-y-export)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Configuración Inicial EAS

### Paso 1: Instalar EAS CLI

```bash
# Instalar globalmente
npm install -g eas-cli

# Verificar instalación
eas --version
```

### Paso 2: Login en Expo

```bash
# Crear cuenta o login
eas login

# Verificar sesión
eas whoami
```

### Paso 3: Configurar Proyecto

```bash
# En la raíz del proyecto
eas build:configure

# Cuando pregunte por plataformas:
# ✅ Seleccionar SOLO Android
# ❌ NO seleccionar iOS
```

Esto creará dos archivos:
- `eas.json` - Configuración de builds
- `.easignore` - Archivos a ignorar en builds

---

## ⚙️ Configuración de eas.json

### Configuración Recomendada para RRVendor

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug",
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Explicación de Perfiles

- **development**: Para desarrollo, incluye Expo Dev Client
- **preview**: Para testing interno (recomendado para distribución privada)
- **production**: Para versión final (también privada en tu caso)

---

## 📦 Builds Locales Android

### ¿Por qué Builds Locales?

✅ **Control total** del APK
✅ **Privacidad** - APK en tu máquina
✅ **Distribución inmediata** - no esperas queue de Expo
✅ **Gratis** - sin límites de builds

### Build Local - Comando Básico

```bash
# Build de preview (recomendado para distribución privada)
eas build --platform android --profile preview --local

# El APK se genera en tu máquina
# Ubicación típica: ./build-xxxxxxxxxxxxx.apk
```

### Build Production Local

```bash
eas build --platform android --profile production --local
```

### Primera Build - Qué Esperar

La primera vez que hagas un build:

1. **Creará keystore automáticamente** (se guarda en Expo)
2. **Descargará dependencias** (puede tardar 10-15 minutos)
3. **Compilará el proyecto**
4. **Generará el APK**

Builds subsecuentes son más rápidas (5-10 minutos).

---

## 📱 Instalación del APK en Dispositivos

### Método 1: USB (Desarrollo)

```bash
# Con dispositivo conectado por USB
adb install build-xxxxxxxxxxxxx.apk

# Si hay versión anterior instalada
adb install -r build-xxxxxxxxxxxxx.apk
```

### Método 2: Compartir APK Directamente

1. **Copiar APK a Google Drive / Dropbox**
2. **Compartir link** con usuarios
3. Usuario descarga en Android
4. Usuario habilita "Fuentes desconocidas"
5. Usuario instala APK

### Método 3: Self-Hosting

#### Opción A: Firebase Hosting (Gratis)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar proyecto
firebase init hosting

# Copiar APK a public/
cp build-xxxxxxxxxxxxx.apk public/rrvendor-v1.0.0.apk

# Deploy
firebase deploy --only hosting

# Tu APK estará en:
# https://tu-proyecto.web.app/rrvendor-v1.0.0.apk
```

#### Opción B: GitHub Releases (Privado)

```bash
# En repo privado de GitHub
gh release create v1.0.0 build-xxxxxxxxxxxxx.apk \
  --title "RRVendor v1.0.0" \
  --notes "Release inicial"

# Compartir link del release (requiere acceso al repo)
```

---

## 🔄 OTA Updates (Over-The-Air)

### ¿Qué son las OTA Updates?

Las **OTA Updates** permiten actualizar el código JavaScript/TypeScript de tu app **sin generar un nuevo APK**.

**Casos de uso:**
- ✅ Fixes de bugs
- ✅ Cambios de UI
- ✅ Nueva lógica de negocio
- ✅ Actualización de texto/traducciones

**NO funciona para:**
- ❌ Agregar librerías nativas nuevas
- ❌ Cambiar permisos de Android
- ❌ Actualizar versión de React Native
- ❌ Cambios en `android/` folder

### Configuración de Updates

#### 1. Instalar expo-updates

```bash
npx expo install expo-updates
```

#### 2. Configurar app.json

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[your-project-id]"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

#### 3. Crear Branches

```bash
# Branch para preview
eas update:configure

# Esto preguntará por branches
# Crear: preview, production
```

### Publicar OTA Update

```bash
# Update para branch preview
eas update --branch preview --message "Fix en búsqueda de productos"

# Update para branch production
eas update --branch production --message "Mejoras en ventas"
```

### Cómo Reciben Updates los Usuarios

Los dispositivos **automáticamente descargan updates** cuando:
1. La app se reinicia
2. La app vuelve a primer plano después de 30 minutos

**O forzar check manual:**

```typescript
// En tu código
import * as Updates from 'expo-updates';

async function checkForUpdates() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.error('Error checking updates:', error);
  }
}
```

---

## 📋 Workflow Recomendado de Deployment

### Escenario 1: Primera Instalación

```bash
# 1. Build local
eas build --platform android --profile preview --local

# 2. Renombrar para versión
mv build-xxxxx.apk rrvendor-v1.0.0.apk

# 3. Subir a Drive/Firebase/etc
# (copiar a carpeta compartida)

# 4. Compartir link por WhatsApp/Email
```

### Escenario 2: Actualización Menor (Solo JS/UI)

```bash
# Sin rebuild - OTA Update
eas update --branch preview --message "Fix en cálculo de totales"

# Los dispositivos reciben el update automáticamente
# ¡Listo en segundos!
```

### Escenario 3: Actualización con Cambios Nativos

```bash
# Requiere nuevo APK
eas build --platform android --profile preview --local

# Renombrar y distribuir nueva versión
mv build-xxxxx.apk rrvendor-v1.1.0.apk

# Compartir con usuarios
# Deben desinstalar versión anterior e instalar nueva
```

---

## 💾 Backup y Export de Datos

### Export de Base de Datos SQLite

```typescript
// src/utils/backup.ts
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportDatabase() {
  try {
    // Ubicación de la BD SQLite
    const dbPath = `${FileSystem.documentDirectory}SQLite/rrvendor.db`;

    // Crear backup con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `rrvendor-backup-${timestamp}.db`;
    const backupPath = `${FileSystem.documentDirectory}${backupName}`;

    // Copiar BD
    await FileSystem.copyAsync({
      from: dbPath,
      to: backupPath
    });

    // Compartir (WhatsApp, Drive, Email, etc.)
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(backupPath, {
        mimeType: 'application/x-sqlite3',
        dialogTitle: 'Exportar Backup de Base de Datos'
      });
    }

    return backupPath;
  } catch (error) {
    console.error('Error exporting database:', error);
    throw error;
  }
}
```

### Import de Base de Datos

```typescript
// src/utils/backup.ts
import * as DocumentPicker from 'expo-document-picker';

export async function importDatabase() {
  try {
    // Seleccionar archivo
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/x-sqlite3',
      copyToCacheDirectory: true
    });

    if (result.type === 'success') {
      const dbPath = `${FileSystem.documentDirectory}SQLite/rrvendor.db`;

      // Copiar archivo seleccionado a ubicación de BD
      await FileSystem.copyAsync({
        from: result.uri,
        to: dbPath
      });

      console.log('Database imported successfully');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error importing database:', error);
    throw error;
  }
}
```

### Instalar Dependencias para Backup

```bash
npx expo install expo-file-system
npx expo install expo-sharing
npx expo install expo-document-picker
```

---

## 📝 Configuración de app.json para Android

### Configuración Completa Recomendada

```json
{
  "expo": {
    "name": "RRVendor",
    "slug": "rrvendor",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["android"],
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3182ce"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "android": {
      "package": "com.romerorepuestos.rrvendor",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3182ce"
      },
      "permissions": [
        "INTERNET",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ],
      "softwareKeyboardLayoutMode": "pan"
    },
    "plugins": [
      "expo-router",
      "expo-sqlite",
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 34,
            "targetSdkVersion": 34,
            "buildToolsVersion": "34.0.0"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "updates": {
      "url": "https://u.expo.dev/[your-project-id]"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "[your-project-id]"
      }
    }
  }
}
```

---

## 🎨 Assets Android

### Imágenes Necesarias

```
assets/
├── icon.png              # 1024x1024 (icono base)
├── adaptive-icon.png     # 1024x1024 (foreground)
├── splash.png            # 1284x2778 (splash screen)
└── favicon.png           # 48x48 (web favicon)
```

### Generar Icons Automáticamente

Puedes usar herramientas online:
- https://www.appicon.co/
- https://icon.kitchen/

O crear manualmente con las especificaciones de Android.

---

## 🔧 Troubleshooting

### Error: "Unable to find a matching configuration"

**Solución:**
```bash
# Limpiar caché
eas build:clear-cache

# Rebuild
eas build --platform android --profile preview --local --clear-cache
```

### Error: "Keystore not found"

**Solución:**
```bash
# Generar nuevo keystore
eas credentials

# Seleccionar Android > Set up a new key
```

### APK no instala - "App not installed"

**Causas comunes:**
1. Versión anterior con firma diferente
   - **Solución**: Desinstalar app anterior primero

2. Espacio insuficiente
   - **Solución**: Liberar espacio en dispositivo

3. Permisos de instalación
   - **Solución**: Habilitar "Instalar apps desconocidas" para Chrome/Files

### OTA Updates no funcionan

**Checklist:**
- ✅ `expo-updates` instalado
- ✅ `runtimeVersion` configurado en app.json
- ✅ Branch correcto en el build
- ✅ Update publicado en el mismo branch
- ✅ App se reinició después de publicar update

---

## 📊 Versionado

### Convención Recomendada

```
version: "X.Y.Z"
versionCode: incremental

X = Major (cambios grandes, breaking changes)
Y = Minor (nuevas features)
Z = Patch (bugs, fixes)
```

### Ejemplo de Evolución

```json
// v1.0.0 - Release inicial
{
  "version": "1.0.0",
  "android": {
    "versionCode": 1
  }
}

// v1.0.1 - Fix bugs (OTA Update posible)
{
  "version": "1.0.1",
  "android": {
    "versionCode": 1  // mismo versionCode
  }
}

// v1.1.0 - Nueva feature (requiere nuevo APK)
{
  "version": "1.1.0",
  "android": {
    "versionCode": 2  // incrementar
  }
}
```

---

## 📚 Recursos Adicionales

### Documentación Oficial
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Update**: https://docs.expo.dev/eas-update/introduction/
- **Internal Distribution**: https://docs.expo.dev/build/internal-distribution/

### Herramientas Útiles
- **ADB Commands**: https://developer.android.com/tools/adb
- **Firebase Hosting**: https://firebase.google.com/docs/hosting
- **App Icon Generator**: https://icon.kitchen/

---

## 🎯 Checklist de Deployment

### Primera Release

- [ ] Configurar EAS CLI
- [ ] Crear eas.json con perfil preview/production
- [ ] Configurar app.json con datos correctos
- [ ] Generar assets (icon, splash)
- [ ] Build local exitoso
- [ ] Testing en dispositivo físico
- [ ] Configurar método de distribución (Drive/Firebase/etc)
- [ ] Compartir APK con usuarios

### Updates Subsecuentes

#### Si es cambio JS/UI solo:
- [ ] Verificar que NO hay cambios nativos
- [ ] Publicar OTA Update
- [ ] Verificar que dispositivos reciben update

#### Si hay cambios nativos:
- [ ] Incrementar versionCode en app.json
- [ ] Generar nuevo build local
- [ ] Testing completo
- [ ] Distribuir nuevo APK
- [ ] Notificar usuarios para actualizar

---

## 💡 Tips y Best Practices

### 1. Nombrado de APKs
Usa nombres descriptivos con versión:
```
rrvendor-v1.0.0-preview.apk
rrvendor-v1.1.0-production.apk
```

### 2. Mantén Historial de APKs
Guarda todos los APKs en carpeta versionada:
```
builds/
├── v1.0.0/
│   └── rrvendor-v1.0.0.apk
├── v1.0.1/
│   └── rrvendor-v1.0.1.apk
└── v1.1.0/
    └── rrvendor-v1.1.0.apk
```

### 3. Testing Antes de Distribuir
Siempre testea en dispositivo físico antes de compartir.

### 4. Comunicación con Usuarios
Avisa a usuarios cuando haya:
- Nueva versión APK (requiere instalación)
- OTA Update importante (solo reiniciar app)

### 5. Backup Regular
Implementa backup automático de BD cada semana.

---

*Documentación actualizada: Octubre 2025*
*Proyecto: RRVendor - Romero Repuestos*
*Plataforma: Android Only*
