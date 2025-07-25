import { parseBigIntList, parseList } from './parseInput';

describe('parseList', () => {
  describe('empty or invalid input', () => {
    it('returns [] for null, undefined, or empty string', () => {
      expect(parseList(null)).toEqual([]);
      expect(parseList(undefined)).toEqual([]);
      expect(parseList('')).toEqual([]);
    });
  });

  describe('valid input formatting', () => {
    it('splits by comma, newline, or both', () => {
      expect(parseList('a,b,c')).toEqual(['a', 'b', 'c']);
      expect(parseList('a\nb\nc')).toEqual(['a', 'b', 'c']);
      expect(parseList('a\nb,c')).toEqual(['a', 'b', 'c']);
    });

    it('trims whitespace and removes empty values', () => {
      expect(parseList('  a  , \n , b ,  \nc  ')).toEqual(['a', 'b', 'c']);
    });
  });
});

describe('parseBigIntList', () => {
  describe('empty or invalid input', () => {
    it('returns [] for null, undefined, or empty string', () => {
      expect(parseBigIntList(null)).toEqual([]);
      expect(parseBigIntList(undefined)).toEqual([]);
      expect(parseBigIntList('')).toEqual([]);
    });
  });

  describe('valid parsing and fallback handling', () => {
    it('parses comma or newline-separated bigint strings', () => {
      expect(parseBigIntList('100,200,300')).toEqual([100n, 200n, 300n]);
      expect(parseBigIntList('100\n200\n300')).toEqual([100n, 200n, 300n]);
    });

    it('replaces invalid entries with 0n', () => {
      expect(parseBigIntList('100,abc,300')).toEqual([100n, 0n, 300n]);
      expect(parseBigIntList('  100 ,\n abc , 300 ')).toEqual([100n, 0n, 300n]);
    });
  });
});
