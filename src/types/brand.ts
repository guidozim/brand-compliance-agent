export interface BrandColor {
  id: string;
  name: string;
  hex: string;
  usage: string;
  type: 'primary' | 'secondary' | 'neutral' | 'accent';
}

export interface BrandTypography {
  primaryFont: string;
  secondaryFont: string;
  hierarchyRules: string;
  forbiddenFonts: string[];
}

export interface BrandLogoRules {
  clearSpaceRule: string;
  minWidthPrint: string;
  minWidthDigital: string;
  allowedVariations: string[];
  forbiddenPractices: string[];
}

export interface BrandToneOfVoice {
  archetype: string;
  styleKeywords: string[];
  mandatories: string[];
  forbiddenWords: string[];
}

export interface BrandGuide {
  id: string;
  name: string;
  industry: string;
  tagline: string;
  portalUrl?: string;
  isDefault?: boolean;
  colors: BrandColor[];
  typography: BrandTypography;
  logoRules: BrandLogoRules;
  toneOfVoice: BrandToneOfVoice;
  customRulesText?: string;
  lastUpdated: string;
}

