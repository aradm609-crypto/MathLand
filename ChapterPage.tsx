import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Lightbulb, CheckCircle2, XCircle, Award, BookOpen, Calculator as CalcIcon, PencilLine, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getChapter } from '@/data';
import { MathExpr, RichText } from '@/components/Math';
import { Card, Button, Badge } from '@/components/ui';
import * as Icons from 'lucide-react';
import { markQuizCompleted, markChapterCompleted } from '@/lib/storage';
import { answersMatch } from '@/lib/answer';

export function ChapterPage() {
  const { pageParam, navigate, progress, setProgress } = useApp();
  const chapterId = Number(pageParam);
  const chapter = getChapter(chapterId);
  const [tab, setTab] = useState<'learn' | 'practice' | 'quiz'>('learn');
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceChecked, setPracticeChecked] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    setTab('learn');
    setPracticeAnswers({});
    setPracticeChecked({});
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [chapterId]);

  if (!chapter) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">فصل موردنظر یافت نشد.</p>
        <Button onClick={() => navigate('chapters')} className="mt-4">بازگشت به فصل‌ها</Button>
      </div>
    );
  }

  const IconComp = (Icons as unknown as Record<string, typeof BookOpen>)[chapter.icon] || BookOpen;

  // Practice check
  const checkPractice = (idx: number) => {
    if (!practiceAnswers[idx]?.trim()) return;
    setPracticeChecked({ ...practiceChecked, [idx]: true });
  };

  const practiceCorrectCount = Object.keys(practiceChecked).filter((k) => {
    if (!practiceChecked[Number(k)]) return false;
    const i = Number(k);
    return answersMatch(practiceAnswers[i] || '', chapter.practice[i].answer);
  }).length;

  // Quiz
  const quizTotal = chapter.quiz.length;
  const quizCorrect = Object.entries(quizAnswers).filter(([k, v]) => chapter.quiz[Number(k)].correctIndex === v).length;
  const quizScore = Math.round((quizCorrect / quizTotal) * 20);

  const submitQuiz = () => {
    setQuizSubmitted(true);
    let newProgress = markQuizCompleted(progress, chapter.id);
    newProgress = markChapterCompleted(newProgress, chapter.id);
    setProgress(newProgress);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const tabs = [
    { key: 'learn' as const, label: 'یادگیری', icon: BookOpen },
    { key: 'practice' as const, label: 'تمرین', icon: PencilLine },
    { key: 'quiz' as const, label: 'آزمون فصل', icon: Award },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${chapter.gradient} p-8 text-white mb-8 shadow-xl`}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0, transparent 50%)' }} />
        <div className="relative">
          <button onClick={() => navigate('chapters')} className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <ArrowRight size={16} /> بازگشت به فصل‌ها
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur">
              <IconComp size={36} />
            </div>
            <div>
              <div className="text-sm text-white/80">فصل {chapter.id}</div>
              <h1 className="text-3xl font-extrabold">{chapter.title}</h1>
              <p className="text-white/90 mt-1">{chapter.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit flex-wrap">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.key
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={18} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Learn tab */}
      {tab === 'learn' && (
        <div className="space-y-8 animate-fade-in">
          {/* Intro */}
          <Card className="p-6">
            <h2 className="font-bold text-xl text-slate-900 dark:text-white mb-3">معرفی فصل</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-8">{chapter.introduction}</p>
          </Card>

          {/* Concepts */}
          <div>
            <h2 className="font-bold text-xl text-slate-900 dark:text-white mb-4">مفاهیم کلیدی</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {chapter.concepts.map((c, i) => (
                <Card key={i} className="p-5 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-bold">{i + 1}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white">{c.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-7"><RichText text={c.body} /></p>
                </Card>
              ))}
            </div>
          </div>

          {/* Formulas */}
          <div>
            <h2 className="font-bold text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CalcIcon size={22} className="text-indigo-600" /> فرمول‌های مهم
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {chapter.formulas.map((f, i) => (
                <Card key={i} className="p-5">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{f.name}</div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-center">
                    <MathExpr expression={f.expression} display />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div>
            <h2 className="font-bold text-xl text-slate-900 dark:text-white mb-4">مثال‌های حل‌شده</h2>
            <div className="space-y-4">
              {chapter.examples.map((ex, i) => (
                <Card key={i} className="p-6 animate-fade-in-up">
                  <Badge color="indigo">مثال {i + 1}</Badge>
                  <div className="mt-3 mb-4 text-slate-800 dark:text-slate-200 leading-7">
                    <RichText text={ex.problem} />
                  </div>
                  <div className="space-y-2 mb-4">
                    {ex.steps.map((s, si) => (
                      <div key={si} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">{si + 1}</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 leading-7"><RichText text={s} /></span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3">
                    <CheckCircle2 size={20} />
                    <span>پاسخ: <RichText text={ex.answer} /></span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips */}
          <Card className="p-6 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20">
            <h2 className="font-bold text-lg text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
              <Lightbulb size={22} /> نکات آزمونی
            </h2>
            <ul className="space-y-2">
              {chapter.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200 leading-7">
                  <span className="text-amber-500 mt-1">◆</span> <RichText text={t} />
                </li>
              ))}
            </ul>
          </Card>

          <div className="text-center">
            <Button size="lg" onClick={() => setTab('practice')}>
              رفتن به تمرین‌ها <ArrowLeft size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Practice tab */}
      {tab === 'practice' && (
        <div className="animate-fade-in space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-bold text-xl text-slate-900 dark:text-white">تمرین‌های فصل</h2>
            <Badge color="indigo">{practiceCorrectCount} از {chapter.practice.length} درست</Badge>
          </div>
          {chapter.practice.map((q, i) => {
            const checked = practiceChecked[i];
            const userAns = practiceAnswers[i] || '';
            const correct = checked && normalize(userAns) === normalize(q.answer);
            return (
              <Card key={i} className="p-6 animate-fade-in-up">
                <div className="flex items-start gap-2 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-7"><RichText text={q.question} /></p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <input
                    value={userAns}
                    onChange={(e) => setPracticeAnswers({ ...practiceAnswers, [i]: e.target.value })}
                    disabled={checked}
                    placeholder="پاسخ خود را وارد کنید..."
                    className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-indigo-500 disabled:opacity-60"
                    style={{ direction: 'ltr' }}
                  />
                  {!checked && (
                    <Button onClick={() => checkPractice(i)} disabled={!userAns.trim()}>بررسی</Button>
                  )}
                  {checked && (
                    <Button variant="ghost" onClick={() => { setPracticeChecked({ ...practiceChecked, [i]: false }); }}>دوباره</Button>
                  )}
                </div>
                {checked && (
                  <div className="mt-4 animate-fade-in">
                    <div className={`flex items-center gap-2 font-bold mb-2 ${correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                      {correct ? 'درست!' : 'نادرست'}
                      {!correct && <span className="text-sm font-normal">— پاسخ صحیح: <RichText text={q.answer} /></span>}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-400 leading-7">
                      <RichText text={q.explanation} />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
          <div className="text-center pt-4">
            <Button size="lg" onClick={() => setTab('quiz')}>آزمون فصل <ArrowLeft size={18} /></Button>
          </div>
        </div>
      )}

      {/* Quiz tab */}
      {tab === 'quiz' && (
        <div className="animate-fade-in space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-bold text-xl text-slate-900 dark:text-white">آزمون فصل {chapter.id}</h2>
            {!quizSubmitted ? (
              <Badge color="amber">{Object.keys(quizAnswers).length} از {quizTotal} پاسخ داده‌شده</Badge>
            ) : (
              <Badge color={quizScore >= 15 ? 'green' : quizScore >= 10 ? 'amber' : 'rose'}>
                نمره: {quizScore} از ۲۰
              </Badge>
            )}
          </div>

          {chapter.quiz.map((q, i) => {
            const selected = quizAnswers[i];
            const showResult = quizSubmitted;
            return (
              <Card key={i} className="p-6 animate-fade-in-up">
                <div className="flex items-start gap-2 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-7 font-medium"><RichText text={q.question} /></p>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === q.correctIndex;
                    const isSelected = selected === oi;
                    let cls = 'border-slate-200 dark:border-slate-700 hover:border-indigo-400';
                    if (showResult && isCorrect) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
                    else if (showResult && isSelected && !isCorrect) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300';
                    else if (isSelected) cls = 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300';
                    return (
                      <button
                        key={oi}
                        disabled={showResult}
                        onClick={() => setQuizAnswers({ ...quizAnswers, [i]: oi })}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm text-right transition-all ${cls}`}
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className="flex-1"><RichText text={opt} /></span>
                        {showResult && isCorrect && <CheckCircle2 size={18} className="text-emerald-500" />}
                        {showResult && isSelected && !isCorrect && <XCircle size={18} className="text-rose-500" />}
                      </button>
                    );
                  })}
                </div>
                {showResult && (
                  <div className="mt-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-400 leading-7">
                    <span className="font-bold">توضیح: </span><RichText text={q.explanation} />
                  </div>
                )}
              </Card>
            );
          })}

          {!quizSubmitted ? (
            <div className="text-center pt-2">
              <Button size="lg" onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < quizTotal}>
                <Award size={18} /> ثبت آزمون
              </Button>
              {Object.keys(quizAnswers).length < quizTotal && (
                <p className="text-sm text-slate-400 mt-2">به همه سؤالات پاسخ دهید.</p>
              )}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <div className="text-5xl font-extrabold mb-2 gradient-text">{quizScore}/20</div>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {quizScore >= 17 ? 'عالی! تسلط کامل.' : quizScore >= 13 ? 'خوب بود، ادامه دهید.' : quizScore >= 10 ? 'قابل قبول، بیشتر تمرین کنید.' : 'نیاز به مرور بیشتری دارد.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button onClick={resetQuiz}><RefreshCw size={16} /> آزمون دوباره</Button>
                <Button variant="secondary" onClick={() => navigate('exam')}>آزمون جامع</Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
