import { Award, BookOpen, PenTool, Gamepad2, TrendingUp, Trophy, Target, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { chapters } from '@/data';
import { Card, SectionTitle, Badge } from '@/components/ui';

export function DashboardPage() {
  const { progress, navigate } = useApp();

  const examCount = progress.exams.length;
  const avgScore = examCount > 0
    ? (progress.exams.reduce((s, e) => s + e.scoreOutOf20, 0) / examCount).toFixed(1)
    : '0';
  const completedChaptersCount = progress.completedChapters.length;
  const practiceCount = progress.practice.length;
  const gameCount = progress.games.length;
  const progressPct = Math.min(100, Math.round(((completedChaptersCount + examCount + practiceCount + gameCount) / (chapters.length + 10 + 10 + 10)) * 100));

  // Per-chapter performance
  const chapterPerf = chapters.map((c) => {
    const chExams = progress.exams.filter((e) => e.type === `chapter-${c.id}`);
    const quizzes = progress.chapterQuizCompleted.includes(c.id) ? 1 : 0;
    const score = chExams.length ? Math.max(...chExams.map((e) => e.scoreOutOf20)) : quizzes * 10;
    return { id: c.id, title: c.title, score, examCount: chExams.length, quizDone: quizzes > 0 };
  });

  const recentActivity = [
    ...progress.exams.map((e) => ({ date: e.date, type: 'exam' as const, label: e.title, detail: `نمره: ${e.scoreOutOf20}/20` })),
    ...progress.practice.map((p) => ({ date: p.date, type: 'practice' as const, label: chapters.find((c) => c.id === p.chapterId)?.title || 'تمرین', detail: `${p.correct}/${p.total} درست` })),
    ...progress.games.map((g) => ({ date: g.date, type: 'game' as const, label: 'بازی ریاضی', detail: `${g.correct}/${g.total} درست — ${g.score} امتیاز` })),
  ].sort((a, b) => b.date - a.date).slice(0, 8);

  const stats = [
    { label: 'آزمون‌های انجام‌شده', value: examCount, icon: Award, color: 'from-indigo-500 to-blue-600' },
    { label: 'میانگین نمره', value: `${avgScore}/20`, icon: TrendingUp, color: 'from-violet-500 to-purple-600' },
    { label: 'فصل‌های تکمیل‌شده', value: `${completedChaptersCount}/${chapters.length}`, icon: BookOpen, color: 'from-emerald-500 to-teal-600' },
    { label: 'تمرین‌ها', value: practiceCount, icon: PenTool, color: 'from-amber-500 to-orange-600' },
    { label: 'بازی‌ها', value: gameCount, icon: Gamepad2, color: 'from-pink-500 to-rose-600' },
    { label: 'کل امتیاز', value: progress.totalPoints, icon: Trophy, color: 'from-yellow-500 to-amber-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <SectionTitle title="پیشرفت من" subtitle="پیگیری عملکرد شما در آزمون‌ها، تمرین‌ها و بازی‌ها" center />

      {/* Overall progress ring */}
      <Card className="p-8 mb-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-center shadow-xl">
        <Target className="mx-auto mb-3 text-amber-300" size={40} />
        <h2 className="text-xl font-bold mb-2">پیشرفت کلی شما</h2>
        <div className="relative inline-flex items-center justify-center my-4">
          <svg width="160" height="160" className="transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.15)" strokeWidth="12" fill="none" />
            <circle
              cx="80" cy="80" r="70"
              stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progressPct / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute text-4xl font-extrabold">{progressPct}%</div>
        </div>
        <p className="text-indigo-100 text-sm">به یادگیری ادامه دهید تا پیشرفت بیشتری کسب کنید!</p>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="p-5">
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${s.color} text-white mb-3`}>
                <Icon size={22} />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Chapter performance chart */}
      <Card className="p-6 mb-8">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-600" /> عملکرد در فصل‌ها
        </h2>
        <div className="space-y-3">
          {chapterPerf.map((c) => (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span className="text-xs text-slate-400">فصل {c.id}</span>
                  {c.title}
                  {c.quizDone && <CheckCircle2 size={14} className="text-emerald-500" />}
                </span>
                <span className="text-xs font-bold text-slate-500">{c.score > 0 ? `${c.score}/20` : 'بدون داده'}</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${c.score >= 15 ? 'bg-emerald-500' : c.score >= 10 ? 'bg-amber-500' : c.score > 0 ? 'bg-rose-500' : 'bg-slate-300'}`}
                  style={{ width: `${c.score > 0 ? (c.score / 20) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent activity */}
      <Card className="p-6">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <Clock size={20} className="text-indigo-600" /> فعالیت‌های اخیر
        </h2>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Clock size={32} className="mx-auto mb-2 opacity-50" />
            هنوز فعالیتی ثبت نشده است.
            <div className="mt-4">
              <button onClick={() => navigate('exam')} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">شروع اولین آزمون →</button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {recentActivity.map((a, i) => {
              const Icon = a.type === 'exam' ? Award : a.type === 'practice' ? PenTool : Gamepad2;
              const color = a.type === 'exam' ? 'indigo' : a.type === 'practice' ? 'amber' : 'rose';
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600' : color === 'amber' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">{a.label}</div>
                    <div className="text-xs text-slate-400">{a.detail}</div>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{new Date(a.date).toLocaleDateString('fa-IR')}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
