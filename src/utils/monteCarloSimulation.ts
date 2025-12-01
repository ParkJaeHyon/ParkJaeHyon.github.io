import { SimulationParams, SimulationResult, MCSSample, BreakEvenPoint, ReductionTableRow, EfficiencyTableRow } from '../types/simulation';
import { getProjectConfig, getFatalityRate, calculateWorkerCount } from './projectConfigs';
import { 
  EXCHANGE_RATE, 
  WORKER_DAILY_WAGE_USD, 
  WORKER_MONTHLY_WAGE_USD,
  EQUIPMENT_DRIVER_DAILY_WAGE_USD,
  WORKER_DAILY_WAGE_KRW,
  WORKER_MONTHLY_WAGE_KRW,
  EQUIPMENT_DRIVER_DAILY_WAGE_KRW
} from './constants';

// Static data
const delayDaysData = [49.6, 51.4, 63.7, 54.3];

// Agreement data from actual accident cases - in KRW
const agreementDataKRW = [
  110000000,  // 결빙 작업 중 추락사
  120000000,  // 건설현장 운반 작업자 갈림사고
  130000000,  // 지게차 추락사고
  150000000,  // 낙하하는 블록에 맞아 사망
  160000000,  // 건설현장 낙하물 추락 사망사고
  170000000,  // 크레인 사망사고
  170000000,  // 모텔공소 건설 전장 추락사고
  170000000,  // 고소작업대 붕괴로 추락사
  180000000,  // 창호공 서시 작업 중 추락
  200000000,  // 제조업 근로자 지게차 충돌
  200000000,  // 석면 절거현장 해체 작업중 추락
  220000000,  // 포크레인 작업중 충돌
  250000000,  // 건설현장 탑재 떨어짐
  260000000,  // 학자시설 건설현장 추락사고
  310000000,  // 목재세공업체 기업사고
  320000000,  // 건설현장 용접공 추락사망사고
  330000000,  // 철강회사 철판 끼임 사고
  330000000,  // 대기업 건설현장 추락사고
  350000000,  // 공사현장 신주주 차량사고
  350000000,  // 우리금 작업중 추락
  380000000,  // 엘레베이터 추락사고
  380000000,  // 건설현장 추락사고
  450000000,  // 실리콘 제조회사 독발사고
  520000000,  // 건설현장 철판 갈림사고
  550000000,  // 물장 중 사고
  600000000,  // 제조회사 컨베이어벨트 끼임사고
  730000000,  // 공장 내부에서 철강재 갈림
  850000000,  // 승강기 끼임사고
  880000000,  // 건설현장 H-Bean 전도 사고
  1000000000  // GTX 건설 드릴 추락 사고
];

// Penalty data from actual accident cases - in KRW
const penaltyDataKRW = [
  30000000, 100000000, 50000000, 50000000, 20000000, 30000000,
  80000000, 20000000, 20000000, 80000000, 50000000, 50000000,
  80000000, 80000000, 150000000, 80000000, 80000000, 50000000
];

// Export penalty data for use in other components
export { delayDaysData, agreementDataKRW, penaltyDataKRW };

// Convert to USD
const agreementData = agreementDataKRW.map(v => v / EXCHANGE_RATE);
const penaltyData = penaltyDataKRW.map(v => v / EXCHANGE_RATE);

// Calculate lognormal parameters from data
interface LognormalParams {
  mean: number;
  stdDev: number;
}

function calculateLognormalParams(data: number[]): LognormalParams {
  const logData = data.map(x => Math.log(x));
  const mean = logData.reduce((a, b) => a + b, 0) / logData.length;
  const variance = logData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / logData.length;
  const stdDev = Math.sqrt(variance);
  
  return { mean, stdDev };
}

// Sample from lognormal distribution using pre-calculated parameters
function sampleLognormalWithParams(params: LognormalParams): number {
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  
  const logValue = params.mean + params.stdDev * z;
  return Math.exp(logValue);
}

// Lognormal distribution sampling (old function - kept for compatibility)
function sampleLognormal(data: number[]): number {
  const params = calculateLognormalParams(data);
  return sampleLognormalWithParams(params);
}

// Monte Carlo Simulation
export function runMonteCarloSimulation(params: SimulationParams): SimulationResult {
  const config = getProjectConfig(params.projectType);
  
  // Convert totalCost from USD to KRW ONLY for duration formula
  const totalCostKRW = params.totalCost * EXCHANGE_RATE;
  
  console.log('=== 공사기간 계산 ===');
  console.log('총공사비 (USD):', params.totalCost);
  console.log('총공사비 (KRW):', totalCostKRW);
  console.log('사업유형:', config.nameKo);
  
  // Calculate duration using project-specific formula (requires KRW)
  const duration = config.durationFormula({
    totalCost: totalCostKRW, // Use KRW for formula
    ...params.specificParams
  });
  
  console.log('계산된 공사기간 (개월):', duration);
  console.log('');
  
  // Calculate worker count: N = (0.3 × TotalCost) / (monthlyWage × Duration)
  // Use USD for all other calculations
  const monthlyWage = WORKER_MONTHLY_WAGE_USD; // Use fixed monthly wage for worker calculation
  
  console.log('=== 작업자수 계산 ===');
  console.log('공식: N = (0.3 × 총공사비) / (월평균보수 × 공사기간)');
  console.log('총공사비 (USD):', params.totalCost);
  console.log('월평균보수 (USD):', monthlyWage, `(₩${WORKER_MONTHLY_WAGE_KRW.toLocaleString('ko-KR')})`);
  
  const workers = calculateWorkerCount(params.totalCost, duration, monthlyWage); // Use USD
  
  console.log('계산:', `(0.3 × ${params.totalCost}) / (${monthlyWage} × ${duration})`);
  console.log('= ', `${0.3 * params.totalCost} / ${monthlyWage * duration}`);
  console.log('계산된 작업자수:', workers);
  console.log('');
  
  // Get fatality rate based on worker count
  const fatalityRate = getFatalityRate(workers);
  
  // Calculate potential deaths
  const potentialDeaths = (fatalityRate / 10000) * (duration / 12) * workers;
  
  console.log('=== 예상 사망자 수 계산 ===');
  console.log('사망만인율:', fatalityRate);
  console.log('공식: (사망만인율 / 10000) × (공사기간 / 12) × 작업자수');
  console.log('계산:', `(${fatalityRate} / 10000) × (${duration} / 12) × ${workers}`);
  console.log('예상 사망자 수:', potentialDeaths);
  console.log('');
  
  console.log('=== 사고비용 구성 요소 분포 정보 ===');
  console.log('');
  
  // 1. 공사중단일수 (Delay Days) - 로그정규분포
  console.log('1️⃣ 공사중단일수 (Delay Days) - 그정규분포');
  console.log('   데이터:', delayDaysData);
  const logDelayDays = delayDaysData.map(x => Math.log(x));
  const meanLogDelay = logDelayDays.reduce((a, b) => a + b, 0) / logDelayDays.length;
  const varLogDelay = logDelayDays.reduce((sum, val) => sum + Math.pow(val - meanLogDelay, 2), 0) / logDelayDays.length;
  console.log('   로그정규분포 파라미터:');
  console.log('   - μ (평균):', meanLogDelay.toFixed(4));
  console.log('   - σ² (분산):', varLogDelay.toFixed(4));
  console.log('   - σ (표준편차):', Math.sqrt(varLogDelay).toFixed(4));
  console.log('   실제 값 범위:', Math.min(...delayDaysData).toFixed(1), '~', Math.max(...delayDaysData).toFixed(1), '일');
  console.log('');
  
  // 2. 합의금 (Agreement Amount) - 로그정규분포
  console.log('2️⃣ 합의금 (Agreement Amount) - 로그정규분포');
  console.log('   데이터 개수:', agreementData.length, '건');
  console.log('   값 범위 (USD):', formatCurrency(Math.min(...agreementData)), '~', formatCurrency(Math.max(...agreementData)));
  console.log('   값 범위 (KRW):', '₩' + Math.round(Math.min(...agreementData) * EXCHANGE_RATE).toLocaleString('ko-KR'), '~', '₩' + Math.round(Math.max(...agreementData) * EXCHANGE_RATE).toLocaleString('ko-KR'));
  const logAgreement = agreementData.map(x => Math.log(x));
  const meanLogAgreement = logAgreement.reduce((a, b) => a + b, 0) / logAgreement.length;
  const varLogAgreement = logAgreement.reduce((sum, val) => sum + Math.pow(val - meanLogAgreement, 2), 0) / logAgreement.length;
  console.log('   로그정규분포 파라미터:');
  console.log('   - μ (평균):', meanLogAgreement.toFixed(4));
  console.log('   - σ² (분산):', varLogAgreement.toFixed(4));
  console.log('   - σ (표준편차):', Math.sqrt(varLogAgreement).toFixed(4));
  console.log('');
  
  // 3. 벌금 (Penalty) - 로그정규분포
  console.log('3️⃣ 벌금 (Penalty) - 로그정규분포');
  console.log('   데이터 개수:', penaltyData.length, '건');
  console.log('    범위 (USD):', formatCurrency(Math.min(...penaltyData)), '~', formatCurrency(Math.max(...penaltyData)));
  console.log('   값 범위 (KRW):', '₩' + Math.round(Math.min(...penaltyData) * EXCHANGE_RATE).toLocaleString('ko-KR'), '~', '₩' + Math.round(Math.max(...penaltyData) * EXCHANGE_RATE).toLocaleString('ko-KR'));
  const logPenalty = penaltyData.map(x => Math.log(x));
  const meanLogPenalty = logPenalty.reduce((a, b) => a + b, 0) / logPenalty.length;
  const varLogPenalty = logPenalty.reduce((sum, val) => sum + Math.pow(val - meanLogPenalty, 2), 0) / logPenalty.length;
  console.log('   로그정규분포 파라미터:');
  console.log('   - μ (평균):', meanLogPenalty.toFixed(4));
  console.log('   - σ² (분산):', varLogPenalty.toFixed(4));
  console.log('   - σ (표준편차):', Math.sqrt(varLogPenalty).toFixed(4));
  console.log('');
  
  // 4. 법률비용 (Legal Cost) - 고정값
  console.log('4️⃣ 법률비용 (Legal Cost) - 고정값');
  console.log('   값:', formatCurrency(params.legalCost), '(₩' + Math.round(params.legalCost * EXCHANGE_RATE).toLocaleString('ko-KR') + ')');
  console.log('');
  
  // 5. 안전조사비용 (Investigation Cost) - 고정값
  console.log('5️⃣ 안전조사비용 (Investigation Cost) - 고정값');
  console.log('   값:', formatCurrency(params.investigationCost), '(₩' + Math.round(params.investigationCost * EXCHANGE_RATE).toLocaleString('ko-KR') + ')');
  console.log('');
  
  console.log('================================================');
  console.log('');
  
  // Pre-calculate lognormal parameters (1 time only - like CSV loading in Python)
  console.log('=== 로그정규분포 파라미터 사전 계산 ===');
  const delayParams = calculateLognormalParams(delayDaysData);
  const agreementParams = calculateLognormalParams(agreementData);
  const penaltyParams = calculateLognormalParams(penaltyData);
  
  console.log('공사중단일수 - μ:', delayParams.mean.toFixed(4), 'σ:', delayParams.stdDev.toFixed(4));
  console.log('합의금 - μ:', agreementParams.mean.toFixed(4), 'σ:', agreementParams.stdDev.toFixed(4));
  console.log('벌금 - μ:', penaltyParams.mean.toFixed(4), 'σ:', penaltyParams.stdDev.toFixed(4));
  console.log('✅ 파라미터 계산 완료 (1회)');
  console.log('');
  
  // Run Monte Carlo Simulation
  const samples: MCSSample[] = [];
  const safetyCosts: number[] = [];
  
  console.log('=== Monte Carlo 시뮬레이션 시작 (1000회 반복) ===');
  console.log('');
  
  for (let i = 0; i < params.iterations; i++) {
    // Sample from ±10% of total cost
    const costVariation = params.totalCost * (0.9 + Math.random() * 0.2);
    
    // Sample from distributions using pre-calculated parameters
    const delayDays = sampleLognormalWithParams(delayParams);
    const agreementAmount = sampleLognormalWithParams(agreementParams);
    const penalty = sampleLognormalWithParams(penaltyParams);
    
    // Calculate delay cost: 중단일수 × (작업자수 × 일평균보수 + 장비수 × 운전사보수)
    // Use fixed daily wages
    const delayCost = delayDays * (workers * WORKER_DAILY_WAGE_USD + params.equipmentCount * EQUIPMENT_DRIVER_DAILY_WAGE_USD);
    
    // Calculate total accident cost
    const accidentCost = (
      agreementAmount + 
      params.legalCost + 
      params.investigationCost + 
      delayCost + 
      penalty
    ) * potentialDeaths;
    
    // Log first 3 iterations for demonstration
    if (i < 3) {
      console.log(`--- 반복 ${i + 1} ---`);
      console.log('공사중단일수:', delayDays.toFixed(2), '일');
      console.log('합의금:', formatCurrency(agreementAmount));
      console.log('벌금:', formatCurrency(penalty));
      console.log('공사중단비용:', formatCurrency(delayCost), `(${delayDays.toFixed(2)}일 × (${workers.toFixed(1)}명 × ${formatCurrency(WORKER_DAILY_WAGE_USD)} + ${params.equipmentCount}대 × ${formatCurrency(EQUIPMENT_DRIVER_DAILY_WAGE_USD)}))`);
      console.log('법적비용:', formatCurrency(params.legalCost));
      console.log('조사비용:', formatCurrency(params.investigationCost));
      console.log('1건당 사고비용:', formatCurrency(agreementAmount + params.legalCost + params.investigationCost + delayCost + penalty));
      console.log('예상 사망자 수:', potentialDeaths.toFixed(4));
      console.log('총 사고비용 (EMV):', formatCurrency(accidentCost));
      console.log('');
    }
    
    samples.push({
      delayDays,
      agreementAmount,
      penalty,
      totalCost: accidentCost
    });
    
    safetyCosts.push(accidentCost);
  }
  
  // Calculate statistics
  const meanSafetyCost = safetyCosts.reduce((a, b) => a + b, 0) / safetyCosts.length;
  const variance = safetyCosts.reduce((sum, val) => sum + Math.pow(val - meanSafetyCost, 2), 0) / safetyCosts.length;
  const stdSafetyCost = Math.sqrt(variance);
  
  console.log('=== 평균 안전비용 (EMV) 계산 과정 ===');
  console.log('');
  console.log('📋 사고비용 구성요소 (1건당):');
  console.log('   사고비용 = 합의금 + 법률비용 + 조사비용 + 공사중단비용 + 벌금');
  console.log('');
  console.log('📊 총 사고비용 (EMV) 계산:');
  console.log('   총 사고비용 = 1건당 사고비용 × 예상 사망자 수');
  console.log('   예상 사망자 수 =', potentialDeaths.toFixed(4), '명');
  console.log('');
  console.log('🔄 Monte Carlo 시뮬레이션:');
  console.log('   - 각 반복마다 로그정규분포에서 합의금, 벌금, 공사중단일수 샘플링');
  console.log('   - 1000회 반복하여 1000개의 총 사고비용 계산');
  console.log('   - 모든 값의 평균을 구하여 최종 EMV 산출');
  console.log('');
  console.log('💡 평균 안전비용 (EMV) 계산:');
  const totalSum = safetyCosts.reduce((a, b) => a + b, 0);
  console.log('   합계:', formatCurrency(totalSum));
  console.log('   반복 횟수:', safetyCosts.length);
  console.log('   평균 =', formatCurrency(totalSum), '÷', safetyCosts.length);
  console.log('   평균 =', formatCurrency(meanSafetyCost));
  console.log('');
  
  console.log('=== Monte Carlo 시뮬레이션 결과 ===');
  console.log('총 반복 횟수:', params.iterations);
  console.log('최소값:', formatCurrency(Math.min(...safetyCosts)));
  console.log('최대값:', formatCurrency(Math.max(...safetyCosts)));
  console.log('평균 안전비용 (EMV):', formatCurrency(meanSafetyCost));
  console.log('표준편차:', formatCurrency(stdSafetyCost));
  console.log('');
  
  // Mode-specific calculations
  let costReduction: number | undefined;
  let laborSaving: number | undefined;
  let netBenefit: number | undefined;
  let breakEvenData: BreakEvenPoint[] | undefined;
  let reductionTable: ReductionTableRow[] | undefined;
  let efficiencyTable: EfficiencyTableRow[] | undefined;
  let calculatedTechCost: number | undefined; // Store calculated tech cost for Mode 2 & 3
  
  if (params.analysisMode === 2) {
    // Mode 2: Labor reduction
    const reductionRate = (params.workerReductionRate || 0) / 100;
    
    // ① EMV Saving: 사고비용 절감액
    const emvSaving = meanSafetyCost * reductionRate;
    
    // ② Labor Saving: 인력 감축 편익
    // (감소된 작업자 수) × 일당 × 총 작업일수
    const reducedWorkers = workers * reductionRate;
    const totalWorkDays = duration * 30; // 개월 → 일수 (근사값)
    laborSaving = reducedWorkers * params.workerDailyWage * totalWorkDays;
    
    // ③ Tech Cost: 월 사용료 × 공사기간
    const totalTechCost = (params.techCost || 0) * duration;
    calculatedTechCost = totalTechCost; // Store for return
    
    // ④ Net Benefit: 총편익
    costReduction = emvSaving;
    netBenefit = emvSaving + laborSaving - totalTechCost;
    
    console.log('\n=== 🔵 Mode 2: 인력감축형 장비 경제성 분석 ===');
    console.log('📊 입력 파라미터:');
    console.log('   작업자 감소율:', (params.workerReductionRate || 0), '%');
    console.log('   월 사용료 (입력값):', formatCurrency(params.techCost || 0));
    console.log('   공사기간:', duration.toFixed(2), '개월');
    console.log('');
    console.log('① EMV Saving (사고비용 절감액):');
    console.log('   공식: Base_EMV × 감소율');
    console.log('   계산:', formatCurrency(meanSafetyCost), '×', reductionRate.toFixed(2));
    console.log('   결과:', formatCurrency(emvSaving));
    console.log('');
    console.log('② Labor Saving (인력 감축 편익):');
    console.log('   공식: (기존 인력 × 감소율) × 일당 × 공사기간(일)');
    console.log('   감소된 작업자 수:', reducedWorkers.toFixed(2), '명');
    console.log('   총 작업일수:', totalWorkDays.toFixed(0), '일');
    console.log('   일당:', formatCurrency(params.workerDailyWage));
    console.log('   계산:', reducedWorkers.toFixed(2), '×', formatCurrency(params.workerDailyWage), '×', totalWorkDays.toFixed(0));
    console.log('   결과:', formatCurrency(laborSaving));
    console.log('');
    console.log('③ Tech Cost (기술 도입 비용):');
    console.log('   공식: 월 사용료 × 공사기간(개월)');
    console.log('   월 사용료:', formatCurrency(params.techCost || 0));
    console.log('   공사기간:', duration.toFixed(2), '개월');
    console.log('   계산:', formatCurrency(params.techCost || 0), '×', duration.toFixed(2));
    console.log('   결과:', formatCurrency(totalTechCost));
    console.log('');
    console.log('④ Total Benefit (총편익):');
    console.log('   공식: EMV Saving + Labor Saving - Tech Cost');
    console.log('   계산:', formatCurrency(emvSaving), '+', formatCurrency(laborSaving), '-', formatCurrency(totalTechCost));
    console.log('   결과:', formatCurrency(netBenefit));
    console.log('   판정:', netBenefit >= 0 ? '✅ 경제적 타당성 있음' : '❌ 경제적 타당성 없음');
    console.log('=== Mode 2 분석 완료 ===\n');
    
    // Generate reduction table for different rates
    reductionTable = [];
    for (let rate = 10; rate <= 100; rate += 10) {
      const r = rate / 100;
      const emvSave = meanSafetyCost * r;
      const redWorkers = workers * r;
      const laborSave = redWorkers * params.workerDailyWage * totalWorkDays;
      const nb = emvSave + laborSave - totalTechCost;
      reductionTable.push({
        reductionRate: rate,
        costReduction: emvSave,
        laborSaving: laborSave,
        techCost: totalTechCost,
        netBenefit: nb
      });
    }
  } else if (params.analysisMode === 3) {
    // Mode 3: Safety efficiency
    const efficiency = (params.safetyEfficiency || 0) / 100;
    costReduction = meanSafetyCost * efficiency;
    
    // Calculate tech cost: Unit Price × Workers × Apply Rate
    const unitPrice = params.wearableUnitPrice || 0;
    const applyRate = (params.wearableApplyRate || 0) / 100;
    const totalTechCost = unitPrice * workers * applyRate;
    calculatedTechCost = totalTechCost; // Store for return
    
    netBenefit = costReduction - totalTechCost;
    
    console.log('\n=== 🟢 Mode 3: 웨어러블 안전장치 경제성 분석 ===');
    console.log('📊 입력 파라미터:');
    console.log('   사고예방 효율:', (params.safetyEfficiency || 0), '%');
    console.log('   웨어러블 개당 가격 (입력값):', formatCurrency(unitPrice));
    console.log('   적용 비율 (입력값):', (params.wearableApplyRate || 0), '%');
    console.log('');
    console.log('① EMV Saving (사고비용 절감액):');
    console.log('   공식: Base_EMV × 사고예방 효율');
    console.log('   계산:', formatCurrency(meanSafetyCost), '×', efficiency.toFixed(2));
    console.log('   결과:', formatCurrency(costReduction));
    console.log('');
    console.log('② Tech Cost (기술 도입 비용):');
    console.log('   공식: 개당 가격 × 작업자 수 × 적용 비율');
    console.log('   개당 가격:', formatCurrency(unitPrice));
    console.log('   작업자 수:', workers.toFixed(2), '명');
    console.log('   적용 비율:', (applyRate * 100).toFixed(0), '%');
    console.log('   계산:', formatCurrency(unitPrice), '×', workers.toFixed(2), '×', applyRate.toFixed(2));
    console.log('   결과:', formatCurrency(totalTechCost));
    console.log('');
    console.log('③ Net Benefit (순편익):');
    console.log('   공식: EMV Saving - Tech Cost');
    console.log('   계산:', formatCurrency(costReduction), '-', formatCurrency(totalTechCost));
    console.log('   결과:', formatCurrency(netBenefit));
    console.log('   판정:', netBenefit >= 0 ? '✅ 경제적 타당성 있음' : '❌ 경제적 타당성 없음');
    console.log('=== Mode 3 분석 완료 ===\n');
    
    // Generate efficiency table
    efficiencyTable = [];
    for (let eff = 10; eff <= 100; eff += 10) {
      const e = eff / 100;
      const saving = meanSafetyCost * e;
      const nb = saving - totalTechCost;
      efficiencyTable.push({
        efficiency: eff,
        costReduction: saving,
        techCost: totalTechCost,
        netBenefit: nb
      });
    }
  }
  
  // Calculate break-even data for 3D chart
  breakEvenData = [];
  const investmentRatios = [0.5, 1, 2, 3, 4, 5, 7, 10, 15, 20];
  const costLevels = [
    params.totalCost * 0.5,
    params.totalCost * 0.75,
    params.totalCost,
    params.totalCost * 1.25,
    params.totalCost * 1.5
  ];
  
  for (const ratio of investmentRatios) {
    for (const cost of costLevels) {
      // Required Efficiency = (Investment Ratio × Total Cost) / Mean Safety
      const requiredEfficiency = (ratio / 100 * cost) / meanSafetyCost * 100;
      if (requiredEfficiency <= 200) { // Cap at 200% for visualization
        breakEvenData.push({
          investmentRatio: ratio,
          requiredEfficiency: Math.max(0, requiredEfficiency),
          totalCost: cost
        });
      }
    }
  }
  
  // Calculate 3D Break-even surface data
  const breakEven3DData = calculate3DBreakEvenSurface(params, config, monthlyWage, fatalityRate, delayParams, agreementParams, penaltyParams);
  
  return {
    projectType: params.projectType,
    analysisMode: params.analysisMode,
    totalCost: params.totalCost,
    duration,
    workers,
    potentialDeaths,
    fatalityRate,
    calculationDetails: {
      totalCostUSD: params.totalCost,
      totalCostKRW: totalCostKRW,
      monthlyWage: monthlyWage,
      dailyWage: params.workerDailyWage,
      wearableUnitPrice: params.wearableUnitPrice,
      wearableApplyRate: params.wearableApplyRate,
      technologyEfficiency: params.technologyEfficiency,
      investmentRatio: params.investmentRatio,
      safetyEfficiency: params.safetyEfficiency
    },
    meanSafetyCost,
    stdSafetyCost,
    costReduction,
    laborSaving,
    techCost: calculatedTechCost, // Use stored value
    netBenefit,
    workerReductionRate: params.workerReductionRate,
    safetyEfficiency: params.safetyEfficiency,
    breakEvenData,
    safetyCostDistribution: safetyCosts.sort((a, b) => a - b),
    reductionTable,
    efficiencyTable,
    breakEven3DData
  };
}

// Format currency in USD
export function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

// Format number with decimals
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// Calculate mean safety cost for a given total cost
// This runs a full Monte Carlo simulation (1000 iterations) for the given total cost
function calculateMeanSafetyCostForTotalCost(
  totalCost: number, 
  params: SimulationParams,
  config: any,
  monthlyWage: number,
  delayParams: LognormalParams,
  agreementParams: LognormalParams,
  penaltyParams: LognormalParams,
  fixedFatalityRate?: number  // Use fixed fatality rate if provided
): {
  meanSafetyCost: number;
  duration: number;
  workers: number;
  potentialDeaths: number;
  avgAgreement: number;
  avgPenalty: number;
  avgDelayCost: number;
  avgAccidentCostPerEvent: number;
} {
  // 1. Calculate duration
  const totalCostKRW = totalCost * EXCHANGE_RATE;
  const duration = config.durationFormula({
    totalCost: totalCostKRW,
    ...params.specificParams
  });
  
  // 2. Calculate workers
  const workers = calculateWorkerCount(totalCost, duration, monthlyWage);
  
  // 3. Get fatality rate - use fixed rate if provided, otherwise calculate
  const fatalityRate = fixedFatalityRate !== undefined ? fixedFatalityRate : getFatalityRate(workers);
  
  // 4. Calculate potential deaths
  const potentialDeaths = (fatalityRate / 10000) * (duration / 12) * workers;
  
  // 5. Run Monte Carlo simulation (1000 iterations) - just like Python code
  const safetyCosts: number[] = [];
  const agreements: number[] = [];
  const penalties: number[] = [];
  const delayCosts: number[] = [];
  const accidentCostsPerEvent: number[] = [];
  
  for (let i = 0; i < 1000; i++) {
    // Sample from distributions using pre-calculated parameters
    const delayDays = sampleLognormalWithParams(delayParams);
    const agreementAmount = sampleLognormalWithParams(agreementParams);
    const penalty = sampleLognormalWithParams(penaltyParams);
    
    // Calculate delay cost
    const delayCost = delayDays * (workers * WORKER_DAILY_WAGE_USD + params.equipmentCount * EQUIPMENT_DRIVER_DAILY_WAGE_USD);
    
    // Calculate accident cost per event (before multiplying by potential deaths)
    const accidentCostPerEvent = agreementAmount + params.legalCost + params.investigationCost + delayCost + penalty;
    
    // Calculate total accident cost (with potential deaths)
    const accidentCost = accidentCostPerEvent * potentialDeaths;
    
    safetyCosts.push(accidentCost);
    agreements.push(agreementAmount);
    penalties.push(penalty);
    delayCosts.push(delayCost);
    accidentCostsPerEvent.push(accidentCostPerEvent);
  }
  
  // Calculate means
  const meanSafetyCost = safetyCosts.reduce((a, b) => a + b, 0) / safetyCosts.length;
  const avgAgreement = agreements.reduce((a, b) => a + b, 0) / agreements.length;
  const avgPenalty = penalties.reduce((a, b) => a + b, 0) / penalties.length;
  const avgDelayCost = delayCosts.reduce((a, b) => a + b, 0) / delayCosts.length;
  const avgAccidentCostPerEvent = accidentCostsPerEvent.reduce((a, b) => a + b, 0) / accidentCostsPerEvent.length;
  
  return {
    meanSafetyCost,
    duration,
    workers,
    potentialDeaths,
    avgAgreement,
    avgPenalty,
    avgDelayCost,
    avgAccidentCostPerEvent
  };
}

// Calculate 3D Break-even surface data
function calculate3DBreakEvenSurface(params: SimulationParams, config: any, monthlyWage: number, fatalityRate: number, delayParams: LognormalParams, agreementParams: LognormalParams, penaltyParams: LognormalParams) {
  console.log('=== 3D Break-even Surface 계산 시작 ===');
  console.log('입력값:');
  console.log('  - 총공사비 (Total Cost):', formatCurrency(params.totalCost));
  console.log('  - 평균 안전비용 (Mean Safety Cost):', formatCurrency(params.totalCost * 0.3 / (monthlyWage * config.durationFormula({ totalCost: params.totalCost * EXCHANGE_RATE, ...params.specificParams }) / 12)));
  console.log('');
  
  // X axis: Investment Ratio (0.01% ~ 0.1%) - 20 points
  const investmentRatios: number[] = [];
  for (let i = 0; i <= 20; i++) {
    investmentRatios.push(0.01 + (i / 20) * (0.1 - 0.01));
  }
  
  console.log('X축 (Investment Ratio): 0.01% ~ 0.1% (21개 포인트)');
  console.log('  샘플:', investmentRatios.slice(0, 5).map(r => r.toFixed(4) + '%').join(', '), '...');
  console.log('');
  
  // Y axis: Total Cost range with user input in the middle - 20 points
  // Calculate range so that totalCost is in the middle
  const totalCosts: number[] = [];
  const costMin = params.totalCost * 0.7; // User input will be at middle
  const costMax = params.totalCost * 1.3;
  for (let i = 0; i <= 20; i++) {
    totalCosts.push(costMin + (i / 20) * (costMax - costMin));
  }
  
  console.log('Y축 (Total Cost): 70% ~ 130% of user input (21개 포인트)');
  console.log('  범위:', formatCurrency(costMin), '~', formatCurrency(costMax));
  console.log('  샘플:', totalCosts.slice(0, 3).map(c => formatCurrency(c)).join(', '), '...');
  console.log('');
  
  // Calculate and display table for Total Cost variations
  console.log('📊 Total Cost 변화에 따른 값 계산:');
  console.log(`⚠️ 사망만인율 고정: ${fatalityRate} (사용자 입력 Total Cost 기준)`);
  console.log('');
  
  const costVariationTable: any[] = [];
  const meanSafetyCostsByTotalCost: number[] = []; // Store calculated Mean Safety Costs
  
  for (const cost of totalCosts) {
    // Run full Monte Carlo simulation for this Total Cost with FIXED fatality rate
    const result = calculateMeanSafetyCostForTotalCost(cost, params, config, monthlyWage, delayParams, agreementParams, penaltyParams, fatalityRate);
    
    meanSafetyCostsByTotalCost.push(result.meanSafetyCost); // Store for Z-axis calculation
    
    costVariationTable.push({
      'Total Cost ($)': formatCurrency(cost),
      'Duration (months)': result.duration.toFixed(2),
      'Workers': result.workers.toFixed(1),
      'Fatality Rate': fatalityRate.toFixed(2),
      'Potential Deaths': result.potentialDeaths.toFixed(6),
      'Avg Agreement': formatCurrency(result.avgAgreement),
      'Avg Penalty': formatCurrency(result.avgPenalty),
      'Avg Delay Cost': formatCurrency(result.avgDelayCost),
      'Avg Accident Cost (1 event)': formatCurrency(result.avgAccidentCostPerEvent),
      'Mean Safety Benefit ($)': formatCurrency(result.meanSafetyCost)
    });
  }
  
  console.table(costVariationTable);
  console.log('');
  
  // Z axis: Required Safety Efficiency - 2D array [investmentRatio][totalCost]
  const requiredEfficiencies: number[][] = [];
  
  console.log('Z축 (Required Safety Efficiency) 계산:');
  console.log('공식: (Investment Ratio / 100) × Total Cost / Mean Safety Cost × 100');
  console.log('⚠️ 표에서 이미 계산된 Mean Safety Benefit 값을 재사용합니다');
  console.log('');
  
  console.log('샘플 계산:');
  
  for (let i = 0; i < investmentRatios.length; i++) {
    const ratio = investmentRatios[i];
    const row: number[] = [];
    
    for (let j = 0; j < totalCosts.length; j++) {
      const cost = totalCosts[j];
      
      // ✅ Use pre-calculated Mean Safety Cost from table (no recalculation!)
      const meanSafetyCostForThisCost = meanSafetyCostsByTotalCost[j];
      
      // Formula: Required Efficiency = (Investment Ratio × Total Cost) / Mean Safety Cost
      // Investment Ratio is in % (e.g., 0.01%), so divide by 100 to get actual ratio
      const investmentAmount = (ratio / 100) * cost;
      const requiredEfficiency = investmentAmount / meanSafetyCostForThisCost * 100;
      const cappedEfficiency = Math.min(100, Math.max(0, requiredEfficiency));
      
      // Log specific samples: 0.01% (first & last), 0.1% (first & last)
      const isFirstRatio = i === 0; // 0.01%
      const isLastRatio = i === investmentRatios.length - 1; // 0.1%
      const isFirstCost = j === 0;
      const isLastCost = j === totalCosts.length - 1;
      
      if ((isFirstRatio || isLastRatio) && (isFirstCost || isLastCost)) {
        const costPosition = isFirstCost ? '첫 번째' : '마지막';
        console.log(`  📍 Investment Ratio: ${ratio.toFixed(4)}% × Total Cost (${costPosition}): ${formatCurrency(cost)}`);
        console.log(`     표에서 계산된 Mean Safety Benefit: ${formatCurrency(meanSafetyCostForThisCost)}`);
        console.log(`     투자금액 = ${ratio.toFixed(4)}% × ${formatCurrency(cost)} = ${formatCurrency(investmentAmount)}`);
        console.log(`     Required Efficiency = ${formatCurrency(investmentAmount)} / ${formatCurrency(meanSafetyCostForThisCost)} × 100`);
        console.log(`     = ${requiredEfficiency.toFixed(2)}%`);
        if (cappedEfficiency !== requiredEfficiency) {
          console.log(`     (100%로 제한됨: ${cappedEfficiency.toFixed(2)}%)`);
        }
        console.log('');
      }
      
      row.push(cappedEfficiency);
    }
    requiredEfficiencies.push(row);
  }
  
  console.log(`총 ${investmentRatios.length} × ${totalCosts.length} = ${investmentRatios.length * totalCosts.length}개 데이터 포인트 생성됨`);
  console.log('');
  console.log('=== 3D Break-even Surface 계산 완료 ===');
  console.log('');
  
  return {
    investmentRatios,
    totalCosts,
    requiredEfficiencies
  };
}