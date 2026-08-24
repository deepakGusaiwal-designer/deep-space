import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default function AdBanner({
  slot = 'default-slot',
  format = 'auto',
  responsive = true,
  className = '',
  label = 'Sponsored / Advertisement',
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      // AdSense suppresses duplicate pushes gracefully
      if (isDev) console.warn('AdSense notice:', e);
    }
  }, [isDev]);

  return (
    <aside
      className={`my-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur-md transition-all duration-300 hover:border-white/20 ${className}`}
      aria-label={label}
    >
      <div className="mb-2 flex items-center justify-between px-2 text-[10px] tracking-widest text-dim uppercase">
        <span>{label}</span>
        <span className="font-mono text-[9px] text-white/30">Google AdSense</span>
      </div>

      <div className="flex min-h-[90px] w-full items-center justify-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client="ca-pub-4525663149790883"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />

        {/* Development preview container when live ad is waiting on AdSense approval / local dev */}
        {isDev && (
          <div className="flex flex-col items-center justify-center py-4 text-xs text-white/40">
            <span className="font-mono text-goldlight/70 text-[11px]">[ AdSense Unit: {slot} ]</span>
            <span className="mt-1 text-[10px] text-dim">Client: ca-pub-4525663149790883 · Live on production domain</span>
          </div>
        )}
      </div>
    </aside>
  );
}
