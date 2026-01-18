import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, QuotationStatus } from '../types';

type QuotationsPanelScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

interface QuotationItem {
  id: string;
  siniestroNumber: string;
  vehicleModel: string;
  vehicleYear: number;
  date: string;
  status: QuotationStatus;
}

const mockQuotations: QuotationItem[] = [
  {
    id: '1',
    siniestroNumber: '12345',
    vehicleModel: 'VW Vento',
    vehicleYear: 2022,
    date: '15/08/2024',
    status: 'pendiente',
  },
  {
    id: '2',
    siniestroNumber: '12346',
    vehicleModel: 'Nissan Versa',
    vehicleYear: 2021,
    date: '14/08/2024',
    status: 'aprobada',
  },
  {
    id: '3',
    siniestroNumber: '12347',
    vehicleModel: 'Chevrolet Onix',
    vehicleYear: 2023,
    date: '12/08/2024',
    status: 'rechazada',
  },
];

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

export default function QuotationsPanelScreen({ navigation }: QuotationsPanelScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuotations = mockQuotations.filter(
    (q) =>
      q.siniestroNumber.includes(searchQuery) ||
      q.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderQuotationItem = ({ item }: { item: QuotationItem }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <TouchableOpacity
        style={styles.quotationCard}
        onPress={() => navigation.navigate('QuotationSummary', { quotationId: item.id })}
      >
        <View style={styles.quotationInfo}>
          <Text style={styles.siniestroNumber}>Siniestro #{item.siniestroNumber}</Text>
          <Text style={styles.vehicleInfo}>
            {item.vehicleModel} {item.vehicleYear}
          </Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.quotationRight}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Panel de Cotizaciones</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar siniestro o vehículo"
          placeholderTextColor={Colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredQuotations}
        renderItem={renderQuotationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron cotizaciones</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewQuotationType')}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayLight,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  quotationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quotationInfo: {
    flex: 1,
  },
  siniestroNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: Colors.gray,
  },
  quotationRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
