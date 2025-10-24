import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

// Abrir la base de datos SQLite
const expoDb = openDatabaseSync('rrvendor.db', { enableChangeListener: true });

// Crear instancia de Drizzle con el schema
export const db = drizzle(expoDb, { schema });

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    console.log('Inicializando base de datos...');

    // Crear las tablas si no existen
    await expoDb.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);

    console.log('Base de datos inicializada correctamente');
    return true;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Función para cerrar la base de datos (útil para testing)
export function closeDatabase() {
  expoDb.closeSync();
}
