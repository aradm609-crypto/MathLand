import { Sigma } from 'lucide-react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export function Logo({ size = 40, showText = true, variant = 'dark' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900 dark:text-white';
  const subColor = variant === 'light' ? 'text-indigo-100' : 'text-indigo-600 dark:text-indigo-300';

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className="relative rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-500/30"
        style={{ width: size, height: size }}
      >
        <Sigma size={size * 0.55} className="text-white" strokeWidth={2.5} />
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 shadow-md" />
      </div>
      {showText && (
        <div className="leading-tight">
          <div className={`font-extrabold text-lg ${textColor}`} style={{ letterSpacing: '-0.02em' }}>
            MathLand
          </div>
          <div className={`text-[11px] font-medium ${subColor}`}>سرزمین ریاضی نهم</div>
        </div>
      )}
    </div>
  );
}
