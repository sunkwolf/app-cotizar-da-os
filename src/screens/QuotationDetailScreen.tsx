import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, QuotationStatus } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    if (onOk) onOk();
  } else {
    Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
  }
};

type QuotationDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QuotationDetail'>;
  route: RouteProp<RootStackParamList, 'QuotationDetail'>;
};

const getStatusStyle = (status: QuotationStatus) => {
  switch (status) {
    case 'pendiente':
      return { backgroundColor: Colors.warningLight, color: Colors.warning };
    case 'aprobada':
      return { backgroundColor: Colors.successLight, color: Colors.success };
    case 'rechazada':
      return { backgroundColor: Colors.errorLight, color: Colors.error };
    default:
      return { backgroundColor: Colors.grayLight, color: Colors.gray };
  }
};

const getStatusText = (status: QuotationStatus) => {
  switch (status) {
    case 'pendiente':
      return 'Pendiente';
    case 'aprobada':
      return 'Aprobada';
    case 'rechazada':
      return 'Rechazada';
    default:
      return status;
  }
};

export default function QuotationDetailScreen({ navigation, route }: QuotationDetailScreenProps) {
  const { quotation } = route.params;
  const { profile } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<QuotationStatus>(quotation.status);
  const [updating, setUpdating] = useState(false);

  const handleChangeStatus = async (newStatus: QuotationStatus) => {
    if (newStatus === currentStatus) return;

    console.log('Changing status to:', newStatus, 'for quotation:', quotation.id);
    
    setUpdating(true);
    const { data, error } = await supabase
      .from('quotations')
      .update({ status: newStatus })
      .eq('id', quotation.id)
      .select();

    console.log('Update result - data:', data, 'error:', error);
    setUpdating(false);

    if (error) {
      showAlert('Error', `No se pudo actualizar el estado: ${error.message}`);
      console.error('Error updating status:', error);
      return;
    }

    if (!data || data.length === 0) {
      showAlert('Error', 'No se encontró la cotización o no tienes permisos');
      return;
    }

    setCurrentStatus(newStatus);
    showAlert('Éxito', 'Estado actualizado correctamente');
  };

  const handleArchive = async () => {
    console.log('Archiving quotation:', quotation.id);
    
    setUpdating(true);
    const { data, error } = await supabase
      .from('quotations')
      .update({ archived: true })
      .eq('id', quotation.id)
      .select();

    console.log('Archive result - data:', data, 'error:', error);
    setUpdating(false);

    if (error) {
      showAlert('Error', `No se pudo archivar: ${error.message}`);
      console.error('Error archiving:', error);
      return;
    }

    if (!data || data.length === 0) {
      showAlert('Error', 'No se encontró la cotización o no tienes permisos');
      return;
    }

    showAlert('Éxito', 'Cotización archivada correctamente', () => navigation.goBack());
  };

  const handleDelete = async () => {
    console.log('Deleting quotation:', quotation.id);
    
    setUpdating(true);
    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('id', quotation.id);

    console.log('Delete result - error:', error);
    setUpdating(false);

    if (error) {
      showAlert('Error', `No se pudo eliminar: ${error.message}`);
      console.error('Error deleting:', error);
      return;
    }

    showAlert('Éxito', 'Cotización eliminada correctamente', () => navigation.goBack());
  };

  const statusStyle = getStatusStyle(currentStatus);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Cotización</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Company Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {getStatusText(currentStatus)}
            </Text>
          </View>
        </View>

        {/* User Info */}
        {(quotation.userMobile || quotation.userShortName) && (
          <View style={styles.userCard}>
            <Ionicons name="person-circle" size={24} color={Colors.primary} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{quotation.userShortName}</Text>
              <Text style={styles.userMobile}>{quotation.userMobile}</Text>
            </View>
          </View>
        )}

        {/* Vehicle Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Número de Siniestro</Text>
              <Text style={styles.infoValue}>{quotation.siniestroNumber}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{quotation.date}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Marca</Text>
              <Text style={styles.infoValue}>{quotation.vehicleBrand}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Modelo</Text>
              <Text style={styles.infoValue}>{quotation.vehicleModel}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Año</Text>
              <Text style={styles.infoValue}>{quotation.vehicleYear}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tipo</Text>
              <Text style={[styles.infoValue, { color: quotation.type === 'cliente' ? Colors.secondary : Colors.primary }]}>
                {quotation.type === 'cliente' ? 'Cliente' : 'Contraparte'}
              </Text>
            </View>
          </View>
        </View>

        {/* Parts List */}
        <View style={styles.partsSection}>
          {quotation.laminadoParts.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Laminado y Pintura</Text>
              {quotation.laminadoParts.map((item, index) => (
                <View key={index} style={styles.partItem}>
                  <Ionicons name="color-palette" size={16} color={Colors.primary} />
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partPrice}>${item.price.toLocaleString()}</Text>
                </View>
              ))}
            </>
          )}

          {quotation.replacementParts.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Refacciones</Text>
              {quotation.replacementParts.map((item: any, index: number) => (
                <View key={index} style={styles.replacementPartItem}>
                  <View style={styles.partMainRow}>
                    <Ionicons name="construct" size={16} color={Colors.secondary} />
                    <Text style={styles.partName}>{item.name}</Text>
                    <Text style={styles.partPrice}>${item.price.toLocaleString()}</Text>
                  </View>
                  {item.mercadoLibreUrl && (
                    <TouchableOpacity 
                      style={styles.linkRow}
                      onPress={() => Linking.openURL(item.mercadoLibreUrl)}
                    >
                      <Ionicons name="link" size={14} color={Colors.primary} />
                      <Text style={styles.linkText} numberOfLines={1}>
                        Ver en Mercado Libre
                      </Text>
                      <Ionicons name="open-outline" size={14} color={Colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </>
          )}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal Laminado</Text>
            <Text style={styles.totalValue}>${quotation.subtotalLaminado.toLocaleString()}</Text>
          </View>
          {quotation.subtotalRepuestos > 0 && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal Repuestos</Text>
                <Text style={styles.totalValue}>${quotation.subtotalRepuestos.toLocaleString()}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Mano de Obra</Text>
                <Text style={styles.totalValue}>${quotation.manoDeObraInstalacion.toLocaleString()}</Text>
              </View>
            </>
          )}
          {quotation.adjustment > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Ajuste (20%)</Text>
              <Text style={styles.totalValue}>${quotation.adjustment.toLocaleString()}</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>${quotation.total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Admin Actions */}
        {profile?.is_admin && (
          <View style={styles.adminSection}>
            <Text style={styles.adminTitle}>Acciones de Administrador</Text>
            <Text style={styles.adminSubtitle}>Cambiar estado de la cotización:</Text>
            
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  currentStatus === 'pendiente' && styles.statusButtonActive,
                  { borderColor: Colors.warning },
                ]}
                onPress={() => handleChangeStatus('pendiente')}
                disabled={updating}
              >
                <Text style={[styles.statusButtonText, { color: Colors.warning }]}>
                  Pendiente
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  currentStatus === 'aprobada' && styles.statusButtonActive,
                  { borderColor: Colors.success },
                ]}
                onPress={() => handleChangeStatus('aprobada')}
                disabled={updating}
              >
                <Text style={[styles.statusButtonText, { color: Colors.success }]}>
                  Aprobada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  currentStatus === 'rechazada' && styles.statusButtonActive,
                  { borderColor: Colors.error },
                ]}
                onPress={() => handleChangeStatus('rechazada')}
                disabled={updating}
              >
                <Text style={[styles.statusButtonText, { color: Colors.error }]}>
                  Rechazada
                </Text>
              </TouchableOpacity>
            </View>

            {updating && (
              <ActivityIndicator style={{ marginTop: 12 }} color={Colors.primary} />
            )}

            {/* Archive and Delete buttons */}
            <View style={styles.dangerActions}>
              <TouchableOpacity
                style={styles.archiveButton}
                onPress={handleArchive}
                disabled={updating}
              >
                <Ionicons name="archive" size={18} color={Colors.warning} />
                <Text style={styles.archiveButtonText}>Archivar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
                disabled={updating}
              >
                <Ionicons name="trash" size={18} color={Colors.error} />
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  logo: {
    width: 60,
    height: 60,
  },
  statusContainer: {
    alignItems: 'center',
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  userMobile: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: Colors.infoLight,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  partsSection: {
    backgroundColor: Colors.white,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  partItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  replacementPartItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  partMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 28,
    gap: 6,
  },
  linkText: {
    fontSize: 13,
    color: Colors.primary,
    flex: 1,
  },
  partName: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    marginLeft: 12,
  },
  partPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  totalsSection: {
    backgroundColor: Colors.white,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    color: Colors.text,
  },
  grandTotalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  grandTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  adminSection: {
    backgroundColor: Colors.white,
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  adminSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: Colors.grayLight,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dangerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  archiveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.warning,
    gap: 8,
  },
  archiveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
});
