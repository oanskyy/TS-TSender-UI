// src/hooks/useTokenInfo.ts
import { useEffect, useState } from 'react';
import { erc20Abi } from '@/abi/erc20';
import { readContract } from '@wagmi/core';
import { useChainId, useConfig } from 'wagmi';

type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
};

export function useTokenInfo(address: string | undefined): {
  data: TokenInfo | null;
  isLoading: boolean;
  isError: boolean;
} {
  const chainId = useChainId();
  const [data, setData] = useState<TokenInfo | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const config = useConfig();

  useEffect(() => {
    if (!address || address.length < 10) return;
    if (!address || !address.startsWith('0x') || address.length !== 42) return;

    const tokenAddress = address as `0x${string}`; // ✅ valid type

    const fetch = async () => {
      try {
        setLoading(true);
        setError(false);

        const [name, symbol, decimals] = await Promise.all([
          readContract(config, {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'name',
            chainId,
          }),
          readContract(config, {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'symbol',
            chainId,
          }),
          readContract(config, {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'decimals',
            chainId,
          }),
        ]);

        setData({
          name: name as string,
          symbol: symbol as string,
          decimals: decimals as number,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('❌ Token info fetch failed:', err);
        setError(true);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [address, chainId, config]);

  return { data, isLoading, isError };
}
