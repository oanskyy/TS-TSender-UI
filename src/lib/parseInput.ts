export function parseList(input: string | undefined | null): string[] {
  if (!input) return [];
  return input
    .split(/,|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseBigIntList(input: string | undefined | null): bigint[] {
  return parseList(input).map((a) => {
    try {
      return BigInt(a);
    } catch {
      return BigInt(0);
    }
  });
}
