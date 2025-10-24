import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../database/connection';
import { sales } from '../database/schema';
import type { Sale, NewSale, DashboardStats } from '../types/models';

/**
 * Servicio para gestión de Ventas (simplificado)
 */
export const SalesService = {
  /**
   * Crear una nueva venta
   */
  async create(saleData: Omit<NewSale, 'id' | 'createdAt'>): Promise<Sale> {
    const [newSale] = await db.insert(sales).values(saleData).returning();
    return newSale;
  },

  /**
   * Obtener todas las ventas
   */
  async getAll(): Promise<Sale[]> {
    return await db.select().from(sales).orderBy(desc(sales.createdAt));
  },

  /**
   * Obtener venta por ID
   */
  async getById(id: string): Promise<Sale | undefined> {
    const [sale] = await db.select().from(sales).where(eq(sales.id, id)).limit(1);
    return sale;
  },

  /**
   * Obtener ventas por rango de fechas
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    return await db
      .select()
      .from(sales)
      .where(
        sql`${sales.createdAt} >= ${startTimestamp} AND ${sales.createdAt} <= ${endTimestamp}`
      )
      .orderBy(desc(sales.createdAt));
  },

  /**
   * Obtener ventas del día actual
   */
  async getToday(): Promise<Sale[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.getByDateRange(today, tomorrow);
  },

  /**
   * Obtener ventas del mes actual
   */
  async getThisMonth(): Promise<Sale[]> {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return await this.getByDateRange(firstDay, lastDay);
  },

  /**
   * Obtener estadísticas del dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const todaySales = await this.getByDateRange(today, tomorrow);
    const monthSales = await this.getByDateRange(firstDayOfMonth, lastDayOfMonth);

    return {
      todaySales: todaySales.length,
      todayTotal: todaySales.reduce((sum, sale) => sum + sale.amount, 0),
      monthSales: monthSales.length,
      monthTotal: monthSales.reduce((sum, sale) => sum + sale.amount, 0),
    };
  },

  /**
   * Eliminar venta
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(sales).where(eq(sales.id, id)).returning();
    return result.length > 0;
  },
};
