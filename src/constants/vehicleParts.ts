export interface VehiclePart {
  id: string;
  name: string;
}

export interface VehiclePartCategory {
  id: string;
  title: string;
  description: string;
  parts: VehiclePart[];
}

export const VEHICLE_PARTS_BY_CATEGORY: VehiclePartCategory[] = [
  {
    id: 'frente',
    title: '1. Parte Delantera (Frente)',
    description: 'Zona desde el parabrisas hacia adelante. Crítica en colisiones frontales.',
    parts: [
      { id: 'f1', name: 'Cofre (Capó)' },
      { id: 'f2', name: 'Bisagras de Cofre' },
      { id: 'f3', name: 'Varilla de Soporte de Cofre' },
      { id: 'f4', name: 'Aislante Térmico de Cofre' },
      { id: 'f5', name: 'Chapa/Cerradura de Cofre' },
      { id: 'f6', name: 'Defensa Delantera (Facia)' },
      { id: 'f7', name: 'Absorbedor de Impacto Delantero' },
      { id: 'f8', name: 'Alma Delantera' },
      { id: 'f9', name: 'Parrilla Superior' },
      { id: 'f10', name: 'Parrilla Inferior' },
      { id: 'f11', name: 'Faro Principal Izquierdo' },
      { id: 'f12', name: 'Faro Principal Derecho' },
      { id: 'f13', name: 'Faro de Niebla Izquierdo' },
      { id: 'f14', name: 'Faro de Niebla Derecho' },
      { id: 'f15', name: 'Bisel/Marco de Faro de Niebla Izquierdo' },
      { id: 'f16', name: 'Bisel/Marco de Faro de Niebla Derecho' },
      { id: 'f17', name: 'Marco del Radiador (Marco Frontal)' },
      { id: 'f18', name: 'Condensador' },
      { id: 'f19', name: 'Radiador' },
      { id: 'f20', name: 'Tolva Inferior de Motor' },
      { id: 'f21', name: 'Parabrisas' },
      { id: 'f22', name: 'Brazos Limpiaparabrisas' },
      { id: 'f23', name: 'Plumas Limpiaparabrisas' },
      { id: 'f24', name: 'Emblema Frontal' },
    ],
  },
  {
    id: 'izquierdo',
    title: '2. Costado Izquierdo (Lado del Conductor)',
    description: 'Lado del conductor. Diferencia entre sedán/hatchback y pickup/SUV.',
    parts: [
      { id: 'i1', name: 'Salpicadera Delantera Izquierda' },
      { id: 'i2', name: 'Lodera (Guardafango) Delantera Izquierda' },
      { id: 'i3', name: 'Espejo Lateral Izquierdo' },
      { id: 'i4', name: 'Puerta Delantera Izquierda (Cascarón)' },
      { id: 'i5', name: 'Cristal Puerta Delantera Izquierda' },
      { id: 'i6', name: 'Elevador (Motor Vidrio) Puerta Del. Izq.' },
      { id: 'i7', name: 'Manija Exterior Puerta Delantera Izquierda' },
      { id: 'i8', name: 'Moldura Puerta Delantera Izquierda' },
      { id: 'i9', name: 'Pilar A Izquierdo' },
      { id: 'i10', name: 'Pilar B (Poste Central) Izquierdo' },
      { id: 'i11', name: 'Estribo Izquierdo' },
      { id: 'i12', name: 'Puerta Trasera Izquierda (Cascarón)' },
      { id: 'i13', name: 'Cristal Puerta Trasera Izquierda' },
      { id: 'i14', name: 'Elevador (Motor Vidrio) Puerta Tras. Izq.' },
      { id: 'i15', name: 'Manija Exterior Puerta Trasera Izquierda' },
      { id: 'i16', name: 'Moldura Puerta Trasera Izquierda' },
      { id: 'i17', name: 'Costado Trasero (Lienzo) Izquierdo' },
      { id: 'i18', name: 'Batea Lado Izquierdo (Pickups)' },
      { id: 'i19', name: 'Rin Delantero Izquierdo' },
      { id: 'i20', name: 'Rin Trasero Izquierdo' },
      { id: 'i21', name: 'Llanta Delantera Izquierda' },
      { id: 'i22', name: 'Llanta Trasera Izquierda' },
    ],
  },
  {
    id: 'derecho',
    title: '3. Costado Derecho (Lado del Copiloto)',
    description: 'Lado del copiloto. Incluye tapa de gasolina y antena.',
    parts: [
      { id: 'd1', name: 'Salpicadera Delantera Derecha' },
      { id: 'd2', name: 'Lodera (Guardafango) Delantera Derecha' },
      { id: 'd3', name: 'Espejo Lateral Derecho' },
      { id: 'd4', name: 'Puerta Delantera Derecha (Cascarón)' },
      { id: 'd5', name: 'Cristal Puerta Delantera Derecha' },
      { id: 'd6', name: 'Elevador (Motor Vidrio) Puerta Del. Der.' },
      { id: 'd7', name: 'Manija Exterior Puerta Delantera Derecha' },
      { id: 'd8', name: 'Moldura Puerta Delantera Derecha' },
      { id: 'd9', name: 'Pilar A Derecho' },
      { id: 'd10', name: 'Pilar B (Poste Central) Derecho' },
      { id: 'd11', name: 'Estribo Derecho' },
      { id: 'd12', name: 'Puerta Trasera Derecha (Cascarón)' },
      { id: 'd13', name: 'Cristal Puerta Trasera Derecha' },
      { id: 'd14', name: 'Elevador (Motor Vidrio) Puerta Tras. Der.' },
      { id: 'd15', name: 'Manija Exterior Puerta Trasera Derecha' },
      { id: 'd16', name: 'Moldura Puerta Trasera Derecha' },
      { id: 'd17', name: 'Costado Trasero (Lienzo) Derecho' },
      { id: 'd18', name: 'Batea Lado Derecho (Pickups)' },
      { id: 'd19', name: 'Tapa de Gasolina' },
      { id: 'd20', name: 'Antena' },
      { id: 'd21', name: 'Rin Delantero Derecho' },
      { id: 'd22', name: 'Rin Trasero Derecho' },
      { id: 'd23', name: 'Llanta Delantera Derecha' },
      { id: 'd24', name: 'Llanta Trasera Derecha' },
    ],
  },
  {
    id: 'trasera',
    title: '4. Parte Trasera',
    description: 'Zona crítica para alcances traseros.',
    parts: [
      { id: 't1', name: 'Defensa Trasera (Facia)' },
      { id: 't2', name: 'Alma Trasera' },
      { id: 't3', name: 'Absorbedor Trasero' },
      { id: 't4', name: 'Cajuela (Tapa)' },
      { id: 't5', name: 'Portón Trasero' },
      { id: 't6', name: 'Tapa de Batea (Pickups)' },
      { id: 't7', name: 'Bisagras de Cajuela/Portón' },
      { id: 't8', name: 'Amortiguadores de Gas Cajuela/Portón' },
      { id: 't9', name: 'Chapa de Cajuela/Portón' },
      { id: 't10', name: 'Calavera Esquina Izquierda' },
      { id: 't11', name: 'Calavera Esquina Derecha' },
      { id: 't12', name: 'Calavera en Tapa Izquierda' },
      { id: 't13', name: 'Calavera en Tapa Derecha' },
      { id: 't14', name: 'Medallón (Cristal Trasero)' },
      { id: 't15', name: 'Panel Trasero' },
      { id: 't16', name: 'Piso de Cajuela' },
      { id: 't17', name: 'Sensores de Reversa' },
      { id: 't18', name: 'Cámara de Reversa' },
      { id: 't19', name: 'Alerón / Spoiler' },
      { id: 't20', name: 'Tercera Luz de Stop' },
    ],
  },
];

// Flat list for backward compatibility
export const LAMINADO_PINTURA_PARTS = VEHICLE_PARTS_BY_CATEGORY.flatMap(
  category => category.parts
);

export const REPLACEMENT_PARTS_EXAMPLES = [
  'Faro Delantero Izquierdo',
  'Faro Delantero Derecho',
  'Calavera Izquierda',
  'Calavera Derecha',
  'Parrilla Delantera',
  'Parachoques Delantero',
  'Parachoques Trasero',
  'Espejo Lateral Izquierdo',
  'Espejo Lateral Derecho',
  'Cristal Parabrisas',
  'Cristal Trasero',
  'Moldura de Puerta',
  'Manija de Puerta',
];
