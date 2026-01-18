import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { ReplacementPart, QuotationType } from '../types';

interface AddReplacementPartModalProps {
  visible: boolean;
  editingPart: ReplacementPart | null;
  quotationType: QuotationType;
  onSave: (part: ReplacementPart) => void;
  onClose: () => void;
}

export default function AddReplacementPartModal({
  visible,
  editingPart,
  quotationType,
  onSave,
  onClose,
}: AddReplacementPartModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [mercadoLibreUrl, setMercadoLibreUrl] = useState('');

  useEffect(() => {
    if (visible) {
      if (editingPart) {
        setName(editingPart.name);
        setPrice(editingPart.price.toString());
        setMercadoLibreUrl(editingPart.mercadoLibreUrl || '');
      } else {
        setName('');
        setPrice('');
        setMercadoLibreUrl('');
      }
    }
  }, [visible, editingPart]);

  const handleSave = () => {
    if (!name.trim() || !price.trim()) return;

    const part: ReplacementPart = {
      id: editingPart?.id || '',
      name: name.trim(),
      price: parseFloat(price) || 0,
      mercadoLibreUrl: mercadoLibreUrl.trim() || undefined,
    };

    onSave(part);
  };

  const handleSearchMercadoLibre = () => {
    const searchQuery = encodeURIComponent(name);
    const url = `https://listado.mercadolibre.com.mx/${searchQuery}`;
    Linking.openURL(url);
  };

  const getPriceHint = () => {
    if (quotationType === 'contraparte') {
      return 'Cotiza al menor costo en Mercado Libre';
    }
    return 'Cotiza al costo de la media en Mercado Libre';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {editingPart ? 'Editar' : 'Añadir'} Pieza de Reemplazo
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nombre de la pieza</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ej. Faro Izquierdo"
                placeholderTextColor={Colors.gray}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>Costo estimado</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={Colors.gray}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.priceHint}>{getPriceHint()}</Text>

            <Text style={styles.label}>Enlace Mercado Libre (Opcional)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="link" size={20} color={Colors.secondary} style={styles.linkIcon} />
              <TextInput
                style={styles.input}
                placeholder="Pega aquí el enlace de la pieza"
                placeholderTextColor={Colors.gray}
                value={mercadoLibreUrl}
                onChangeText={setMercadoLibreUrl}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchMercadoLibre}
            >
              <Ionicons name="logo-google" size={16} color={Colors.secondary} />
              <Text style={styles.searchButtonText}>Buscar en Mercado Libre</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, (!name.trim() || !price.trim()) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!name.trim() || !price.trim()}
            >
              <Text style={styles.saveButtonText}>Guardar Pieza</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencySymbol: {
    fontSize: 16,
    color: Colors.text,
    marginRight: 8,
  },
  linkIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  priceHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryLight + '30',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  searchButtonText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.grayLight,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.grayLight,
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
});
