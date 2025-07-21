export function parseList(input: string): string[] {
  return input
    .split(/,|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseBigIntList(input: string): bigint[] {
  return parseList(input).map((a) => BigInt(a));
}
