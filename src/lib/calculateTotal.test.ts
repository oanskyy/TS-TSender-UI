// src/lib/calculateTotal.test.ts

import {
  calculateAmountList,
  calculateTotalWei,
  calculateTotalTokens,
} from './calculateTotal';

describe('calculateAmountList', () => {
  it('returns empty array when input is undefined', () => {
    expect(calculateAmountList(undefined)).toEqual([]);
  });

  it('splits by comma or newline and trims values', () => {
    const input = '1, 2\n3';
    expect(calculateAmountList(input)).toEqual([1, 2, 3]);
  });

  it('filters out non-numeric values', () => {
    const input = '1, abc, 2';
    expect(calculateAmountList(input)).toEqual([1, 2]);
  });

  it('handles empty string input', () => {
    expect(calculateAmountList('')).toEqual([]);
  });

  it('handles mixed delimiters and extra whitespace', () => {
    const input = ' 100 ,200\n 300 ';
    expect(calculateAmountList(input)).toEqual([100, 200, 300]);
  });

  it('ignores invalid entries and empty lines', () => {
    const input = '100\n\n200,abc,\n,300';
    expect(calculateAmountList(input)).toEqual([100, 200, 300]);
  });

  it('handles floating-point numbers', () => {
    const input = '10.5, 20.25';
    expect(calculateAmountList(input)).toEqual([10.5, 20.25]);
  });
});

describe('calculateTotalWei', () => {
  it('sums up numbers in array', () => {
    expect(calculateTotalWei([1, 2, 3])).toBe(6);
  });

  it('returns 0 for empty array', () => {
    expect(calculateTotalWei([])).toBe(0);
  });
});

describe('calculateTotalTokens', () => {
  it('converts wei to tokens with default 18 decimals', () => {
    expect(calculateTotalTokens(10 ** 18)).toBe(1);
  });

  it('handles different decimals', () => {
    expect(calculateTotalTokens(1000, 3)).toBe(1);
  });

  it('returns 0 for zero wei', () => {
    expect(calculateTotalTokens(0)).toBe(0);
  });

  it('returns correct value for large wei amounts', () => {
    expect(calculateTotalTokens(10 ** 24)).toBe(1e6); // 10^24 wei = 1 million tokens with 18 decimals
  });

  it('returns NaN for invalid wei input', () => {
    expect(calculateTotalTokens(NaN)).toBeNaN();
  });
});
