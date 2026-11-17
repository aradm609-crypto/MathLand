import { ArrowLeft, BookOpen, Award, PenTool, Gamepad2, Calculator, BarChart3, CheckCircle2, TrendingUp, Sparkles, Users, Clock, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { chapters, examBank } from '@/data';
import { Card, SectionTitle, Button, Badge } from '@/components/ui';
import { Logo } from '@/components/Logo';
import * as Icons from 'lucide-react';

export function HomePage() {
  const { navigate, progress } = useApp();

  const stats = [
    { label: 'فصل آموزشی', value: '۸', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/15 dark:text-indigo-300' },
    { label: 'سؤال آزمون', value: `${chapters.reduce((total, chapter) => total + chapter.quiz.length, 0) + examBank.length}`, icon: Award, color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300' },
    { label: 'امتحان آنلاین', value: '۲۴/۷', icon: Clock, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/15 dark:text-blue-300' },
    { label: 'امتیاز شما', value: `${progress.totalPoints}`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300' },
  ];

  const features = [
    { icon: BookOpen, title: 'محتوای کامل ۸ فصل', desc: 'توضیح مفاهیم، فرمول‌ها، مثال‌های حل‌شده و تمرین هر فصل کتاب ریاضی نهم.' },
    { icon: Award, title: 'آزمون آنلاین هوشمند', desc: 'آزمون جامع و فصل‌محور با تصحیح خودکار، نمره از ۲۰ و شناسایی فصل‌های ضعیف.' },
    { icon: PenTool, title: 'مرکز تمرین تعاملی', desc: 'تمرین با سه سطح آسان، متوسط و دشوار، همراه با پاسخ و توضیح هر سؤال.' },
    { icon: Calculator, title: 'ماشین‌حساب ریاضی', desc: 'ماشین‌حساب امن با پشتیبانی از توان، ریشه، پرانتز و اعشار، بدون استفاده از eval.' },
    { icon: Gamepad2, title: 'بازی ریاضی هیجان‌انگیز', desc: 'بازی با سؤالات تصادفی، شمارش معکوس و امتیاز برای یادگیری سرگرم‌کننده.' },
    { icon: BarChart3, title: 'داشبورد پیشرفت', desc: 'پیگیری امتحان‌ها، میانگین نمرات، فصل‌های تکمیل‌شده و نمودار عملکرد شما.' },
  ];

  const quickAccess = [
    { icon: Award, label: 'آزمون آنلاین', desc: 'آزمون جامع ۸ فصل', color: 'from-indigo-500 to-blue-600', page: 'exam' as const },
    { icon: PenTool, label: 'مرکز تمرین', desc: 'تمرین با سه سطح', color: 'from-violet-500 to-purple-600', page: 'practice' as const },
    { icon: Gamepad2, label: 'بازی ریاضی', desc: 'یادگیری با بازی', color: 'from-pink-500 to-rose-600', page: 'game' as const },
    { icon: Calculator, label: 'ماشین‌حساب', desc: 'محاسبات پیشرفته', color: 'from-emerald-500 to-teal-600', page: 'calculator' as const },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-radial text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #6366f1 0, transparent 40%), radial-gradient(circle at 80% 70%, #8b5cf6 0, transparent 40%)' }} />
        {/* Floating math symbols */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-20 right-[10%] text-6xl font-bold text-white/5 animate-float">∑</span>
          <span className="absolute top-40 left-[15%] text-5xl font-bold text-white/5 animate-float delay-200">π</span>
          <span className="absolute bottom-32 right-[20%] text-7xl font-bold text-white/5 animate-float delay-300">√</span>
          <span className="absolute bottom-20 left-[25%] text-6xl font-bold text-white/5 animate-float delay-100">∫</span>
          <span className="absolute top-1/2 right-[45%] text-4xl font-bold text-white/5 animate-float">∞</span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="flex justify-center mb-8 animate-scale-in">
            <Logo size={80} showText={false} />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-6 animate-fade-in-up">
            <Sparkles size={16} className="text-amber-300" />
            پلتفرم تعاملی آموزش ریاضی نهم
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in-up delay-100" style={{ lineHeight: 1.2 }}>
            به سرزمین ریاضی نهم<br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">خوش آمدید</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-300 leading-8 mb-10 animate-fade-in-up delay-200">
            یادگیری ریاضی نهم به‌صورت تعاملی با محتوای کامل ۸ فصل کتاب، آزمون‌های آنلاین،
            تمرین‌های گام‌به‌گام، ماشین‌حساب و بازی ریاضی. همه‌چیز برای موفقیت در ریاضی نهم.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Button size="lg" onClick={() => navigate('chapters')} className="!bg-white !text-indigo-700 hover:!bg-indigo-50">
              شروع یادگیری
              <ArrowLeft size={20} />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('exam')} className="!bg-white/10 !text-white !border !border-white/30 hover:!bg-white/20">
              <Award size={20} />
              آزمون آنلاین
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="p-5 animate-fade-in-up" >
                <div className={`inline-flex p-2.5 rounded-xl mb-3 ${s.color}`}>
                  <Icon size={22} />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Chapters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionTitle title="فصل‌های ریاضی نهم" subtitle="هر ۸ فصل کتاب ریاضی نهم با محتوای کامل و تعاملی" center />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {chapters.map((ch, i) => {
            const IconComp = (Icons as unknown as Record<string, typeof BookOpen>)[ch.icon] || BookOpen;
            return (
              <Card
                key={ch.id}
                onClick={() => navigate('chapter', String(ch.id))}
                className="p-6 group animate-fade-in-up"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${ch.gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <IconComp size={26} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400">فصل {ch.id}</span>
                  {progress.chapterQuizCompleted.includes(ch.id) && (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  )}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{ch.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-6">{ch.subtitle}</p>
                <div className="mt-4 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  مشاهده فصل <ArrowLeft size={16} />
                </div>
                <div style={{ animationDelay: `${i * 60}ms` }} />
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <SectionTitle title="دسترسی سریع" subtitle="ابزارهای تعاملی یادگیری ریاضی" center />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickAccess.map((q, i) => {
            const Icon = q.icon;
            return (
              <Card key={i} onClick={() => navigate(q.page)} className="p-6 text-center group animate-fade-in-up">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${q.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={30} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{q.label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{q.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle title="ویژگی‌های سرزمین ریاضی" subtitle="همه‌چیز برای یادگیری بهتر ریاضی نهم در یک پلتفرم" center />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={i} className="p-6 animate-fade-in-up">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{f.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-6">{f.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-700 p-10 sm:p-14 text-center text-white shadow-2xl shadow-indigo-500/20">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0, transparent 50%)' }} />
          <div className="relative">
            <Target className="mx-auto mb-4 text-amber-300" size={40} />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">آماده‌اید شروع کنید؟</h2>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto leading-7">
              با آزمون جامع ۸ فصل، میزان یادگیری خود را بسنجید و فصل‌های ضعیف خود را شناسایی کنید.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('exam')} className="!bg-white !text-indigo-700 hover:!bg-indigo-50">
                <Award size={20} />
                شروع آزمون جامع
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('dashboard')} className="!bg-white/10 !text-white !border !border-white/30 hover:!bg-white/20">
                <BarChart3 size={20} />
                مشاهده پیشرفت
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
