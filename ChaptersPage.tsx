import { ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { chapters } from '@/data';
import { Card, SectionTitle } from '@/components/ui';
import * as Icons from 'lucide-react';

export function ChaptersPage() {
  const { navigate, progress } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <SectionTitle
        title="فصل‌های ریاضی نهم"
        subtitle="هر ۸ فصل کتاب درسی ریاضی نهم با مفاهیم، فرمول‌ها، مثال‌ها و آزمون فصل"
        center
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((ch, i) => {
          const IconComp = (Icons as unknown as Record<string, typeof BookOpen>)[ch.icon] || BookOpen;
          const completed = progress.chapterQuizCompleted.includes(ch.id);
          return (
            <Card
              key={ch.id}
              onClick={() => navigate('chapter', String(ch.id))}
              className="p-6 group animate-fade-in-up"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${ch.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <IconComp size={28} />
                </div>
                {completed ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle2 size={16} /> تکمیل‌شده
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-400 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700">
                    فصل {ch.id}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{ch.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-6 mb-4">{ch.introduction.replace(/\$[^$]*\$/g, '').trim().slice(0, 90)}…</p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1"><BookOpen size={14} /> {ch.concepts.length} مفهوم</span>
                <span>•</span>
                <span>{ch.examples.length} مثال</span>
                <span>•</span>
                <span>{ch.practice.length} تمرین</span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                مطالعه فصل <ArrowLeft size={16} />
              </div>
              <div style={{ animationDelay: `${i * 60}ms` }} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
