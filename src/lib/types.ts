export interface SIPInputs {
  years: number;
  inflation: number;
  monthlyInvestment: number;
  stepUp: number;
  cagr: number;
}

export interface YearlyData {
  year: number;
  monthlySIP: number;
  annualInvested: number;
  totalInvested: number;
  portfolioValue: number;
  wealthGained: number;
  inflationAdjustedValue: number;
}

export interface SIPResults {
  totalInvested: number;
  estimatedCorpus: number;
  wealthGained: number;
  inflationAdjustedCorpus: number;
  effectiveFirstYearSIP: number;
  finalYearSIP: number;
  yearlyData: YearlyData[];
}

export interface FXRates {
  USD: number;
  AUD: number;
  updatedAt: string;
  /** 'live' = freshly fetched; 'cached' = from localStorage; 'fallback' = secondary API */
  source?: 'live' | 'cached' | 'fallback';
}

export const DEFAULT_INPUTS: SIPInputs = {
  years: 10,
  inflation: 6,
  monthlyInvestment: 25000,
  stepUp: 0,
  cagr: 12,
};

export const ALLOWED_YEARS = [3, 5, 10, 15, 20, 25, 30];

export const PRESETS = {
  Conservative: { cagr: 8, stepUp: 0 },
  Balanced: { cagr: 12, stepUp: 5 },
  Growth: { cagr: 15, stepUp: 10 },
};
