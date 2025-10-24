import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';

/**
 * Ejecutar migraciones de la base de datos
 */
export async function runMigrations() {
  try {
    console.log('Ejecutando migraciones...');

    const db = openDatabaseSync('rrvendor.db');
    const drizzleDb = drizzle(db);

    await migrate(drizzleDb, {
      migrationsFolder: './src/database/migrations',
    });

    console.log('Migraciones ejecutadas correctamente');
    return true;
  } catch (error) {
    console.error('Error al ejecutar migraciones:', error);
    throw error;
  }
}
