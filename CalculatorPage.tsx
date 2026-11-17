import { useState } from 'react';
import { Calculator as CalcIcon, Delete, CornerDownLeft, AlertCircle } from 'lucide-react';
import { evaluateExpression, formatResult } from '@/lib/calculator';
import { Card, Button, SectionTitle } from '@/components/ui';

export function CalculatorPage() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const append = (s: string) => {
    setExpr((e) => e + s);
    setError(null);
    setResult(null);
  };

  const back = () => {
    setExpr((e) => e.slice(0, -1));
    setError(null);
  };

  const clear = () => {
    setExpr('');
    setResult(null);
    setError(null);
  };

  const calc = () => {
    if (!expr.trim()) return;
    try {
      const r = evaluateExpression(expr);
      const formatted = formatResult(r);
      setResult(formatted);
      setError(null);
      setHistory((h) => [`${expr} = ${formatted}`, ...h].slice(0, 8));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در محاسبه');
      setResult(null);
    }
  };

  const keys: { label: string; insert: string; type?: 'op' | 'fn' | 'action' }[] = [
    { label: '√', insert: 'sqrt(', type: 'fn' },
    { label: '^', insert: '^', type: 'op' },
    { label: '(', insert: '(' },
    { label: ')', insert: ')' },
    { label: '7', insert: '7' },
    { label: '8', insert: '8' },
    { label: '9', insert: '9' },
    { label: '÷', insert: '/', type: 'op' },
    { label: '4', insert: '4' },
    { label: '5', insert: '5' },
    { label: '6', insert: '6' },
    { label: '×', insert: '*', type: 'op' },
    { label: '1', insert: '1' },
    { label: '2', insert: '2' },
    { label: '3', insert: '3' },
    { label: '−', insert: '-', type: 'op' },
    { label: '0', insert: '0' },
    { label: '.', insert: '.' },
    { label: 'π', insert: 'pi' },
    { label: '+', insert: '+', type: 'op' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <SectionTitle title="ماشین‌حساب ریاضی" subtitle="پشتیبانی از توان، ریشه، پرانتز و اعشار — بدون استفاده از eval" center />

      <Card className="p-6">
        {/* Display */}
        <div className="bg-slate-900 dark:bg-black rounded-2xl p-6 mb-5 text-right" style={{ direction: 'ltr' }}>
          <div className="text-slate-400 text-sm min-h-[24px] break-all">{expr || <span className="opacity-30">عبارت را وارد کنید...</span>}</div>
          <div className="text-3xl font-extrabold text-white mt-2 min-h-[40px] break-all">
            {error ? (
              <span className="text-rose-400 text-lg flex items-center gap-2 justify-end"><AlertCircle size={20} /> {error}</span>
            ) : result !== null ? (
              <span className="text-emerald-400">= {result}</span>
            ) : null}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2.5">
          <button onClick={clear} className="col-span-2 py-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-300 font-bold hover:bg-rose-100 dark:hover:bg-rose-500/25 transition-colors">
            پاک کردن
          </button>
          <button onClick={back} className="py-3.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-1">
            <Delete size={18} /> حذف
          </button>
          <button onClick={calc} className="py-3.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-1">
            <CornerDownLeft size={18} /> =
          </button>

          {keys.map((k) => (
            <button
              key={k.label}
              onClick={() => append(k.insert)}
              className={`py-3.5 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 ${
                k.type === 'op'
                  ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/25'
                  : k.type === 'fn'
                  ? 'bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-500/25'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
      </Card>

      {history.length > 0 && (
        <Card className="p-5 mt-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><CalcIcon size={18} /> تاریخچه محاسبات</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-lg px-3 py-2" style={{ direction: 'ltr', textAlign: 'right' }}>
                {h}
              </div>
            ))}
          </div>
        </Card>
      )}

      <p className="text-center text-xs text-slate-400 mt-6 leading-6">
        از عمل‌های +, −, ×, ÷, ^ (توان), sqrt (ریشه) و پرانتز استفاده کنید. اعداد اعشاری با نقطه نوشته می‌شوند.
      </p>
    </div>
  );
}
