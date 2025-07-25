import {
  calculateAmountList,
  calculateTotalTokens,
  calculateTotalWei,
} from './calculateTotal';

describe('calculateAmountList', () => {
  it('returns empty array when input is undefined', () => {
    expect(calculateAmountList(undefined)).toEqual([]);
  });
  it('returns an empty array for null input', () => {
    expect(calculateAmountList(null)).toEqual([]);
  });
  it('returns an empty array for empty string', () => {
    expect(calculateAmountList('')).toEqual([]);
  });

  it('splits by comma or newline and trims values', () => {
    const input = '1, 2\n3';
    expect(calculateAmountList(input)).toEqual([1n, 2n, 3n]);
  });

  it('replaces invalid values with 0n', () => {
    const input = '1, abc, 2';
    expect(calculateAmountList(input)).toEqual([1n, 0n, 2n]);
  });

  it('handles mixed delimiters and extra whitespace', () => {
    const input = ' 100 ,200\n 300 ';
    expect(calculateAmountList(input)).toEqual([100n, 200n, 300n]);
  });

  it('ignores invalid entries and empty lines', () => {
    const input = '100\n\n200,abc,\n,300';
    expect(calculateAmountList(input)).toEqual([100n, 200n, 0n, 300n]);
  });

  it('works with large values safely', () => {
    const input = '1000000000000000000\n2000000000000000000';
    const output = [1000000000000000000n, 2000000000000000000n];
    expect(calculateAmountList(input)).toEqual(output);
  });
});

describe('calculateTotalWei', () => {
  it('sums up numbers in array', () => {
    expect(calculateTotalWei([1n, 2n, 3n])).toBe(6n);
  });

  it('returns 0 for empty array', () => {
    expect(calculateTotalWei([])).toBe(0n);
  });

  it('handles an array of a single value', () => {
    const input = [42n];
    expect(calculateTotalWei(input)).toBe(42n);
  });
  it('handles an array with zero values', () => {
    const input = [0n, 0n, 0n];
    expect(calculateTotalWei(input)).toBe(0n);
  });

  it('handles negative numbers correctly', () => {
    const input = [10n, -5n, 3n];
    expect(calculateTotalWei(input)).toBe(8n);
  });

  it('handles large values correctly', () => {
    const input = [10n ** 18n, 10n ** 18n];
    expect(calculateTotalWei(input)).toBe(2n * 10n ** 18n);
  });

  it('handles negative values', () => {
    const input = [100n, -50n, -25n];
    expect(calculateTotalWei(input)).toBe(25n);
  });
});

describe('calculateTotalTokens', () => {
  it('converts wei to tokens with default 18 decimals', () => {
    expect(calculateTotalTokens(10n ** 18n)).toBe('1');
  });

  it('handles different decimals', () => {
    expect(calculateTotalTokens(1000n, 3)).toBe('1');
  });

  it('returns 0 for zero wei', () => {
    expect(calculateTotalTokens(0n)).toBe('0'); // ✅ human-readable token format, no `n`
  });

  it('returns correct value for large wei amounts', () => {
    expect(calculateTotalTokens(10n ** 24n)).toBe('1000000'); // 10^24 wei = ✅ 1 million tokens with 18 decimals (1e6)
  });
});
