// Simple styled brand icons using basic SVG shapes and colors

export function EthereumIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#627EEA"/>
      <path d="M16.5 4v8.87l7.5 3.35L16.5 4z" fill="white" fillOpacity="0.602"/>
      <path d="M16.5 4L9 16.22l7.5-3.35V4z" fill="white"/>
      <path d="M16.5 21.97v6.03L24 17.616l-7.5 4.354z" fill="white" fillOpacity="0.602"/>
      <path d="M16.5 28v-6.03L9 17.616 16.5 28z" fill="white"/>
    </svg>
  );
}

export function BitcoinIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#F7931A"/>
      <path d="M23.189 13.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.113-.921-.22-1.384-.326l.695-2.783L15.596 5l-.708 2.839c-.376-.086-.745-.17-1.103-.258l.002-.009-1.374-.343-.528 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.179.057-.058-.014-.119-.03-.179-.043L12.063 17.918c-.085.212-.302.531-.793.41.017.025-1.256-.314-1.256-.314L9.157 19.99l1.27.317c.418.105.828.215 1.231.318l-.715 2.872 1.728.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.534 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.874 4.37 3.11zm.545-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z" fill="white"/>
    </svg>
  );
}

export function PolygonIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#8247E5"/>
      <path d="M21.172 12.954c-.438-.25-1.002-.25-1.504 0l-3.509 2.068-2.38 1.316-3.447 2.068c-.439.25-1.003.25-1.504 0l-2.695-1.63a1.527 1.527 0 0 1-.752-1.315v-3.133c0-.502.25-1.003.752-1.316l2.695-1.567c.438-.25 1.002-.25 1.504 0l2.694 1.63c.439.25.752.751.752 1.315v2.068l2.381-1.378v-2.13c0-.502-.25-1.004-.752-1.317l-5.013-2.945c-.438-.25-1.002-.25-1.504 0l-5.138 3.008c-.501.25-.752.752-.752 1.253v5.89c0 .502.25 1.003.752 1.316l5.076 2.946c.438.25 1.002.25 1.504 0l3.446-2.006 2.381-1.378 3.447-2.006c.438-.25 1.002-.25 1.504 0l2.694 1.567c.439.25.752.752.752 1.316v3.133c0 .501-.25 1.003-.752 1.316l-2.632 1.567c-.438.25-1.002.25-1.504 0l-2.694-1.567a1.527 1.527 0 0 1-.752-1.316v-2.005L13.84 21.1v2.067c0 .502.25 1.003.752 1.316l5.075 2.946c.439.25 1.003.25 1.504 0l5.076-2.946c.439-.25.752-.752.752-1.316v-5.953c0-.5-.25-1.002-.752-1.316l-5.076-2.945z" fill="white"/>
    </svg>
  );
}

export function MetaMaskIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#F6851B"/>
      <path d="M25.1 8.5l-8.5 6.3 1.6-3.8L25.1 8.5z" fill="#E2761B"/>
      <path d="M6.9 8.5l8.4 6.4-1.5-3.8L6.9 8.5z" fill="#E4761B"/>
      <path d="M22.2 20.8l-2.3 3.5 4.9 1.3 1.4-4.7-3.9-.1zm-12.3.1L8.5 25.6l4.9-1.3-2.3-3.5h-.2z" fill="#E4761B"/>
      <path d="M13.1 16.2l-1.4 2.1 4.8.2-.2-5.2-3.2 2.9zm5.8 0l-3.3-3-0.1 5.3 4.8-.2-1.4-2.1z" fill="#E4761B"/>
      <path d="M13.4 24.3l2.9-1.4-2.5-2h-.4zm3.3-1.4l2.9 1.4-.4-3.4h-.4l-2.1 2z" fill="#D7C1B3"/>
    </svg>
  );
}

export function AppleIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="currentColor"/>
      <path d="M22.1 12.2c-.1 0-2.4.5-2.4 3.2 0 2.7 2.4 3.6 2.5 3.6 0 .1-.4 1.3-1.2 2.6-.7 1.1-1.5 2.2-2.6 2.2s-1.5-.7-2.9-.7c-1.3 0-1.8.7-2.9.7s-1.9-1-2.8-2.3c-1.1-1.6-2-4.1-2-6.7 0-3.9 2.5-6 5-6 1.3 0 2.4.9 3.2.9.8 0 2-1 3.5-1 .6 0 2.6.1 3.9 2 0 0-.1.1-.3.2zm-3.9-3.2c.6-.7 1.1-1.7 1.1-2.7 0-.1 0-.3 0-.4-1 0-2.2.6-2.9 1.4-.6.6-1.1 1.6-1.1 2.6 0 .2 0 .3 0 .4.1 0 .2 0 .3 0 .9 0 2-.6 2.6-1.3z" fill="white"/>
    </svg>
  );
}

// Export all together for easy importing
export { EthereumIcon as BrandEthereum, BitcoinIcon as BrandBitcoin, PolygonIcon as BrandPolygon, MetaMaskIcon as BrandMetaMask, AppleIcon as BrandApple };

// Brand logo component for easy use
export function BrandLogo({ 
  brand, 
  className = "w-8 h-8" 
}: { 
  brand: 'ethereum' | 'bitcoin' | 'polygon' | 'apple' | 'metamask';
  className?: string;
}) {
  switch (brand) {
    case 'ethereum':
      return <EthereumIcon className={className} />;
    case 'bitcoin':
      return <BitcoinIcon className={className} />;
    case 'polygon':
      return <PolygonIcon className={className} />;
    case 'apple':
      return <AppleIcon className={className} />;
    case 'metamask':
      return <MetaMaskIcon className={className} />;
    default:
      return null;
  }
}