import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type QuotationFinalScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QuotationFinal'>;
  route: RouteProp<RootStackParamList, 'QuotationFinal'>;
};

export default function QuotationFinalScreen({ navigation, route }: QuotationFinalScreenProps) {
  const { quotationData } = route.params;
  
  const currentDate = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Cotización Guardada</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          </View>
          <Text style={styles.successText}>¡Cotización guardada exitosamente!</Text>
        </View>

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
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tipo</Text>
              <Text style={[styles.infoValue, { color: quotationData.type === 'cliente' ? Colors.secondary : Colors.primary }]}>
                {quotationData.type === 'cliente' ? 'Cliente' : 'Contraparte'}
              </Text>
            </View>
          </View>
        </View>

        {/* Parts List */}
        <View style={styles.partsSection}>
          {quotationData.laminadoParts.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Piezas Dañadas (Laminado y Pintura)</Text>
              {quotationData.laminadoParts.map((item, index) => (
                <View key={index} style={styles.partItem}>
                  <Ionicons name="ellipse" size={8} color={Colors.primary} />
                  <Text style={styles.partName}>{item.name}</Text>
                </View>
              ))}
            </>
          )}

          {quotationData.replacementParts.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Refacciones</Text>
              {quotationData.replacementParts.map((item, index) => (
                <View key={index} style={styles.partItem}>
                  <Ionicons name="ellipse" size={8} color={Colors.secondary} />
                  <Text style={styles.partName}>{item.name}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total de la Cotización</Text>
          <Text style={styles.totalValue}>${quotationData.total.toLocaleString()}</Text>
        </View>

        {/* Go Home Button */}
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Ionicons name="home" size={20} color={Colors.white} />
          <Text style={styles.homeButtonText}>Volver al Inicio</Text>
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
  headerLeft: {
    width: 32,
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
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: Colors.white,
  },
  successIcon: {
    marginBottom: 12,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.success,
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
    paddingVertical: 8,
    gap: 12,
  },
  partName: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  totalSection: {
    backgroundColor: Colors.white,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    marginHorizontal: 16,
    marginVertical: 24,
  },
  homeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
