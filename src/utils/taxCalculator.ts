// Tax calculation utility for e-commerce checkout
// Calculates tax based on shipping country/region

export interface TaxRate {
  country: string
  rate: number
  type: 'VAT' | 'GST' | 'Sales Tax' | 'None'
  displayName: string
}

// Default tax rates by country
export const TAX_RATES: Record<string, TaxRate> = {
  'United States': {
    country: 'United States',
    rate: 0.08, // 8%
    type: 'Sales Tax',
    displayName: 'Sales Tax'
  },
  'United Kingdom': {
    country: 'United Kingdom',
    rate: 0.20, // 20%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Germany': {
    country: 'Germany',
    rate: 0.19, // 19%
    type: 'VAT',
    displayName: 'VAT'
  },
  'France': {
    country: 'France',
    rate: 0.20, // 20%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Spain': {
    country: 'Spain',
    rate: 0.21, // 21%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Italy': {
    country: 'Italy',
    rate: 0.22, // 22%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Netherlands': {
    country: 'Netherlands',
    rate: 0.21, // 21%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Belgium': {
    country: 'Belgium',
    rate: 0.21, // 21%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Austria': {
    country: 'Austria',
    rate: 0.20, // 20%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Portugal': {
    country: 'Portugal',
    rate: 0.23, // 23%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Sweden': {
    country: 'Sweden',
    rate: 0.25, // 25%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Denmark': {
    country: 'Denmark',
    rate: 0.25, // 25%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Canada': {
    country: 'Canada',
    rate: 0.05, // 5% GST (varies by province)
    type: 'GST',
    displayName: 'GST'
  },
  'Australia': {
    country: 'Australia',
    rate: 0.10, // 10%
    type: 'GST',
    displayName: 'GST'
  },
  'Japan': {
    country: 'Japan',
    rate: 0.10, // 10%
    type: 'Sales Tax',
    displayName: 'Consumption Tax'
  },
  'South Korea': {
    country: 'South Korea',
    rate: 0.10, // 10%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Singapore': {
    country: 'Singapore',
    rate: 0.08, // 8%
    type: 'GST',
    displayName: 'GST'
  },
  'New Zealand': {
    country: 'New Zealand',
    rate: 0.15, // 15%
    type: 'GST',
    displayName: 'GST'
  },
  'Switzerland': {
    country: 'Switzerland',
    rate: 0.077, // 7.7%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Norway': {
    country: 'Norway',
    rate: 0.25, // 25%
    type: 'VAT',
    displayName: 'VAT'
  },
  'Thailand': {
    country: 'Thailand',
    rate: 0.07, // 7%
    type: 'VAT',
    displayName: 'VAT'
  }
}

/**
 * Calculate tax for a given amount based on the shipping country
 * @param amount - The subtotal amount before tax
 * @param country - The shipping country
 * @returns Object containing tax amount and rate information
 */
export const calculateTax = (amount: number, country: string): {
  taxAmount: number
  taxRate: number
  taxType: string
  displayName: string
} => {
  const taxInfo = TAX_RATES[country]

  if (!taxInfo) {
    // Default: no tax for countries not in the list
    return {
      taxAmount: 0,
      taxRate: 0,
      taxType: 'None',
      displayName: 'Tax'
    }
  }

  const taxAmount = amount * taxInfo.rate

  return {
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    taxRate: taxInfo.rate,
    taxType: taxInfo.type,
    displayName: taxInfo.displayName
  }
}

/**
 * Get tax rate information for a specific country
 * @param country - The country name
 * @returns Tax rate information or null if not found
 */
export const getTaxRate = (country: string): TaxRate | null => {
  return TAX_RATES[country] || null
}

/**
 * Check if a country has tax
 * @param country - The country name
 * @returns Boolean indicating if country has tax
 */
export const hasTax = (country: string): boolean => {
  return country in TAX_RATES
}

/**
 * Get list of all supported countries with tax rates
 * @returns Array of country names
 */
export const getSupportedCountries = (): string[] => {
  return Object.keys(TAX_RATES).sort()
}

/**
 * Format tax display string
 * @param taxAmount - Tax amount
 * @param taxType - Tax type (VAT, GST, etc.)
 * @returns Formatted string for display
 */
export const formatTaxDisplay = (taxAmount: number, taxType: string): string => {
  if (taxAmount === 0) {
    return '$0.00'
  }
  return `$${taxAmount.toFixed(2)} (${taxType})`
}
