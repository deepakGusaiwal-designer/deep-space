import Logo from '../../assets/logo.svg';
import { site } from '../../content/portfolio';
import { Telescope, ArrowLeft } from 'lucide-react';

interface BlogNavProps {
  onSelectPost?: (slug: string | null) => void;
  selectedPostSlug?: string | null;
}

export default function BlogNav({ onSelectPost, selectedPostSlug }: BlogNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            aria-label="Return to 3D Universe Home"
          >
            <img src={Logo} alt="Logo" className="h-9 w-auto" />
            <span className="font-display text-sm font-bold tracking-[0.2em] text-white uppercase hidden sm:inline">
              Deepak Gusaiwal
            </span>
          </a>

          <span className="h-4 w-px bg-white/20 hidden sm:block" />

          <a
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wider text-soft uppercase transition-all duration-300 hover:border-white/30 hover:bg-white/10"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Universe</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          {selectedPostSlug && (
            <button
              type="button"
              onClick={() => onSelectPost?.(null)}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold tracking-wider text-soft uppercase transition-colors hover:text-white"
            >
              All Articles
            </button>
          )}

          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-white uppercase transition-all duration-300 hover:border-white/35 hover:bg-white/10"
          >
            <Telescope className="size-3.5" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
        </div>
      </div>
    </header>
  );
}
