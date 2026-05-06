import { SIPInputs, DEFAULT_INPUTS } from './types';

export function encodeParams(inputs: SIPInputs): string {
  const params = new URLSearchParams({
    y: String(inputs.years),
    i: String(inputs.inflation),
    m: String(inputs.monthlyInvestment),
    s: String(inputs.stepUp),
    c: String(inputs.cagr),
    l: String(inputs.lumpsum ?? 0),
  });
  return params.toString();
}

export function decodeParams(search: string): SIPInputs {
  const params = new URLSearchParams(search);
  const get = (key: string, fallback: number) => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const val = Number(raw);
    return isNaN(val) ? fallback : val;
  };
  return {
    years: Math.round(get('y', DEFAULT_INPUTS.years)) || DEFAULT_INPUTS.years,
    inflation: get('i', DEFAULT_INPUTS.inflation),
    monthlyInvestment: Math.round(get('m', DEFAULT_INPUTS.monthlyInvestment)) || DEFAULT_INPUTS.monthlyInvestment,
    stepUp: get('s', DEFAULT_INPUTS.stepUp),
    cagr: get('c', DEFAULT_INPUTS.cagr) || DEFAULT_INPUTS.cagr,
    lumpsum: Math.round(get('l', DEFAULT_INPUTS.lumpsum)),
  };
}
