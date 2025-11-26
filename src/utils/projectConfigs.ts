import { ProjectType, ProjectTypeConfig } from '../types/simulation';

export const projectConfigs: Record<ProjectType, ProjectTypeConfig> = {
  railway: {
    code: '①',
    name: 'Railway',
    nameKo: '철도',
    durationFormula: (params) => {
      const RL = params.length; // km
      const C = params.totalCost; // KRW
      return (-1723.316 - 74.260 * Math.log(RL * 1000) + 372.266 * Math.log(C / 1000000)) / 30;
    },
    workerCount: 0, // Will be calculated
    fatalityRate: 0, // Will be calculated based on worker count
    specificInputs: [
      { key: 'length', label: 'Railway Length (RL)', unit: 'km', type: 'number', min: 0.1, defaultValue: 10 }
    ]
  },
  
  building: {
    code: '②',
    name: 'Building',
    nameKo: '건축',
    durationFormula: (params) => {
      const U = params.undergroundFloors; // 지하층수
      const O = params.abovegroundFloors; // 지상층수
      const A = params.floorArea; // 연면적 (㎡)
      const C = params.totalCost; // KRW
      return (-68.55 + 18.198 * U + 12.079 * O - 5.25 * Math.log(A) + 167.632 * Math.log(C / 100000000)) / 30;
    },
    workerCount: 0,
    fatalityRate: 0,
    specificInputs: [
      { key: 'undergroundFloors', label: 'Underground Floors (U)', unit: 'floors', type: 'number', min: 0, defaultValue: 2 },
      { key: 'abovegroundFloors', label: 'Above Ground Floors (O)', unit: 'floors', type: 'number', min: 1, defaultValue: 10 },
      { key: 'floorArea', label: 'Total Floor Area (A)', unit: 'm²', type: 'number', min: 100, defaultValue: 5000 }
    ]
  },
  
  roadPaving: {
    code: '③',
    name: 'Road Paving',
    nameKo: '도로포장',
    durationFormula: (params) => {
      const L = params.length * 1000; // km to m
      const C = params.totalCost / 1000000; // KRW to 백만원
      return -637.009 + 173.198 * Math.log(L) + 0.049 * C;
    },
    workerCount: 0,
    fatalityRate: 0,
    specificInputs: [
      { key: 'length', label: 'Road Length (L)', unit: 'km', type: 'number', min: 0.1, defaultValue: 20 }
    ]
  },
  
  roadEarthBridge: {
    code: '④',
    name: 'Road Earth + Bridge',
    nameKo: '도로 토공+교량',
    durationFormula: (params) => {
      const W = params.width; // 도로폭
      const L = params.length * 1000; // km to m
      const BL = params.bridgeLength; // 교량연장
      const C = params.totalCost / 1000000; // KRW to 백만원
      return -160.855 - 14.288 * W + 164.473 * Math.log(L) - 1.474 * BL + 0.052 * C;
    },
    workerCount: 0,
    fatalityRate: 0,
    specificInputs: [
      { key: 'width', label: 'Road Width (W)', unit: 'm', type: 'number', min: 1, defaultValue: 12 },
      { key: 'length', label: 'Length (L)', unit: 'km', type: 'number', min: 0.1, defaultValue: 15 },
      { key: 'bridgeLength', label: 'Bridge Length (BL)', unit: 'm', type: 'number', min: 0, defaultValue: 500 }
    ]
  },
  
  agricultural: {
    code: '⑤',
    name: 'Agricultural Irrigation',
    nameKo: '농업용수',
    durationFormula: (params) => {
      const C = params.totalCost; // KRW
      return -2251.569 + 415.137 * Math.log(C);
    },
    workerCount: 0,
    fatalityRate: 0,
    specificInputs: [
      { key: 'length', label: 'Pipeline Length', unit: 'km', type: 'number', min: 0, defaultValue: 10 },
      { key: 'diameter', label: 'Pipe Diameter', unit: 'mm', type: 'number', min: 0, defaultValue: 500 }
    ]
  },
  
  waterSupply: {
    code: '⑥',
    name: 'Water Supply',
    nameKo: '상수도',
    durationFormula: (params) => {
      const D = params.diameter; // 관경
      const S = params.facilities; // 시설 수
      const C = params.totalCost; // KRW
      return -1175.174 + 119.731 * S - 0.273 * D + 222.426 * Math.log(C);
    },
    workerCount: 0,
    fatalityRate: 0,
    specificInputs: [
      { key: 'diameter', label: 'Pipe Diameter (D)', unit: 'mm', type: 'number', min: 0, defaultValue: 600 },
      { key: 'facilities', label: 'Number of Facilities (S)', unit: 'ea', type: 'number', min: 1, defaultValue: 5 },
      { key: 'length', label: 'Pipeline Length', unit: 'km', type: 'number', min: 0, defaultValue: 12 }
    ]
  },
  
  sewerage: {
    code: '⑦',
    name: 'Sewerage',
    nameKo: '하수도',
    durationFormula: (params) => {
      const SL = params.length * 1000; // km to m
      const C = params.totalCost / 1000000; // KRW to 백만원
      return -452.433 + 98.364 * Math.log(SL) + 0.083 * C;
    },
    workerCount: 0,
    fatalityRate: 0,
    specificInputs: [
      { key: 'length', label: 'Length (SL)', unit: 'km', type: 'number', min: 0.1, defaultValue: 10 },
      { key: 'diameter', label: 'Pipe Diameter', unit: 'mm', type: 'number', min: 0, defaultValue: 800 }
    ]
  }
};

export const getProjectConfig = (type: ProjectType): ProjectTypeConfig => {
  return projectConfigs[type];
};

// Calculate fatality rate based on worker count
export function getFatalityRate(workerCount: number): number {
  if (workerCount < 5) return 7.45;
  if (workerCount < 10) return 3.74;
  if (workerCount < 30) return 2.87;
  if (workerCount < 50) return 2.31;
  if (workerCount < 100) return 2.20;
  if (workerCount < 300) return 1.56;
  if (workerCount < 500) return 1.02;
  if (workerCount < 1000) return 0.78;
  return 0.46;
}

// Calculate worker count based on total cost and duration
export function calculateWorkerCount(totalCost: number, duration: number, monthlyWage: number = 3000000): number {
  // N = (0.3 × TotalCost) / (월평균보수 × Duration)
  return (0.3 * totalCost) / (monthlyWage * duration);
}