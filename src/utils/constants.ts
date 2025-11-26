// Exchange Rate
export const EXCHANGE_RATE = 1372.5; // KRW to USD

// Fixed values in KRW
export const WORKER_DAILY_WAGE_KRW = 154905; // 공사중단비용 계산용 일평균 보수
export const WORKER_MONTHLY_WAGE_KRW = 4647165; // 작업자수 계산용 월평균 보수
export const EQUIPMENT_DRIVER_DAILY_WAGE_KRW = 249549;
export const LEGAL_COST_KRW = 400000000; // Will be overridden by fixed USD value
export const INVESTIGATION_COST_KRW = 50000000; // Will be overridden by fixed USD value

// Fixed values in USD (not dependent on exchange rate)
export const LEGAL_COST_USD = 291439; // Fixed: 법률 비용
export const INVESTIGATION_COST_USD = 36430; // Fixed: 안전 조사비용

// Fixed wages in USD (converted from KRW)
export const WORKER_DAILY_WAGE_USD = WORKER_DAILY_WAGE_KRW / EXCHANGE_RATE; // ≈ $112.88 (공사중단비용용)
export const WORKER_MONTHLY_WAGE_USD = WORKER_MONTHLY_WAGE_KRW / EXCHANGE_RATE; // ≈ $3,386.24 (작업자수 계산용)
export const EQUIPMENT_DRIVER_DAILY_WAGE_USD = EQUIPMENT_DRIVER_DAILY_WAGE_KRW / EXCHANGE_RATE; // ≈ $181.85

// Format currency in USD
export function formatCurrencyUSD(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

// Format number with decimals
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}