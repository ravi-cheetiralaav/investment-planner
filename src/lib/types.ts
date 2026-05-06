export interface SIPInputs {
  years: number;
  inflation: number;
  monthlyInvestment: number;
  stepUp: number;
  cagr: number;
  lumpsum: number; // annual lump sum invested at start of each year (₹)
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

export interface MonthlyData {
  month: number;
  year: number;
  monthInYear: number;
  monthlySIP: number;
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
  monthlyData: MonthlyData[];
}

export interface FXRates {
  USD: number;
  AUD: number;
  EUR: number;
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
  lumpsum: 0,
};

export const ALLOWED_YEARS = [3, 5, 10, 15, 20, 25, 30];

export const PRESETS = {
  Conservative: { cagr: 8, stepUp: 0 },
  Balanced: { cagr: 12, stepUp: 5 },
  Growth: { cagr: 15, stepUp: 10 },
};

export interface SWPInputs {
  corpus: number;          // Starting corpus (₹)
  monthlyWithdrawal: number; // Fixed monthly withdrawal (₹)
  cagr: number;            // Expected annual return (%)
  inflation: number;       // Inflation rate (%)
  years: number;           // How many years to project
}

export interface SWPYearlyData {
  year: number;
  monthlyWithdrawal: number;       // withdrawal at start of this year (inflation-stepped)
  annualWithdrawn: number;         // total withdrawn in this year
  totalWithdrawn: number;          // cumulative total withdrawn
  corpusStart: number;             // corpus at start of year
  corpusEnd: number;               // corpus at end of year
  growthEarned: number;            // investment growth earned this year
  corpusExhausted: boolean;        // true if corpus ran out this year
}

export interface SWPResults {
  initialCorpus: number;
  totalWithdrawn: number;
  finalCorpus: number;
  corpusLastsYears: number | null; // null = lasts beyond projection period
  corpusLastsMonths: number | null;
  yearlyData: SWPYearlyData[];
}

export const DEFAULT_SWP_INPUTS: SWPInputs = {
  corpus: 10000000,      // ₹1 Cr default
  monthlyWithdrawal: 50000,
  cagr: 10,
  inflation: 6,
  years: 20,
};
