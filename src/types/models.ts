import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { sales } from '../database/schema';

// Types para Sales (Ventas)
export type Sale = InferSelectModel<typeof sales>;
export type NewSale = InferInsertModel<typeof sales>;

// Type para estadísticas del dashboard
export type DashboardStats = {
  todaySales: number;
  todayTotal: number;
  monthSales: number;
  monthTotal: number;
};
