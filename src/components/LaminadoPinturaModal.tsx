import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { LAMINADO_PINTURA_PARTS } from '../constants/vehicleParts';

interface CustomPart {
  id: string;
  name: string;
}

interface LaminadoPinturaModalProps {
  visible: boolean;
  selectedParts: string[];
  customParts?: CustomPart[];
  onSave: (parts: string[], customParts: CustomPart[]) => void;
  onClose: () => void;
}

export default function LaminadoPinturaModal({
  visible,
  selectedParts,
  customParts = [],
  onSave,
  onClose,
}: LaminadoPinturaModalProps) {
  const [localSelectedParts, setLocalSelectedParts] = useState<string[]>([]);
  const [localCustomParts, setLocalCustomParts] = useState<CustomPart[]>([]);
  const [newPartName, setNewPartName] = useState('');

  useEffect(() => {
    if (visible) {
      setLocalSelectedParts([...selectedParts]);
      setLocalCustomParts([...customParts]);
      setNewPartName('');
    }
  }, [visible, selectedParts, customParts]);

  const togglePart = (partId: string) => {
    setLocalSelectedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };

  const handleSave = () => {
    onSave(localSelectedParts, localCustomParts);
  };

  const handleAddCustomPart = () => {
    if (newPartName.trim()) {
      const newPart: CustomPart = {
        id: `custom_${Date.now()}`,
        name: newPartName.trim(),
      };
      setLocalCustomParts((prev) => [...prev, newPart]);
      setNewPartName('');
    }
  };

  const handleRemoveCustomPart = (partId: string) => {
    setLocalCustomParts((prev) => prev.filter((p) => p.id !== partId));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Laminado y Pintura</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Selecciona las piezas del vehículo que requieren laminado y pintura.
          </Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {LAMINADO_PINTURA_PARTS.map((part) => {
              const isSelected = localSelectedParts.includes(part.id);
              return (
                <TouchableOpacity
                  key={part.id}
                  style={styles.partItem}
                  onPress={() => togglePart(part.id)}
                >
                  <Text style={styles.partName}>{part.name}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color={Colors.white} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Custom Parts Section */}
            {localCustomParts.length > 0 && (
              <View style={styles.customPartsSection}>
                <Text style={styles.customPartsTitle}>Piezas Personalizadas</Text>
                {localCustomParts.map((part) => (
                  <View key={part.id} style={styles.customPartItem}>
                    <View style={styles.customPartInfo}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                      <Text style={styles.customPartName}>{part.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveCustomPart(part.id)}>
                      <Ionicons name="trash-outline" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Add Custom Part Input */}
            <View style={styles.addCustomSection}>
              <Text style={styles.addCustomTitle}>¿No encuentras la pieza?</Text>
              <View style={styles.addCustomInputRow}>
                <TextInput
                  style={styles.addCustomInput}
                  placeholder="Escribe el nombre de la pieza"
                  placeholderTextColor={Colors.gray}
                  value={newPartName}
                  onChangeText={setNewPartName}
                  onSubmitEditing={handleAddCustomPart}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[
                    styles.addCustomButton,
                    !newPartName.trim() && styles.addCustomButtonDisabled,
                  ]}
                  onPress={handleAddCustomPart}
                  disabled={!newPartName.trim()}
                >
                  <Ionicons name="add" size={24} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  partItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  partName: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  customPartsSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  customPartsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  customPartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  customPartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customPartName: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  addCustomSection: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.infoLight,
    borderRadius: 12,
  },
  addCustomTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  addCustomInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCustomInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  addCustomButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCustomButtonDisabled: {
    backgroundColor: Colors.grayLight,
  },
});
