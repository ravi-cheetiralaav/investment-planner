import { SIPInputs, SIPResults, YearlyData, MonthlyData, SWPInputs, SWPResults, SWPYearlyData } from './types';

export function calculateSIP(inputs: SIPInputs): SIPResults {
  const { years, inflation, monthlyInvestment, stepUp, cagr } = inputs;
  // Convert annual CAGR to equivalent monthly rate: (1 + annual_rate)^(1/12) - 1
  const monthlyRate = Math.pow(1 + cagr / 100, 1 / 12) - 1;
  
  let totalInvested = 0;
  let portfolioValue = 0;
  let currentMonthlySIP = monthlyInvestment;
  const yearlyData: YearlyData[] = [];
  const monthlyData: MonthlyData[] = [];
  let monthCounter = 0;

  for (let year = 1; year <= years; year++) {
    if (year > 1) {
      currentMonthlySIP = currentMonthlySIP * (1 + stepUp / 100);
    }
    const annualInvested = currentMonthlySIP * 12;

    for (let month = 1; month <= 12; month++) {
      monthCounter += 1;
      totalInvested += currentMonthlySIP;
      portfolioValue = portfolioValue * (1 + monthlyRate) + currentMonthlySIP;

      const elapsedYears = monthCounter / 12;
      const monthlyWealthGained = portfolioValue - totalInvested;
      const monthlyInflationAdjustedValue = portfolioValue / Math.pow(1 + inflation / 100, elapsedYears);

      monthlyData.push({
        month: monthCounter,
        year,
        monthInYear: month,
        monthlySIP: currentMonthlySIP,
        totalInvested,
        portfolioValue,
        wealthGained: monthlyWealthGained,
        inflationAdjustedValue: monthlyInflationAdjustedValue,
      });
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
    monthlyData,
  };
}

export function calculateSWP(inputs: SWPInputs): SWPResults {
  const { corpus, monthlyWithdrawal, cagr, inflation, years } = inputs;
  const monthlyRate = Math.pow(1 + cagr / 100, 1 / 12) - 1;

  let currentCorpus = corpus;
  let totalWithdrawn = 0;
  let currentMonthlyWithdrawal = monthlyWithdrawal;
  let corpusLastsMonths: number | null = null;
  let monthsElapsed = 0;

  const yearlyData: SWPYearlyData[] = [];

  for (let year = 1; year <= years; year++) {
    if (year > 1) {
      // Step up withdrawal with inflation each year
      currentMonthlyWithdrawal = currentMonthlyWithdrawal * (1 + inflation / 100);
    }

    const corpusStart = currentCorpus;
    let annualWithdrawn = 0;
    let growthEarned = 0;
    let exhaustedThisYear = false;

    for (let month = 1; month <= 12; month++) {
      if (currentCorpus <= 0) break;
      monthsElapsed++;

      // Withdraw first, then grow remaining (start-of-month withdrawal)
      const withdrawal = Math.min(currentMonthlyWithdrawal, currentCorpus);
      currentCorpus -= withdrawal;
      annualWithdrawn += withdrawal;
      totalWithdrawn += withdrawal;

      const growth = currentCorpus * monthlyRate;
      growthEarned += growth;
      currentCorpus += growth;

      if (currentCorpus <= 0 && corpusLastsMonths === null) {
        corpusLastsMonths = monthsElapsed;
        exhaustedThisYear = true;
        currentCorpus = 0;
      }
    }

    yearlyData.push({
      year,
      monthlyWithdrawal: currentMonthlyWithdrawal,
      annualWithdrawn,
      totalWithdrawn,
      corpusStart,
      corpusEnd: Math.max(0, currentCorpus),
      growthEarned,
      corpusExhausted: exhaustedThisYear,
    });

    if (currentCorpus <= 0) break;
  }

  return {
    initialCorpus: corpus,
    totalWithdrawn,
    finalCorpus: Math.max(0, currentCorpus),
    corpusLastsYears: corpusLastsMonths !== null ? Math.floor(corpusLastsMonths / 12) : null,
    corpusLastsMonths,
    yearlyData,
  };
}
