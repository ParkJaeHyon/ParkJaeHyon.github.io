// Project Types
export type ProjectType = 
  | 'railway' 
  | 'building' 
  | 'roadPaving' 
  | 'roadEarthBridge' 
  | 'agricultural' 
  | 'waterSupply' 
  | 'sewerage';

export type AnalysisMode = 1 | 2 | 3;

// Project Type Configuration
export interface ProjectTypeConfig {
  code: string;
  name: string;
  nameKo: string;
  durationFormula: (params: any) => number;
  workerCount: number;
  fatalityRate: number; // per 10,000
  specificInputs: SpecificInput[];
}

export interface SpecificInput {
  key: string;
  label: string;
  unit: string;
  type: 'number';
  min?: number;
  defaultValue?: number;
}

// Simulation Parameters
export interface SimulationParams {
  projectType: ProjectType;
  analysisMode: AnalysisMode;
  totalCost: number;
  specificParams: Record<string, number>;
  equipmentCount: number;
  
  // Mode 2 specific
  workerReductionRate?: number; // 0-100
  
  // Mode 3 specific
  safetyEfficiency?: number; // 0-100
  wearableUnitPrice?: number; // 웨어러블 장치 개당 가격 ($)
  wearableApplyRate?: number; // 적용 대상 작업자 비율 (0-100%)
  
  // Mode 2 & 3
  techCost?: number;
  
  // Constants (with defaults)
  workerDailyWage: number;
  equipmentDriverDailyWage: number;
  legalCost: number;
  investigationCost: number;
  
  // MCS iterations
  iterations: number;
}

// Simulation Results
export interface SimulationResult {
  projectType: ProjectType;
  analysisMode: AnalysisMode;
  totalCost: number;
  duration: number;
  workers: number;
  potentialDeaths: number;
  fatalityRate: number; // Added
  
  // Calculation details
  calculationDetails?: {
    totalCostUSD: number;
    totalCostKRW: number;
    monthlyWage: number;
    dailyWage: number;
  };
  
  meanSafetyCost: number;
  stdSafetyCost: number;
  
  // Mode 2 & 3
  costReduction?: number; // EMV Saving (사고비용 절감액)
  laborSaving?: number; // Mode 2 only: 인력 감축 편익
  techCost?: number;
  netBenefit?: number;
  
  // Break-even data
  breakEvenData?: BreakEvenPoint[];
  breakEven3DData?: BreakEven3DData;
  
  // Distribution data for charts
  safetyCostDistribution: number[];
  
  // Mode 2 specific
  reductionTable?: ReductionTableRow[];
  
  // Mode 3 specific
  efficiencyTable?: EfficiencyTableRow[];
}

export interface BreakEvenPoint {
  investmentRatio: number; // %
  requiredEfficiency: number; // %
  totalCost: number;
}

// 3D Break-even surface data
export interface BreakEven3DData {
  investmentRatios: number[]; // X axis: 0.01~0.1%
  totalCosts: number[]; // Y axis: range around user input
  requiredEfficiencies: number[][]; // Z axis: 2D array [investmentRatio][totalCost]
}

export interface ReductionTableRow {
  reductionRate: number;
  costReduction: number; // EMV Saving
  laborSaving: number; // Labor Saving
  techCost: number;
  netBenefit: number;
}

export interface EfficiencyTableRow {
  efficiency: number;
  costReduction: number;
  techCost: number;
  netBenefit: number;
}

// Monte Carlo Sample
export interface MCSSample {
  delayDays: number;
  agreementAmount: number;
  penalty: number;
  totalCost: number;
}