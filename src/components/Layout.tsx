import { useState } from 'react';
import { Menu, X, Moon, Sun, Home, BookOpen, PenTool, Calculator, Gamepad2, BarChart3, Info, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { PageKey } from '@/types';
import { Logo } from './Logo';

const navItems: { key: PageKey; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'خانه', icon: Home },
  { key: 'chapters', label: 'فصل‌ها', icon: BookOpen },
  { key: 'exam', label: 'آزمون آنلاین', icon: Award },
  { key: 'practice', label: 'تمرین', icon: PenTool },
  { key: 'calculator', label: 'ماشین‌حساب', icon: Calculator },
  { key: 'game', label: 'بازی ریاضی', icon: Gamepad2 },
  { key: 'dashboard', label: 'پیشرفت من', icon: BarChart3 },
  { key: 'about', label: 'درباره', icon: Info },
];

export function Navbar() {
  const { page, navigate, settings, toggleTheme, progress } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (key: PageKey) => {
    navigate(key);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 glass border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => go('home')} className="flex-shrink-0">
            <Logo size={40} showText />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = page === item.key || (item.key === 'chapters' && page === 'chapter');
              return (
                <button
                  key={item.key}
                  onClick={() => go(item.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-bold">
              <Award size={16} />
              {progress.totalPoints} امتیاز
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="تغییر تم"
            >
              {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="منو"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 pt-2 grid grid-cols-2 gap-2 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = page === item.key || (item.key === 'chapters' && page === 'chapter');
              return (
                <button
                  key={item.key}
                  onClick={() => go(item.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  const { navigate } = useApp();
  return (
    <footer className="mt-20 bg-slate-900 dark:bg-black text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo size={44} showText variant="light" />
            <p className="mt-4 text-sm text-slate-400 leading-7 max-w-md">
              سرزمین ریاضی نهم، پلتفرم تعاملی برای یادگیری ریاضی نهم بهمناسب دانش‌آموزان ایرانی.
              با محتوای دقیق، آزمون‌های آنلاین، تمرین و بازی، ریاضی را ساده و لذت‌بخش بیاموزید.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('chapters')} className="hover:text-indigo-400 transition-colors">فصل‌های کتاب</button></li>
              <li><button onClick={() => navigate('exam')} className="hover:text-indigo-400 transition-colors">آزمون آنلاین</button></li>
              <li><button onClick={() => navigate('practice')} className="hover:text-indigo-400 transition-colors">تمرین</button></li>
              <li><button onClick={() => navigate('game')} className="hover:text-indigo-400 transition-colors">بازی ریاضی</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">بیشتر</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('calculator')} className="hover:text-indigo-400 transition-colors">ماشین‌حساب</button></li>
              <li><button onClick={() => navigate('dashboard')} className="hover:text-indigo-400 transition-colors">پیشرفت من</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-indigo-400 transition-colors">درباره ما</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
          © ۱۴۰۳ سرزمین ریاضی نهم | MathLand — ساخته‌شده برای آموزش ریاضی نهم
        </div>
      </div>
    </footer>
  );
}
