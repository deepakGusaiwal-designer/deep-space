import { useState } from 'react';
import Logo from '../../assets/logo.svg';
import { Lock, Key, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface AdminAuthProps {
  onAuthenticated: () => void;
}

const AUTH_STORAGE_KEY = 'deep_space_admin_auth';
const DEFAULT_PASS = 'Deepak@999';

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true' || localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password');
      return;
    }

    const savedPass = localStorage.getItem('deep_space_admin_custom_pass') || DEFAULT_PASS;

    if (password === savedPass) {
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      }
      setError('');
      onAuthenticated();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/[0.04] p-8 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:p-10">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg">
            <Lock className="size-6 text-soft" />
          </div>

          <img src={Logo} alt="Logo" className="mx-auto h-8 w-auto opacity-80" />
          <h2 className="h-display mt-4 text-2xl font-bold text-white">Author Studio</h2>
          <p className="mt-1 text-xs text-dim">Private workspace for Deepak Gusaiwal</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-soft uppercase">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-dim" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="My password"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-11 text-sm text-soft placeholder:text-dim backdrop-blur-md transition-all focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dim hover:text-soft"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <label className="flex cursor-pointer items-center gap-2 text-dim hover:text-soft">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-3.5 rounded border-white/20 bg-white/5 accent-[#CB152F]"
              />
              Remember on this device
            </label>
          </div>

          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-3 text-xs font-bold tracking-widest text-black uppercase shadow-[0_0_24px_rgba(255,255,255,0.25)] transition-all hover:bg-white/90 active:scale-[0.99]"
          >
            <span>Unlock Studio</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-[10px] text-dim">
          <ShieldCheck className="size-3.5 text-emerald-400/80" />
          <span>Encrypted Local Session Gate</span>
        </div>
      </div>
    </div>
  );
}
