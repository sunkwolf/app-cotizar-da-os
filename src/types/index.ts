export type QuotationType = 'contraparte' | 'cliente';

export type QuotationStatus = 'pendiente' | 'aprobada' | 'rechazada';

export interface User {
  id: string;
  fullName: string;
  email: string;
  isApproved: boolean;
  isAdmin: boolean;
  createdAt: Date;
}

export interface LaminadoPintura {
  id: string;
  name: string;
  price: number;
}

export interface ReplacementPart {
  id: string;
  name: string;
  price: number;
  mercadoLibreUrl?: string;
}

export interface Quotation {
  id: string;
  siniestroNumber: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePlates: string;
  type: QuotationType;
  status: QuotationStatus;
  laminadoPintura: LaminadoPintura[];
  replacementParts: ReplacementPart[];
  subtotalLaminado: number;
  subtotalRepuestos: number;
  iva: number;
  adjustment?: number; // 20% for client quotations
  total: number;
  createdAt: Date;
  userId: string;
}

export interface VehiclePart {
  id: string;
  name: string;
  selected: boolean;
}

export interface QuotationSummaryData {
  siniestroNumber: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePlates: string;
  type: QuotationType;
  laminadoParts: { name: string; price: number }[];
  replacementParts: ReplacementPart[];
  subtotalLaminado: number;
  subtotalRepuestos: number;
  manoDeObraInstalacion: number;
  adjustment: number;
  total: number;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  NewQuotationType: undefined;
  NewQuotationDetails: { type: QuotationType };
  QuotationSummary: { quotationData: QuotationSummaryData };
  LaminadoPinturaModal: { 
    selectedParts: string[];
    onSave: (parts: string[]) => void;
  };
};
