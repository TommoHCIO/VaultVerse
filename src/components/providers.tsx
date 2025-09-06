'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls';
import { SkipNavigation } from '@/components/accessibility/SkipLink';
import '@rainbow-me/rainbowkit/styles.css';

const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider modalSize="compact">
            <SkipNavigation />
            {children}
            <AccessibilityControls />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AccessibilityProvider>
  );
}