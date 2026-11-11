export type AuditStatus = 'APPROVED' | 'APPROVED_WITH_RESERVATIONS' | 'REJECTED';

export type DeviationSeverity = 'PASS' | 'WARNING' | 'CRITICAL';

export type AuditCategory = 
  | 'LOGO' 
  | 'TYPOGRAPHY' 
  | 'COLORS' 
  | 'COMPOSITION' 
  | 'TONE';

export interface BoundingBox {
  x: number; // 0 a 100% da largura
  y: number; // 0 a 100% da altura
  width: number; // 0 a 100% da largura
  height: number; // 0 a 100% da altura
}

export interface AuditDeviation {
  id: string;
  category: AuditCategory;
  categoryLabel: string;
  title: string;
  severity: DeviationSeverity;
  identified: string;
  rule: string;
  suggestion: string;
  pageNumber?: number; // Para arquivos multi-página (PDF)
  locationLabel?: string; // Ex: "Canto Superior Direito", "Título de Capa"
  boundingBox?: BoundingBox; // Coordenadas visuais para desenhar a caixa de destaque sobre a peça
}

export interface DetectedColor {
  hex: string;
  name?: string;
  matchesBrand: boolean;
  percentage?: number;
}

export interface AuditReport {
  id: string;
  brandId: string;
  brandName: string;
  timestamp: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  previewUrl?: string;
  status: AuditStatus;
  score: number; // 0 - 100
  summary: string;
  totalPages?: number;
  pagePreviews?: {
    pageNumber: number;
    title: string;
    previewUrl?: string;
    deviationsCount: number;
  }[];
  deviations: AuditDeviation[];
  detectedColors?: DetectedColor[];
  detectedTypography?: string[];
  contextNote?: string;
}

export interface AuditRequestPayload {
  image: string; // base64 data url or string
  fileName: string;
  fileType: string;
  fileSize: number;
  brand: import('./brand').BrandGuide;
  contextNote?: string;
  apiKey?: string;
  provider?: 'gemini' | 'openai' | 'auto';
}

