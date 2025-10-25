import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';

// Tabla: sales (Ventas simplificadas)
export const sales = sqliteTable('sales', {
  id: text('id').primaryKey().$defaultFn(() => Crypto.randomUUID()),
  name: text('name').notNull(), // Nombre del item vendido
  amount: real('amount').notNull(), // Monto total de la venta
  unitPrice: text('unit_price'), // Precio por unidad (opcional, campo libre)
  quantity: real('quantity'), // Cantidad de unidades vendidas (opcional)
  client: text('client'), // Nombre del cliente (opcional)
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});
