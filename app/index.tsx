import { useState, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, HelperText, Snackbar, Card, Text, Divider } from 'react-native-paper';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SalesService } from '../src/services';
import type { Sale, DashboardStats } from '../src/types/models';

// Schema de validación
const saleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  amount: z.string().min(1, 'El monto es requerido'),
  quantity: z.string().optional(),
  unitPrice: z.string().optional(),
  client: z.string().optional(),
});

type SaleFormData = z.infer<typeof saleSchema>;

export default function NewSaleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [showExtraFields, setShowExtraFields] = useState(false);

  // Estado para el resumen
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    todayTotal: 0,
    monthSales: 0,
    monthTotal: 0,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      name: '',
      amount: '',
      quantity: '',
      unitPrice: '',
      client: '',
    },
  });

  const loadData = async () => {
    try {
      const [allSales, dashboardStats] = await Promise.all([
        SalesService.getAll(),
        SalesService.getDashboardStats(),
      ]);
      setRecentSales(allSales.slice(0, 3));
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onSubmit = async (data: SaleFormData) => {
    try {
      setIsLoading(true);

      await SalesService.create({
        name: data.name,
        amount: parseFloat(data.amount),
        quantity: data.quantity ? parseFloat(data.quantity) : null,
        unitPrice: data.unitPrice || null,
        client: data.client || null,
      });

      setSnackbarType('success');
      setSnackbarMessage('Venta registrada correctamente');
      setSnackbarVisible(true);
      reset();
      setShowExtraFields(false);
      loadData();
    } catch (error) {
      console.error('Error al crear venta:', error);
      setSnackbarType('error');
      setSnackbarMessage('No se pudo registrar la venta');
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Stats Row */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text variant="labelSmall" style={styles.statLabel}>Hoy</Text>
                <Text variant="headlineMedium" style={styles.statNumberPrimary}>
                  {stats.todaySales}
                </Text>
                <Text variant="bodySmall" style={styles.statAmountPrimary}>
                  {formatCurrency(stats.todayTotal)}
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text variant="labelSmall" style={styles.statLabel}>Mes</Text>
                <Text variant="headlineMedium" style={styles.statNumberSecondary}>
                  {stats.monthSales}
                </Text>
                <Text variant="bodySmall" style={styles.statAmountSecondary}>
                  {formatCurrency(stats.monthTotal)}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Recent Sales */}
        {recentSales.length > 0 && (
          <View style={styles.recentSection}>
            <Card>
              <Card.Content>
                <View style={styles.recentHeader}>
                  <Text variant="titleMedium" style={styles.recentTitle}>Últimas ventas</Text>
                  <TouchableOpacity onPress={() => router.push('/all-history')}>
                    <Text style={styles.viewMoreText}>Ver más →</Text>
                  </TouchableOpacity>
                </View>

                {recentSales.map((sale, index) => (
                  <View key={sale.id}>
                    {index > 0 && <Divider style={styles.divider} />}
                    <View style={styles.saleItem}>
                      <View style={styles.saleInfo}>
                        <Text variant="bodyMedium" style={styles.saleName}>{sale.name}</Text>
                        <Text variant="bodySmall" style={styles.saleDetails}>
                          {formatDate(sale.createdAt)} • {sale.quantity} unid.
                        </Text>
                      </View>
                      <Text variant="titleMedium" style={styles.saleAmount}>
                        {formatCurrency(sale.amount)}
                      </Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Form */}
        <View style={styles.formSection}>
          <Card>
            <Card.Content>
              <Text variant="titleLarge" style={styles.formTitle}>Nueva Venta</Text>

              {/* Nombre del item */}
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label="Nombre del item *"
                      mode="outlined"
                      placeholder="Ej: Aceite 10W40"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.name}
                      left={<TextInput.Icon icon="shopping" />}
                      style={styles.input}
                    />
                    {errors.name && (
                      <HelperText type="error" visible={!!errors.name}>
                        {errors.name.message}
                      </HelperText>
                    )}
                  </>
                )}
              />

              {/* Monto total */}
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label="Monto total *"
                      mode="outlined"
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.amount}
                      left={<TextInput.Icon icon="currency-usd" />}
                      style={styles.input}
                    />
                    {errors.amount && (
                      <HelperText type="error" visible={!!errors.amount}>
                        {errors.amount.message}
                      </HelperText>
                    )}
                  </>
                )}
              />

              {/* Cantidad */}
              <Controller
                control={control}
                name="quantity"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label="Cantidad"
                      mode="outlined"
                      placeholder="0"
                      keyboardType="decimal-pad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.quantity}
                      left={<TextInput.Icon icon="package-variant" />}
                      style={styles.input}
                    />
                    {errors.quantity && (
                      <HelperText type="error" visible={!!errors.quantity}>
                        {errors.quantity.message}
                      </HelperText>
                    )}
                  </>
                )}
              />

              {/* Botón para mostrar campos extras */}
              <Button
                mode="text"
                icon={showExtraFields ? 'chevron-up' : 'chevron-down'}
                onPress={() => setShowExtraFields(!showExtraFields)}
                style={styles.toggleButton}
                contentStyle={styles.toggleButtonContent}
              >
                {showExtraFields ? 'Ocultar campos opcionales' : 'Agregar más detalles'}
              </Button>

              {/* Campos opcionales expandibles */}
              {showExtraFields && (
                <View style={styles.extraFields}>
                  {/* Precio unitario */}
                  <Controller
                    control={control}
                    name="unitPrice"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Precio unitario (opcional)"
                        mode="outlined"
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        left={<TextInput.Icon icon="receipt" />}
                        style={styles.input}
                      />
                    )}
                  />

                  {/* Cliente */}
                  <Controller
                    control={control}
                    name="client"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Cliente (opcional)"
                        mode="outlined"
                        placeholder="Nombre del cliente"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        left={<TextInput.Icon icon="account" />}
                        style={styles.input}
                      />
                    )}
                  />
                </View>
              )}

              {/* Botón guardar */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
                icon="content-save"
                style={styles.saveButton}
                contentStyle={styles.saveButtonContent}
              >
                {isLoading ? 'Guardando...' : 'Guardar Venta'}
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarType === 'success' ? '#10b981' : '#ef4444',
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  statLabel: {
    color: '#6b7280',
  },
  statNumberPrimary: {
    color: '#3182ce',
    fontWeight: 'bold',
  },
  statNumberSecondary: {
    color: '#f97316',
    fontWeight: 'bold',
  },
  statAmountPrimary: {
    color: '#1e40af',
    fontWeight: '600',
  },
  statAmountSecondary: {
    color: '#c2410c',
    fontWeight: '600',
  },
  recentSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontWeight: 'bold',
  },
  viewMoreText: {
    color: '#3182ce',
    fontWeight: '600',
  },
  divider: {
    marginVertical: 8,
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saleInfo: {
    flex: 1,
  },
  saleName: {
    fontWeight: '600',
  },
  saleDetails: {
    color: '#9ca3af',
  },
  saleAmount: {
    color: '#3182ce',
    fontWeight: 'bold',
  },
  formSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  formTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
    marginTop: 8,
  },
  toggleButton: {
    marginTop: 8,
  },
  toggleButtonContent: {
    flexDirection: 'row-reverse',
  },
  extraFields: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 16,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
});
