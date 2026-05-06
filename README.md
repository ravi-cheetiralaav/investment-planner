# SIP Growth Calculator

A comprehensive Systematic Investment Plan (SIP) calculator built with Next.js 16, TypeScript, Tailwind CSS, and Recharts. Deployed as a static site on GitHub Pages.

## Features

- 📈 SIP corpus projection with monthly compounding
- 📊 Interactive charts (line, bar, pie) powered by Recharts
- 💱 Real-time INR → USD/AUD exchange rate hints
- 🔄 Annual step-up (increasing SIP) support
- 📉 Inflation-adjusted (real) value calculation
- ⚖️ What-if scenario comparison
- 🔗 Shareable URL with encoded parameters
- 📥 CSV export of year-by-year breakdown
- 🖨️ Print-friendly layout
- 💾 Persists last inputs in localStorage

## Tech Stack

- **Framework**: Next.js 16 (App Router, static export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Deployment**: GitHub Pages

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

The static output is generated in the `out/` directory.

## GitHub Pages Deployment

Set the following environment variable for your GitHub Pages deployment:

```
NEXT_PUBLIC_BASE_PATH=/investment-planner
```

The GitHub Actions workflow should build and deploy the `out/` directory.

## Project Structure

```
src/
  app/
    layout.tsx         # Root layout with metadata
    page.tsx           # Main page (client component)
    globals.css        # Global styles + Tailwind
  components/
    CalculatorForm.tsx  # Input form with validation
    SummaryCards.tsx    # Result summary cards
    GrowthChart.tsx     # Line/bar/pie charts
    ResultsTable.tsx    # Year-by-year table
    AssumptionsPanel.tsx # Collapsible methodology panel
    CurrencyHint.tsx    # INR → USD/AUD conversion hint
    Tooltip.tsx         # Info tooltip component
    WhatIfComparison.tsx # Side-by-side scenario comparison
  lib/
    calculations.ts    # SIP math logic
    formatting.ts      # Currency/number formatting
    fxRates.ts         # Exchange rate fetching & caching
    queryParams.ts     # URL state serialization
    types.ts           # TypeScript interfaces & constants
```

## Calculation Methodology

- **Monthly Rate**: `(1 + CAGR/100)^(1/12) − 1`
- **Compounding**: Monthly, with SIP contributions at end of each month
- **Step-up**: Applied at the start of each new year
- **Inflation Adjustment**: `Real Value = Portfolio Value / (1 + inflation%)^years`

> **Disclaimer**: This calculator is for educational purposes only. It does not account for taxes, fund expense ratios, or market volatility.
