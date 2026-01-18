import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, QuotationType, ReplacementPart } from '../types';
import { LAMINADO_PINTURA_PARTS } from '../constants/vehicleParts';
import LaminadoPinturaModal from '../components/LaminadoPinturaModal';
import AddReplacementPartModal from '../components/AddReplacementPartModal';

type NewQuotationDetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NewQuotationDetails'>;
  route: RouteProp<RootStackParamList, 'NewQuotationDetails'>;
};

const currentYear = new Date().getFullYear();

const generateYearOptions = () => {
  const years = [];
  for (let year = currentYear + 1; year >= 1990; year--) {
    years.push(year);
  }
  return years;
};

const getPricePerPart = (year: number, type: QuotationType): number => {
  const nextYear = currentYear + 1;
  
  if (type === 'contraparte') {
    // Contraparte pricing
    if (year >= currentYear - 3 && year <= nextYear) {
      // Current year +1 to 4 years back (e.g., 2023-2026)
      return 2000;
    } else if (year >= currentYear - 14 && year <= currentYear - 4) {
      // 5 to 15 years back (e.g., 2010-2022)
      return 1500;
    } else {
      // More than 16 years (e.g., 2009 and below)
      return 1200;
    }
  } else {
    // Cliente pricing
    if (year >= currentYear - 3 && year <= nextYear) {
      return 2500;
    } else if (year >= currentYear - 14 && year <= currentYear - 4) {
      return 2000;
    } else {
      return 1700;
    }
  }
};

export default function NewQuotationDetailsScreen({ navigation, route }: NewQuotationDetailsScreenProps) {
  const { type } = route.params;
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState<number | null>(null);
  const [siniestroNumber, setSiniestroNumber] = useState('');
  const [vehiclePlates, setVehiclePlates] = useState('');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedLaminadoParts, setSelectedLaminadoParts] = useState<string[]>([]);
  const [customLaminadoParts, setCustomLaminadoParts] = useState<{id: string; name: string}[]>([]);
  const [replacementParts, setReplacementParts] = useState<ReplacementPart[]>([]);
  const [showLaminadoModal, setShowLaminadoModal] = useState(false);
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [editingPart, setEditingPart] = useState<ReplacementPart | null>(null);

  const yearOptions = generateYearOptions();

  const handleSaveLaminadoParts = useCallback((parts: string[], customParts: {id: string; name: string}[]) => {
    setSelectedLaminadoParts(parts);
    setCustomLaminadoParts(customParts);
    setShowLaminadoModal(false);
  }, []);

  const handleAddReplacementPart = useCallback((part: ReplacementPart) => {
    if (editingPart) {
      setReplacementParts(prev => prev.map(p => p.id === editingPart.id ? part : p));
    } else {
      setReplacementParts(prev => [...prev, { ...part, id: Date.now().toString() }]);
    }
    setShowReplacementModal(false);
    setEditingPart(null);
  }, [editingPart]);

  const handleEditReplacementPart = (part: ReplacementPart) => {
    setEditingPart(part);
    setShowReplacementModal(true);
  };

  const handleDeleteReplacementPart = (partId: string) => {
    setReplacementParts(prev => prev.filter(p => p.id !== partId));
  };

  const pricePerPart = vehicleYear ? getPricePerPart(vehicleYear, type) : 0;
  const totalLaminadoParts = selectedLaminadoParts.length + customLaminadoParts.length;
  const subtotalLaminado = totalLaminadoParts * pricePerPart;
  const subtotalRepuestos = replacementParts.reduce((sum, part) => sum + part.price, 0);
  const manoDeObraInstalacion = replacementParts.length === 0 
    ? 0 
    : replacementParts.length === 1 
      ? 500 
      : replacementParts.length * 400;
  const subtotal = subtotalLaminado + subtotalRepuestos + manoDeObraInstalacion;
  const adjustment = type === 'cliente' ? subtotal * 0.20 : 0;
  const total = subtotal + adjustment;

  const handleSaveQuotation = () => {
    const laminadoParts = [
      ...getSelectedPartNames().map(name => ({ name, price: pricePerPart })),
      ...customLaminadoParts.map(part => ({ name: `${part.name} (personalizada)`, price: pricePerPart })),
    ];

    navigation.navigate('QuotationSummary', {
      quotationData: {
        siniestroNumber,
        vehicleModel,
        vehicleYear: vehicleYear || 0,
        vehiclePlates,
        type,
        laminadoParts,
        replacementParts,
        subtotalLaminado,
        subtotalRepuestos,
        manoDeObraInstalacion,
        adjustment,
        total,
      },
    });
  };

  const getSelectedPartNames = () => {
    return selectedLaminadoParts.map(id => {
      const part = LAMINADO_PINTURA_PARTS.find(p => p.id === id);
      return part?.name || '';
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Cotización</Text>
        <View style={styles.typeBadge}>
          <View style={[styles.typeDot, { backgroundColor: type === 'contraparte' ? Colors.primary : Colors.secondary }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles del Vehículo</Text>

          <Text style={styles.label}>Número de Siniestro</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ej. SN-12345"
              placeholderTextColor={Colors.gray}
              value={siniestroNumber}
              onChangeText={setSiniestroNumber}
            />
          </View>

          <Text style={styles.label}>Modelo del Vehículo</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ej. Nissan Versa"
              placeholderTextColor={Colors.gray}
              value={vehicleModel}
              onChangeText={setVehicleModel}
            />
          </View>

          <Text style={styles.label}>Año</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowYearPicker(true)}
          >
            <Text style={[styles.input, !vehicleYear && styles.placeholder]}>
              {vehicleYear || 'Selecciona el año'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={Colors.gray} />
          </TouchableOpacity>

          <Text style={styles.label}>Placas</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ej. ABC-123"
              placeholderTextColor={Colors.gray}
              value={vehiclePlates}
              onChangeText={setVehiclePlates}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daños y Reparaciones</Text>

          {/* Laminado y Pintura Section */}
          <View style={styles.damageCard}>
            <View style={styles.damageHeader}>
              <Ionicons name="color-palette" size={24} color={Colors.primary} />
              <Text style={styles.damageTitle}>Laminado y Pintura</Text>
            </View>

            {selectedLaminadoParts.length === 0 && customLaminadoParts.length === 0 ? (
              <Text style={styles.emptyText}>
                Aún no se han añadido trabajos.{'\n'}Comienza pulsando el botón de abajo.
              </Text>
            ) : (
              <View style={styles.selectedPartsList}>
                {getSelectedPartNames().map((name, index) => (
                  <View key={index} style={styles.selectedPartItem}>
                    <Text style={styles.selectedPartName}>{name}</Text>
                    <Text style={styles.selectedPartPrice}>${pricePerPart.toLocaleString()}</Text>
                  </View>
                ))}
                {customLaminadoParts.map((part) => (
                  <View key={part.id} style={styles.selectedPartItem}>
                    <Text style={styles.selectedPartName}>{part.name} (personalizada)</Text>
                    <Text style={styles.selectedPartPrice}>${pricePerPart.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowLaminadoModal(true)}
            >
              <Ionicons name="add" size={20} color={Colors.primary} />
              <Text style={styles.addButtonText}>Añadir Laminado/Pintura</Text>
            </TouchableOpacity>
          </View>

          {/* Reemplazo de Piezas Section */}
          <View style={styles.damageCard}>
            <View style={styles.damageHeader}>
              <Ionicons name="construct" size={24} color={Colors.primary} />
              <Text style={styles.damageTitle}>Reemplazo de Piezas</Text>
            </View>

            {replacementParts.length === 0 ? (
              <Text style={styles.emptyText}>
                No hay piezas de reemplazo añadidas.
              </Text>
            ) : (
              <View style={styles.replacementPartsList}>
                {replacementParts.map((part) => (
                  <View key={part.id} style={styles.replacementPartItem}>
                    <View style={styles.replacementPartInfo}>
                      <Text style={styles.replacementPartName}>{part.name}</Text>
                      <View style={styles.replacementPartActions}>
                        <TouchableOpacity onPress={() => handleEditReplacementPart(part)}>
                          <Text style={styles.editLink}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteReplacementPart(part.id)}>
                          <Text style={styles.deleteLink}>Eliminar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.replacementPartPrice}>${part.price.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setEditingPart(null);
                setShowReplacementModal(true);
              }}
            >
              <Ionicons name="add" size={20} color={Colors.primary} />
              <Text style={styles.addButtonText}>Añadir Pieza de Reemplazo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal Laminado:</Text>
            <Text style={styles.totalValue}>${subtotalLaminado.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal Repuestos:</Text>
            <Text style={styles.totalValue}>${subtotalRepuestos.toLocaleString()}</Text>
          </View>
          {manoDeObraInstalacion > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Mano de Obra Instalación:</Text>
              <Text style={styles.totalValue}>${manoDeObraInstalacion.toLocaleString()}</Text>
            </View>
          )}
          {type === 'cliente' && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Ajuste (20%):</Text>
              <Text style={styles.totalValue}>${adjustment.toLocaleString()}</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total Estimado:</Text>
            <Text style={styles.grandTotalValue}>${total.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveQuotation}>
          <Text style={styles.saveButtonText}>Guardar Cotización</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.yearPickerModal}>
            <View style={styles.yearPickerHeader}>
              <Text style={styles.yearPickerTitle}>Selecciona el año</Text>
              <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.yearList}>
              {yearOptions.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearOption,
                    vehicleYear === year && styles.yearOptionSelected,
                  ]}
                  onPress={() => {
                    setVehicleYear(year);
                    setShowYearPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.yearOptionText,
                      vehicleYear === year && styles.yearOptionTextSelected,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Laminado y Pintura Modal */}
      <LaminadoPinturaModal
        visible={showLaminadoModal}
        selectedParts={selectedLaminadoParts}
        customParts={customLaminadoParts}
        onSave={handleSaveLaminadoParts}
        onClose={() => setShowLaminadoModal(false)}
      />

      {/* Add Replacement Part Modal */}
      <AddReplacementPartModal
        visible={showReplacementModal}
        editingPart={editingPart}
        quotationType={type}
        onSave={handleAddReplacementPart}
        onClose={() => {
          setShowReplacementModal(false);
          setEditingPart(null);
        }}
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
  typeBadge: {
    width: 32,
    alignItems: 'flex-end',
  },
  typeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
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
    marginBottom: 16,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  placeholder: {
    color: Colors.gray,
  },
  damageCard: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  damageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  damageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 20,
  },
  selectedPartsList: {
    marginBottom: 12,
  },
  selectedPartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedPartName: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  selectedPartPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  replacementPartsList: {
    marginBottom: 12,
  },
  replacementPartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  replacementPartInfo: {
    flex: 1,
  },
  replacementPartName: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  replacementPartActions: {
    flexDirection: 'row',
  },
  editLink: {
    fontSize: 12,
    color: Colors.primary,
    marginRight: 12,
  },
  deleteLink: {
    fontSize: 12,
    color: Colors.error,
  },
  replacementPartPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  totalSection: {
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
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  yearPickerModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  yearPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  yearPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  yearList: {
    padding: 16,
  },
  yearOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  yearOptionSelected: {
    backgroundColor: Colors.primaryLight + '20',
  },
  yearOptionText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  yearOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
