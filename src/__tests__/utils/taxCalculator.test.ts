import { describe, it, expect } from 'vitest';
import {
  calculateTax,
  getTaxRate,
  hasTax,
  getSupportedCountries,
  formatTaxDisplay,
  TAX_RATES,
} from '../../utils/taxCalculator';

describe('Tax Calculator Utility', () => {
  describe('calculateTax', () => {
    it('should calculate US sales tax correctly', () => {
      const result = calculateTax(100, 'United States');

      expect(result.taxAmount).toBe(8);
      expect(result.taxRate).toBe(0.08);
      expect(result.taxType).toBe('Sales Tax');
      expect(result.displayName).toBe('Sales Tax');
    });

    it('should calculate UK VAT correctly', () => {
      const result = calculateTax(100, 'United Kingdom');

      expect(result.taxAmount).toBe(20);
      expect(result.taxRate).toBe(0.20);
      expect(result.taxType).toBe('VAT');
      expect(result.displayName).toBe('VAT');
    });

    it('should calculate Canadian GST correctly', () => {
      const result = calculateTax(100, 'Canada');

      expect(result.taxAmount).toBe(5);
      expect(result.taxRate).toBe(0.05);
      expect(result.taxType).toBe('GST');
      expect(result.displayName).toBe('GST');
    });

    it('should handle large amounts correctly', () => {
      const result = calculateTax(1000, 'Germany');

      expect(result.taxAmount).toBe(190);
      expect(result.taxRate).toBe(0.19);
    });

    it('should handle decimal amounts correctly', () => {
      const result = calculateTax(99.99, 'France');

      expect(result.taxAmount).toBe(20);
      expect(result.taxRate).toBe(0.20);
    });

    it('should round tax amounts to 2 decimal places', () => {
      const result = calculateTax(33.33, 'Italy'); // 22% VAT

      expect(result.taxAmount).toBe(7.33);
    });

    it('should return zero tax for unknown countries', () => {
      const result = calculateTax(100, 'Unknown Country');

      expect(result.taxAmount).toBe(0);
      expect(result.taxRate).toBe(0);
      expect(result.taxType).toBe('None');
      expect(result.displayName).toBe('Tax');
    });

    it('should handle zero amount', () => {
      const result = calculateTax(0, 'United States');

      expect(result.taxAmount).toBe(0);
    });

    it('should handle negative amounts', () => {
      const result = calculateTax(-100, 'United States');

      expect(result.taxAmount).toBe(-8);
    });
  });

  describe('getTaxRate', () => {
    it('should return tax rate for valid country', () => {
      const rate = getTaxRate('Australia');

      expect(rate).toBeTruthy();
      expect(rate?.rate).toBe(0.10);
      expect(rate?.type).toBe('GST');
    });

    it('should return null for invalid country', () => {
      const rate = getTaxRate('Invalid Country');

      expect(rate).toBeNull();
    });

    it('should return correct info for all EU countries with VAT', () => {
      const euCountries = ['Germany', 'France', 'Spain', 'Italy', 'Netherlands'];

      euCountries.forEach(country => {
        const rate = getTaxRate(country);
        expect(rate?.type).toBe('VAT');
      });
    });
  });

  describe('hasTax', () => {
    it('should return true for countries with tax', () => {
      expect(hasTax('United States')).toBe(true);
      expect(hasTax('United Kingdom')).toBe(true);
      expect(hasTax('Japan')).toBe(true);
    });

    it('should return false for countries without tax', () => {
      expect(hasTax('Unknown Country')).toBe(false);
      expect(hasTax('Random Place')).toBe(false);
    });

    it('should be case-sensitive', () => {
      expect(hasTax('united states')).toBe(false);
      expect(hasTax('UNITED STATES')).toBe(false);
      expect(hasTax('United States')).toBe(true);
    });
  });

  describe('getSupportedCountries', () => {
    it('should return array of countries', () => {
      const countries = getSupportedCountries();

      expect(Array.isArray(countries)).toBe(true);
      expect(countries.length).toBeGreaterThan(0);
    });

    it('should return sorted countries', () => {
      const countries = getSupportedCountries();
      const sorted = [...countries].sort();

      expect(countries).toEqual(sorted);
    });

    it('should include major countries', () => {
      const countries = getSupportedCountries();

      expect(countries).toContain('United States');
      expect(countries).toContain('United Kingdom');
      expect(countries).toContain('Canada');
      expect(countries).toContain('Australia');
      expect(countries).toContain('Germany');
    });

    it('should match TAX_RATES entries', () => {
      const countries = getSupportedCountries();
      const rateKeys = Object.keys(TAX_RATES).sort();

      expect(countries).toEqual(rateKeys);
    });
  });

  describe('formatTaxDisplay', () => {
    it('should format tax with type', () => {
      const formatted = formatTaxDisplay(20, 'VAT');

      expect(formatted).toBe('$20.00 (VAT)');
    });

    it('should format zero tax', () => {
      const formatted = formatTaxDisplay(0, 'None');

      expect(formatted).toBe('$0.00');
    });

    it('should round to 2 decimal places', () => {
      const formatted = formatTaxDisplay(15.5, 'GST');

      expect(formatted).toBe('$15.50 (GST)');
    });

    it('should handle large amounts', () => {
      const formatted = formatTaxDisplay(1234.56, 'Sales Tax');

      expect(formatted).toBe('$1234.56 (Sales Tax)');
    });

    it('should handle decimal cents', () => {
      const formatted = formatTaxDisplay(19.99, 'VAT');

      expect(formatted).toBe('$19.99 (VAT)');
    });
  });

  describe('Edge Cases', () => {
    it('should handle Switzerland special rate', () => {
      const result = calculateTax(100, 'Switzerland');

      expect(result.taxRate).toBe(0.077);
      expect(result.taxAmount).toBe(7.7);
    });

    it('should handle Nordic countries high VAT', () => {
      ['Sweden', 'Denmark', 'Norway'].forEach(country => {
        const result = calculateTax(100, country);
        expect(result.taxRate).toBe(0.25);
        expect(result.taxAmount).toBe(25);
      });
    });

    it('should handle Asian countries correctly', () => {
      const japan = calculateTax(100, 'Japan');
      expect(japan.taxRate).toBe(0.10);
      expect(japan.taxAmount).toBe(10);

      const singapore = calculateTax(100, 'Singapore');
      expect(singapore.taxType).toBe('GST');
      expect(singapore.taxAmount).toBe(8);

      const thailand = calculateTax(100, 'Thailand');
      expect(thailand.taxRate).toBe(0.07);
      expect(thailand.taxAmount).toBe(7);
    });
  });

  describe('Integration Tests', () => {
    it('should calculate complete checkout scenario', () => {
      const subtotal = 250;
      const country = 'Germany';

      const tax = calculateTax(subtotal, country);
      const total = subtotal + tax.taxAmount;
      const formatted = formatTaxDisplay(tax.taxAmount, tax.taxType);

      expect(tax.taxAmount).toBe(47.5);
      expect(total).toBe(297.5);
      expect(formatted).toBe('$47.50 (VAT)');
    });

    it('should handle promo discount with tax', () => {
      const subtotal = 200;
      const discount = 40; // 20% off
      const afterDiscount = subtotal - discount; // 160

      const tax = calculateTax(afterDiscount, 'United Kingdom');
      const total = afterDiscount + tax.taxAmount;

      expect(tax.taxAmount).toBe(32); // 20% of 160
      expect(total).toBe(192);
    });

    it('should verify tax is calculated after discount', () => {
      const originalPrice = 300;
      const discountedPrice = 200;

      const taxOnOriginal = calculateTax(originalPrice, 'France');
      const taxOnDiscounted = calculateTax(discountedPrice, 'France');

      expect(taxOnOriginal.taxAmount).toBe(60);
      expect(taxOnDiscounted.taxAmount).toBe(40);
    });
  });
});
