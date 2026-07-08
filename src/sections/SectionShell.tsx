import type { ReactNode } from 'react';

interface SectionShellProps {
  id?: string;
  eyebrow?: string;
  className?: string;
  children: ReactNode;
  /** allow pointer events to pass through to the 3D universe */
  passthrough?: boolean;
}

/**
 * Reusable section wrapper. Sections float above the universe; by default
 * they let the pointer fall through to the 3D scene except on interactive
 * children (mark those with `pointer-events-auto`).
 */
export default function SectionShell({
  id,
  eyebrow,
  className = '',
  children,
  passthrough = true,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`relative z-10 mx-auto w-full max-w-6xl px-6 md:px-12 ${
        passthrough ? 'pointer-events-none' : ''
      } ${className}`}
    >
      {eyebrow && (
        <p data-reveal className="eyebrow mb-6">
          {eyebrow}
        </p>
      )}
      {children}
    </section>
  );
}
