import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';

export default function PendingApprovalScreen() {
  const { signOut, refreshProfile, profile } = useAuth();

  const handleRefresh = async () => {
    await refreshProfile();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={64} color={Colors.warning} />
        </View>

        <Text style={styles.title}>Cuenta pendiente de aprobación</Text>
        
        <Text style={styles.message}>
          Hola {profile?.full_name || 'Usuario'},
        </Text>
        
        <Text style={styles.description}>
          Tu cuenta ha sido creada exitosamente, pero aún está pendiente de aprobación por un administrador.
        </Text>
        
        <Text style={styles.description}>
          Recibirás acceso completo a la aplicación una vez que tu cuenta sea aprobada. Te notificaremos por correo electrónico.
        </Text>

        <View style={styles.infoBox}>
          <Ionicons name="mail-outline" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            Correo registrado: {profile?.email}
          </Text>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={20} color={Colors.primary} />
          <Text style={styles.refreshButtonText}>Verificar estado</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.infoLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    height: 56,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  refreshButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: '100%',
  },
  logoutButtonText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
