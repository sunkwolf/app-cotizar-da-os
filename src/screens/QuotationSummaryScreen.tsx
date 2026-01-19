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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type QuotationSummaryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QuotationSummary'>;
  route: RouteProp<RootStackParamList, 'QuotationSummary'>;
};

export default function QuotationSummaryScreen({ navigation, route }: QuotationSummaryScreenProps) {
  const { quotationData } = route.params;
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const currentDate = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para guardar la cotización');
      return;
    }

    setSaving(true);
    
    const { error } = await supabase.from('quotations').insert({
      user_id: user.id,
      siniestro_number: quotationData.siniestroNumber,
      vehicle_brand: quotationData.vehicleBrand,
      vehicle_model: quotationData.vehicleModel,
      vehicle_year: quotationData.vehicleYear,
      type: quotationData.type,
      laminado_parts: quotationData.laminadoParts,
      replacement_parts: quotationData.replacementParts,
      subtotal_laminado: quotationData.subtotalLaminado,
      subtotal_repuestos: quotationData.subtotalRepuestos,
      mano_de_obra_instalacion: quotationData.manoDeObraInstalacion,
      adjustment: quotationData.adjustment,
      total: quotationData.total,
    });

    setSaving(false);

    if (error) {
      Alert.alert('Error', 'No se pudo guardar la cotización. Intenta de nuevo.');
      console.error('Error saving quotation:', error);
      return;
    }

    navigation.navigate('QuotationFinal', { quotationData });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resumen de Cotización</Text>
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

        {/* Vehicle Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Número de Siniestro</Text>
              <Text style={styles.infoValue}>{quotationData.siniestroNumber || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{currentDate}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Marca</Text>
              <Text style={styles.infoValue}>{quotationData.vehicleBrand || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Modelo</Text>
              <Text style={styles.infoValue}>{quotationData.vehicleModel || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Año</Text>
              <Text style={styles.infoValue}>{quotationData.vehicleYear}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tipo de Cotización</Text>
              <Text style={[styles.infoValue, { color: quotationData.type === 'cliente' ? Colors.secondary : Colors.primary }]}>
                {quotationData.type === 'cliente' ? 'Para Cliente' : 'Para Contraparte'}
              </Text>
            </View>
          </View>
        </View>

        {/* Breakdown Section */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Desglose de la Cotización</Text>

          {/* Laminado y Pintura */}
          {quotationData.laminadoParts.length > 0 && (
            <>
              <Text style={styles.categoryTitle}>Laminado y Pintura</Text>
              {quotationData.laminadoParts.map((item, index) => (
                <View key={index} style={styles.lineItem}>
                  <View style={styles.lineItemIcon}>
                    <Ionicons name="color-palette" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.lineItemInfo}>
                    <Text style={styles.lineItemName}>{item.name}</Text>
                    <Text style={styles.lineItemDetail}>Incluye mano de obra</Text>
                  </View>
                  <Text style={styles.lineItemPrice}>${item.price.toLocaleString()}</Text>
                </View>
              ))}
            </>
          )}

          {/* Reemplazo de Piezas */}
          {quotationData.replacementParts.length > 0 && (
            <>
              <Text style={styles.categoryTitle}>Reemplazo de Piezas</Text>
              {quotationData.replacementParts.map((item, index) => (
                <View key={index} style={styles.lineItem}>
                  <View style={styles.lineItemIcon}>
                    <Ionicons name="construct" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.lineItemInfo}>
                    <Text style={styles.lineItemName}>{item.name}</Text>
                    <Text style={styles.lineItemDetail}>Pieza de reemplazo</Text>
                  </View>
                  <Text style={styles.lineItemPrice}>${item.price.toLocaleString()}</Text>
                </View>
              ))}
              {/* Mano de obra de instalación */}
              <View style={styles.lineItem}>
                <View style={styles.lineItemIcon}>
                  <Ionicons name="hammer" size={20} color={Colors.primary} />
                </View>
                <View style={styles.lineItemInfo}>
                  <Text style={styles.lineItemName}>Mano de Obra Instalación</Text>
                  <Text style={styles.lineItemDetail}>Instalación de piezas de reemplazo</Text>
                </View>
                <Text style={styles.lineItemPrice}>${quotationData.manoDeObraInstalacion.toLocaleString()}</Text>
              </View>
            </>
          )}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal Laminado y Pintura</Text>
            <Text style={styles.totalValue}>${quotationData.subtotalLaminado.toLocaleString()}</Text>
          </View>
          {quotationData.replacementParts.length > 0 && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal Repuestos</Text>
                <Text style={styles.totalValue}>${quotationData.subtotalRepuestos.toLocaleString()}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Mano de Obra Instalación</Text>
                <Text style={styles.totalValue}>${quotationData.manoDeObraInstalacion.toLocaleString()}</Text>
              </View>
            </>
          )}
          {quotationData.adjustment > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Ajuste (20%)</Text>
              <Text style={styles.totalValue}>${quotationData.adjustment.toLocaleString()}</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total General</Text>
            <Text style={styles.grandTotalValue}>${quotationData.total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.pdfButton, saving && styles.pdfButtonDisabled]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="save" size={20} color={Colors.white} />
              <Text style={styles.pdfButtonText}>Guardar Cotización</Text>
            </>
          )}
        </TouchableOpacity>
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
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
  logo: {
    width: 80,
    height: 80,
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
  breakdownSection: {
    backgroundColor: Colors.white,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  lineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lineItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lineItemInfo: {
    flex: 1,
  },
  lineItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  lineItemDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  lineItemPrice: {
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
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    marginHorizontal: 16,
    marginVertical: 24,
  },
  pdfButtonDisabled: {
    opacity: 0.7,
  },
  pdfButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
