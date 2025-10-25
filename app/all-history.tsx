import { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { Card, Text, ActivityIndicator, Chip, Appbar, IconButton, Dialog, Portal, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SalesService } from '../src/services';
import type { Sale } from '../src/types/models';

export default function AllHistoryScreen() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      const allSales = await SalesService.getAll();
      setSales(allSales);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleDeletePress = (sale: Sale) => {
    setSaleToDelete(sale);
    setDeleteDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!saleToDelete) return;

    try {
      setIsDeleting(true);
      await SalesService.delete(saleToDelete.id);
      await loadData();
      setDeleteDialogVisible(false);
      setSaleToDelete(null);
    } catch (error) {
      console.error('Error al eliminar venta:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogVisible(false);
    setSaleToDelete(null);
  };

  useEffect(() => {
    loadData();
  }, []);

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
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;

    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#3182ce' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Historial Completo" />
      </Appbar.Header>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Cargando ventas...</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: '#f9fafb' }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={['#3182ce']}
              tintColor="#3182ce"
            />
          }
        >
          <View style={{ padding: 16 }}>
            <Text variant="titleLarge" style={{ marginBottom: 12, fontWeight: 'bold' }}>
              Todas las ventas ({sales.length})
            </Text>

            {sales.length === 0 ? (
              <Card>
                <Card.Content style={{ alignItems: 'center', padding: 32 }}>
                  <Text variant="headlineSmall" style={{ color: '#6b7280', marginBottom: 8 }}>
                    No hay ventas registradas
                  </Text>
                  <Text variant="bodyMedium" style={{ color: '#9ca3af', textAlign: 'center' }}>
                    Las ventas que registres{'\n'}aparecerán aquí
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              sales.map((sale) => (
                <Card key={sale.id} style={{ marginBottom: 12 }}>
                  <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <View style={{ flex: 1 }}>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 4 }}>
                          {sale.name}
                        </Text>
                        <Text variant="bodySmall" style={{ color: '#9ca3af' }}>
                          {formatDate(sale.createdAt)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text variant="headlineSmall" style={{ color: '#3182ce', fontWeight: 'bold' }}>
                          {formatCurrency(sale.amount)}
                        </Text>
                        <IconButton
                          icon="delete"
                          iconColor="#ef4444"
                          size={20}
                          onPress={() => handleDeletePress(sale)}
                        />
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                      {sale.quantity && (
                        <Chip icon="package-variant" mode="flat" style={{ backgroundColor: '#f3f4f6' }}>
                          {sale.quantity} unid.
                        </Chip>
                      )}

                      {sale.unitPrice && (
                        <Chip icon="currency-usd" mode="flat" style={{ backgroundColor: '#f3f4f6' }}>
                          ${sale.unitPrice} c/u
                        </Chip>
                      )}

                      {sale.client && (
                        <Chip icon="account" mode="flat" style={{ backgroundColor: '#dbeafe' }}>
                          <Text style={{ color: '#1e40af' }}>{sale.client}</Text>
                        </Chip>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        </ScrollView>
      )}

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={handleCancelDelete}>
          <Dialog.Title>Eliminar venta</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              ¿Estás seguro que deseas eliminar esta venta?
            </Text>
            {saleToDelete && (
              <View style={{ marginTop: 12, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {saleToDelete.name}
                </Text>
                <Text variant="bodyLarge" style={{ color: '#3182ce', fontWeight: 'bold', marginTop: 4 }}>
                  {formatCurrency(saleToDelete.amount)}
                </Text>
              </View>
            )}
            <Text variant="bodySmall" style={{ color: '#ef4444', marginTop: 12 }}>
              Esta acción no se puede deshacer.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCancelDelete} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button
              onPress={handleConfirmDelete}
              loading={isDeleting}
              disabled={isDeleting}
              textColor="#ef4444"
            >
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
