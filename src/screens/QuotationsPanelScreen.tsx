import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, QuotationStatus } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

type QuotationsPanelScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

interface QuotationItem {
  id: string;
  siniestroNumber: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  date: string;
  status: QuotationStatus;
  userMobile: string;
  userShortName: string;
  laminadoParts: { name: string; price: number }[];
  replacementParts: { name: string; price: number }[];
  subtotalLaminado: number;
  subtotalRepuestos: number;
  manoDeObraInstalacion: number;
  adjustment: number;
  total: number;
  type: 'cliente' | 'contraparte';
}

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
  const [quotations, setQuotations] = useState<QuotationItem[]>([]);
  const [archivedQuotations, setArchivedQuotations] = useState<QuotationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [archivedExpanded, setArchivedExpanded] = useState(false);
  const { profile } = useAuth();

  const formatQuotations = (data: any[], profilesMap: Record<string, any>): QuotationItem[] => {
    return data.map((q: any) => {
      const userProfile = profilesMap[q.user_id] || {};
      return {
        id: q.id,
        siniestroNumber: q.siniestro_number,
        vehicleBrand: q.vehicle_brand,
        vehicleModel: q.vehicle_model,
        vehicleYear: q.vehicle_year,
        date: new Date(q.created_at).toLocaleDateString('es-MX'),
        status: q.status as QuotationStatus,
        userMobile: userProfile.mobile_number || '',
        userShortName: userProfile.short_name || '',
        laminadoParts: q.laminado_parts || [],
        replacementParts: q.replacement_parts || [],
        subtotalLaminado: q.subtotal_laminado,
        subtotalRepuestos: q.subtotal_repuestos,
        manoDeObraInstalacion: q.mano_de_obra_instalacion,
        adjustment: q.adjustment,
        total: q.total,
        type: q.type,
      };
    });
  };

  const fetchQuotations = useCallback(async () => {
    // Get active quotations
    const { data: activeData, error: activeError } = await supabase
      .from('quotations')
      .select('*')
      .eq('archived', false)
      .order('created_at', { ascending: false });

    // Get archived quotations (only for admins - RLS handles this)
    let archivedData: any[] = [];
    if (profile?.is_admin) {
      const { data } = await supabase
        .from('quotations')
        .select('*')
        .eq('archived', true)
        .order('created_at', { ascending: false });
      archivedData = data || [];
    }

    if (activeError) {
      console.error('Error fetching quotations:', activeError);
      return;
    }

    // Get unique user IDs from both lists
    const allData = [...(activeData || []), ...(archivedData || [])];
    const userIds = [...new Set(allData.map((q: any) => q.user_id))];
    
    // Fetch profiles for those users
    let profilesMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, mobile_number, short_name')
        .in('id', userIds);
      
      if (profilesData) {
        profilesMap = profilesData.reduce((acc: any, p: any) => {
          acc[p.id] = p;
          return acc;
        }, {});
      }
    }

    setQuotations(formatQuotations(activeData || [], profilesMap));
    setArchivedQuotations(formatQuotations(archivedData || [], profilesMap));
  }, []);

  useEffect(() => {
    fetchQuotations().finally(() => setLoading(false));
  }, [fetchQuotations]);

  useFocusEffect(
    useCallback(() => {
      fetchQuotations();
    }, [fetchQuotations])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQuotations();
    setRefreshing(false);
  };

  const currentList = quotations;
  
  const filteredQuotations = currentList.filter(
    (q) =>
      q.siniestroNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.vehicleBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenQuotation = (item: QuotationItem) => {
    navigation.navigate('QuotationDetail', { quotation: item });
  };

  const renderQuotationItem = ({ item }: { item: QuotationItem }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <TouchableOpacity
        style={styles.quotationCard}
        onPress={() => handleOpenQuotation(item)}
      >
        <View style={styles.quotationInfo}>
          <View style={styles.quotationHeader}>
            <Text style={styles.siniestroNumber}>Siniestro #{item.siniestroNumber}</Text>
            {item.userMobile && (
              <Text style={styles.userMobile}>{item.userMobile}</Text>
            )}
          </View>
          <Text style={styles.vehicleInfo}>
            {item.vehicleBrand} {item.vehicleModel} {item.vehicleYear}
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

  if (loading) {
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

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

      {/* Barra de archivadas estilo Telegram (solo admins) */}
      {profile?.is_admin && archivedQuotations.length > 0 && (
        <TouchableOpacity 
          style={styles.archivedBar}
          onPress={() => setArchivedExpanded(!archivedExpanded)}
        >
          <View style={styles.archivedBarLeft}>
            <View style={styles.archivedIconContainer}>
              <Ionicons name="archive" size={18} color={Colors.white} />
            </View>
            <View style={styles.archivedBarContent}>
              <Text style={styles.archivedBarTitle}>Cotizaciones archivadas</Text>
              <Text style={styles.archivedBarPreview} numberOfLines={1}>
                {archivedQuotations.slice(0, 3).map(q => `#${q.siniestroNumber}`).join(', ')}
                {archivedQuotations.length > 3 ? '...' : ''}
              </Text>
            </View>
          </View>
          <View style={styles.archivedBarRight}>
            <View style={styles.archivedBadge}>
              <Text style={styles.archivedBadgeText}>{archivedQuotations.length}</Text>
            </View>
            <Ionicons 
              name={archivedExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.gray} 
            />
          </View>
        </TouchableOpacity>
      )}

      {/* Lista expandida de archivadas */}
      {profile?.is_admin && archivedExpanded && archivedQuotations.length > 0 && (
        <View style={styles.archivedList}>
          {archivedQuotations.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.archivedItem}
                onPress={() => handleOpenQuotation(item)}
              >
                <View style={styles.archivedItemInfo}>
                  <Text style={styles.archivedItemTitle}>#{item.siniestroNumber}</Text>
                  <Text style={styles.archivedItemSubtitle}>
                    {item.vehicleBrand} {item.vehicleModel} • {item.userMobile || item.userShortName}
                  </Text>
                </View>
                <View style={[styles.archivedItemBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                  <Text style={[styles.archivedItemBadgeText, { color: statusStyle.color }]}>
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <FlatList
        data={filteredQuotations}
        renderItem={renderQuotationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={Colors.gray} />
            <Text style={styles.emptyText}>No se encontraron cotizaciones</Text>
            <Text style={styles.emptySubtext}>Crea tu primera cotización</Text>
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
  quotationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userMobile: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
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
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.grayLight,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  archivedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e3a5f',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
  },
  archivedBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  archivedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2d5a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  archivedBarContent: {
    flex: 1,
  },
  archivedBarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  archivedBarPreview: {
    fontSize: 12,
    color: '#8ba4c4',
    marginTop: 2,
  },
  archivedBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  archivedBadge: {
    backgroundColor: '#2d5a8a',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  archivedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  archivedList: {
    backgroundColor: '#1a2f47',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  archivedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d4a6a',
  },
  archivedItemInfo: {
    flex: 1,
  },
  archivedItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  archivedItemSubtitle: {
    fontSize: 12,
    color: '#8ba4c4',
    marginTop: 2,
  },
  archivedItemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  archivedItemBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
