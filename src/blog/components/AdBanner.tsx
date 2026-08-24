import { useEffect, useRef } from 'react';

interface AdBannerProps {
  /** Numeric AdSense slot ID from Google AdSense Console (e.g. "1234567890") */
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
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  label = 'Advertisement',
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '');

  // Only pass data-ad-slot if it's a valid numeric ID (e.g. "1234567890")
  const isNumericSlot = slot && /^\d+$/.test(slot);

  useEffect(() => {
    // Suppress ad requests on localhost to prevent HTTP 400 errors from Google AdSense servers
    if (isLocalhost) return;

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.warn('AdSense notice:', e);
    }
  }, [isLocalhost, slot]);

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
        {isLocalhost ? (
          /* Clean preview placeholder in local development without triggering 400 network errors */
          <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] py-6 text-xs text-white/40">
            <span className="font-mono text-xs text-soft/70">
              [ AdSense Unit Placeholder: {slot || 'Auto Ad Unit'} ]
            </span>
            <span className="mt-1 font-mono text-[10px] text-dim">
              Client: ca-pub-4525663149790883 · Live on deepakgusaiwal.com
            </span>
          </div>
        ) : (
          /* Live AdSense tag on production domain */
          <ins
            ref={adRef}
            className="adsbygoogle block w-full"
            style={{ display: 'block', minHeight: '90px' }}
            data-ad-client="ca-pub-4525663149790883"
            {...(isNumericSlot ? { 'data-ad-slot': slot } : {})}
            data-ad-format={format}
            data-full-width-responsive={responsive ? 'true' : 'false'}
          />
        )}
      </div>
    </aside>
  );
}
