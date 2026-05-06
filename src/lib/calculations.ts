import { SIPInputs, SIPResults, YearlyData } from './types';

export function calculateSIP(inputs: SIPInputs): SIPResults {
  const { years, inflation, monthlyInvestment, stepUp, cagr } = inputs;
  // Convert annual CAGR to equivalent monthly rate: (1 + annual_rate)^(1/12) - 1
  const monthlyRate = Math.pow(1 + cagr / 100, 1 / 12) - 1;
  
  let totalInvested = 0;
  let portfolioValue = 0;
  let currentMonthlySIP = monthlyInvestment;
  const yearlyData: YearlyData[] = [];

  for (let year = 1; year <= years; year++) {
    if (year > 1) {
      currentMonthlySIP = currentMonthlySIP * (1 + stepUp / 100);
    }
    const annualInvested = currentMonthlySIP * 12;
    totalInvested += annualInvested;

    for (let month = 1; month <= 12; month++) {
      portfolioValue = portfolioValue * (1 + monthlyRate) + currentMonthlySIP;
    }

    const wealthGained = portfolioValue - totalInvested;
    const inflationAdjustedValue = portfolioValue / Math.pow(1 + inflation / 100, year);

    yearlyData.push({
      year,
      monthlySIP: currentMonthlySIP,
      annualInvested,
      totalInvested,
      portfolioValue,
      wealthGained,
      inflationAdjustedValue,
    });
  }

  const lastYear = yearlyData[yearlyData.length - 1];
  
  return {
    totalInvested,
    estimatedCorpus: portfolioValue,
    wealthGained: portfolioValue - totalInvested,
    inflationAdjustedCorpus: lastYear.inflationAdjustedValue,
    effectiveFirstYearSIP: monthlyInvestment,
    finalYearSIP: currentMonthlySIP,
    yearlyData,
  };
}
