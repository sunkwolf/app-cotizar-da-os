import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { supabase, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPanelScreen() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { profile } = useAuth();

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
      return;
    }

    setUsers(data || []);
  }, []);

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false));
  }, [fetchUsers]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const handleToggleApproval = async (user: Profile) => {
    const newStatus = !user.is_approved;
    const action = newStatus ? 'aprobar' : 'desaprobar';

    Alert.alert(
      `${newStatus ? 'Aprobar' : 'Desaprobar'} usuario`,
      `¿Estás seguro de que deseas ${action} a ${user.full_name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            const { error } = await supabase
              .from('profiles')
              .update({ is_approved: newStatus })
              .eq('id', user.id);

            if (error) {
              Alert.alert('Error', `No se pudo ${action} al usuario`);
              return;
            }

            setUsers(prev =>
              prev.map(u => (u.id === user.id ? { ...u, is_approved: newStatus } : u))
            );

            Alert.alert('Éxito', `Usuario ${newStatus ? 'aprobado' : 'desaprobado'} correctamente`);
          },
        },
      ]
    );
  };

  const handleToggleAdmin = async (user: Profile) => {
    if (user.id === profile?.id) {
      Alert.alert('Error', 'No puedes cambiar tu propio rol de administrador');
      return;
    }

    const newStatus = !user.is_admin;
    const action = newStatus ? 'dar permisos de administrador a' : 'quitar permisos de administrador a';

    Alert.alert(
      `${newStatus ? 'Hacer' : 'Quitar'} administrador`,
      `¿Estás seguro de que deseas ${action} ${user.full_name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: newStatus ? 'default' : 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('profiles')
              .update({ is_admin: newStatus })
              .eq('id', user.id);

            if (error) {
              Alert.alert('Error', 'No se pudo cambiar el rol del usuario');
              return;
            }

            setUsers(prev =>
              prev.map(u => (u.id === user.id ? { ...u, is_admin: newStatus } : u))
            );

            Alert.alert('Éxito', `Permisos de administrador ${newStatus ? 'otorgados' : 'removidos'} correctamente`);
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: Profile }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>{item.short_name || item.full_name}</Text>
            {item.mobile_number && (
              <Text style={styles.userMobile}>{item.mobile_number}</Text>
            )}
          </View>
          <View style={styles.badges}>
            {item.is_admin && (
              <View style={[styles.badge, styles.adminBadge]}>
                <Text style={styles.badgeText}>Admin</Text>
              </View>
            )}
            <View style={[styles.badge, item.is_approved ? styles.approvedBadge : styles.pendingBadge]}>
              <Text style={styles.badgeText}>
                {item.is_approved ? 'Aprobado' : 'Pendiente'}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.userFullName}>{item.full_name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userDate}>
          Registrado: {new Date(item.created_at).toLocaleDateString('es-MX')}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.is_approved ? styles.rejectButton : styles.approveButton,
          ]}
          onPress={() => handleToggleApproval(item)}
        >
          <Ionicons
            name={item.is_approved ? 'close-circle' : 'checkmark-circle'}
            size={20}
            color={Colors.white}
          />
          <Text style={styles.actionButtonText}>
            {item.is_approved ? 'Desaprobar' : 'Aprobar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.adminButton,
            item.id === profile?.id && styles.disabledButton,
          ]}
          onPress={() => handleToggleAdmin(item)}
          disabled={item.id === profile?.id}
        >
          <Ionicons
            name={item.is_admin ? 'shield-outline' : 'shield'}
            size={20}
            color={item.id === profile?.id ? Colors.gray : Colors.white}
          />
          <Text style={[
            styles.actionButtonText,
            item.id === profile?.id && styles.disabledText,
          ]}>
            {item.is_admin ? 'Quitar Admin' : 'Hacer Admin'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Panel de Administración</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const pendingUsers = users.filter(u => !u.is_approved);
  const approvedUsers = users.filter(u => u.is_approved);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Administración</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: Colors.warning }]}>{pendingUsers.length}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: Colors.success }]}>{approvedUsers.length}</Text>
          <Text style={styles.statLabel}>Aprobados</Text>
        </View>
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={Colors.gray} />
            <Text style={styles.emptyText}>No hay usuarios registrados</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  userCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userInfo: {
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userNameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  userMobile: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  userFullName: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadge: {
    backgroundColor: Colors.primary,
  },
  approvedBadge: {
    backgroundColor: Colors.success,
  },
  pendingBadge: {
    backgroundColor: Colors.warning,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userDate: {
    fontSize: 12,
    color: Colors.gray,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: Colors.success,
  },
  rejectButton: {
    backgroundColor: Colors.error,
  },
  adminButton: {
    backgroundColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.grayLight,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  disabledText: {
    color: Colors.gray,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
  },
});
