// Currency utility for South Sudanese Pound (SSP)
export const CURRENCY = {
  code: 'SSP',
  symbol: 'SSP',
  name: 'South Sudanese Pound',
  locale: 'en-US' // Use US locale to prevent automatic £ symbol injection by en-GB
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format currency with symbol only (for compact display)
export const formatCurrencySymbol = (amount: number): string => {
  return `${CURRENCY.symbol}${amount.toFixed(2)}`;
};

// Parse currency string to number
export const parseCurrency = (currencyString: string): number => {
  return parseFloat(currencyString.replace(/[^0-9.-]+/g, ''));
};
