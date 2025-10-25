import { openDatabaseSync } from 'expo-sqlite';

/**
 * Reset completo de la base de datos (ELIMINA TODOS LOS DATOS)
 */
export async function resetDatabase() {
  try {
    console.log('Reseteando base de datos...');
    const db = openDatabaseSync('rrvendor.db');

    // Eliminar tabla existente
    await db.execAsync(`DROP TABLE IF EXISTS sales;`);

    console.log('Base de datos reseteada');
    return true;
  } catch (error) {
    console.error('Error al resetear base de datos:', error);
    throw error;
  }
}

/**
 * Ejecutar migraciones de la base de datos (creación manual de tablas)
 */
export async function runMigrations() {
  try {
    console.log('Ejecutando migraciones...');

    const db = openDatabaseSync('rrvendor.db');

    // Crear tabla sales si no existe
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        unit_price TEXT,
        quantity REAL,
        client TEXT,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL
      );
    `);

    console.log('Migraciones ejecutadas correctamente');
    return true;
  } catch (error) {
    console.error('Error al ejecutar migraciones:', error);
    throw error;
  }
}
