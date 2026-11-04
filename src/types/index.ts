export type Unit = 'cm' | 'm';

export type ProductCategory =
  | 'sofas'
  | 'geladeiras'
  | 'maquinas'
  | 'camas'
  | 'mesas'
  | 'armarios'
  | 'estantes'
  | 'eletrodomesticos'
  | 'outros';

export interface Dimensions {
  width: number; // in cm
  height: number; // in cm
  depth: number; // in cm
}

export interface ProductPreset {
  id: string;
  name: string;
  category: ProductCategory;
  dimensions: Dimensions;
  packagingDimensions?: Dimensions;
  requiredClearance?: {
    lateral: number; // cm on each side or total
    rear: number; // cm back clearance (e.g. for fridge/washer)
    top: number; // cm top clearance
    ventilationNote?: string;
  };
  description?: string;
  canRotate?: boolean;
}

export type FitStatus = 'fits' | 'fits_with_restrictions' | 'does_not_fit';

export interface RoomClearances {
  minSideClearance: number; // minimum distance from walls (cm)
  circulationSpace: number; // extra space for human passage (cm)
  ventilationClearance: number; // manufacturer ventilation clearance (cm)
}

export interface FitCalculationResult {
  status: FitStatus;
  statusText: string;
  statusDescription: string;
  orientation: 'standard' | 'rotated_90';
  isRotated: boolean;
  canRotateToFit: boolean;
  alternativeOrientationResult?: {
    status: FitStatus;
    lateralClearance: number;
    depthClearance: number;
  };
  productDimensions: Dimensions;
  spaceDimensions: Dimensions;
  effectiveRequiredWidth: number;
  effectiveRequiredDepth: number;
  effectiveRequiredHeight: number;
  lateralClearance: number; // remaining width in cm
  depthClearance: number; // remaining depth in cm
  verticalClearance: number; // remaining height in cm
  warnings: string[];
  recommendations: string[];
  details: {
    label: string;
    value: string;
    status: 'ok' | 'warning' | 'error';
  }[];
}

export type PassageStatus =
  | 'pass'
  | 'pass_with_technique'
  | 'requires_onsite_inspection'
  | 'blocked';

export interface DoorwayData {
  width: number; // cm
  height: number; // cm
  openingAngle?: number; // degrees, default 90
  removeDoorTrim?: boolean;
}

export interface HallwayData {
  width: number; // cm
  ceilingHeight: number; // cm
  hasCorner: boolean; // 90° bend
  cornerWidth?: number; // cm
}

export interface ElevatorData {
  doorWidth: number; // cm
  doorHeight: number; // cm
  cabinWidth: number; // cm
  cabinDepth: number; // cm
  cabinHeight: number; // cm
}

export interface StairsData {
  stairWidth: number; // cm
  ceilingClearance: number; // cm
  hasTurn: boolean;
  landingWidth?: number; // cm
  landingDepth?: number; // cm
}

export interface DeliveryPath {
  door: DoorwayData;
  hallway: HallwayData;
  elevator: ElevatorData;
  stairs: StairsData;
}

export interface PassageItemDiagnosis {
  passed: boolean;
  status: PassageStatus;
  statusLabel: string;
  title: string;
  description: string;
  tips: string[];
  limitingDimension?: string;
  marginCm: number;
}

export interface DeliveryPathDiagnosis {
  overallStatus: PassageStatus;
  overallLabel: string;
  overallDescription: string;
  doorDiagnosis: PassageItemDiagnosis;
  hallwayDiagnosis: PassageItemDiagnosis;
  elevatorDiagnosis: PassageItemDiagnosis;
  stairsDiagnosis: PassageItemDiagnosis;
  isPackagedEvaluated: boolean;
}

export interface SavedRoom {
  id: string;
  name: string;
  type: string;
  dimensions: Dimensions;
  doorWidth?: number;
  notes?: string;
  createdAt: string;
}

export interface FurnitureTestRecord {
  id: string;
  productName: string;
  category: ProductCategory;
  productDimensions: Dimensions;
  packagingDimensions?: Dimensions;
  roomId?: string;
  roomName?: string;
  spaceDimensions: Dimensions;
  fitResult: FitCalculationResult;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  rooms: SavedRoom[];
  tests: FurnitureTestRecord[];
  pathData?: DeliveryPath;
  createdAt: string;
  updatedAt: string;
}

export interface EditorialArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readingTimeMinutes: number;
  publishedDate: string;
  coverAccent: string;
  summary: string;
  content: {
    heading?: string;
    paragraphs: string[];
    checklist?: string[];
    formula?: string;
    callout?: {
      type: 'tip' | 'warning' | 'rule';
      text: string;
    };
  }[];
  relatedCategory: ProductCategory;
}
