import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Award, Clock, ChevronRight, ChevronLeft, CheckCircle2, XCircle, RefreshCw, AlertTriangle, TrendingDown, Trophy, BookOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getExamQuestions, chapters } from '@/data';
import type { ExamQuestion, ExamResult } from '@/types';
import { Card, Button, Badge, SectionTitle } from '@/components/ui';
import { RichText } from '@/components/Math';
import { addExamResult } from '@/lib/storage';

type ExamMode = 'select' | 'taking' | 'result';

export function ExamPage() {
  const { progress, setProgress, navigate } = useApp();
  const [mode, setMode] = useState<ExamMode>('select');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [examTitle, setExamTitle] = useState('');
  const deadlineRef = useRef<number | null>(null);
  const submittedRef = useRef(false);
  const submitExamRef = useRef<() => void>(() => undefined);

  const startExam = (chapterId?: number) => {
    const qs = getExamQuestions(chapterId, chapterId ? undefined : 10);
    setQuestions(qs);
    setAnswers({});
    setCurrent(0);
    const duration = qs.length * 90;
    setTimeLeft(duration);
    deadlineRef.current = Date.now() + duration * 1000;
    submittedRef.current = false;
    setExamTitle(chapterId ? `آزمون فصل ${chapterId}` : 'آزمون جامع ۸ فصل');
    setMode('taking');
  };

  const submitExam = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    if (questions.length === 0) return;
    let correct = 0;
    const weakChapters = new Set<number>();
    const answerList: ExamResult['answers'] = [];
    questions.forEach((q) => {
      const sel = answers[q.id] ?? null;
      const isCorrect = sel === q.correctIndex;
      if (isCorrect) correct++;
      else weakChapters.add(q.chapterId);
      answerList.push({ questionId: q.id, selected: sel, correct: isCorrect });
    });
    const total = questions.length;
    const scoreOutOf20 = Math.round((correct / total) * 20 * 10) / 10;
    const percentage = Math.round((correct / total) * 100);
    const res: ExamResult = {
      id: `exam-${Date.now()}`,
      date: Date.now(),
      type: examTitle.includes('جامع') ? 'comprehensive' : `chapter-${Number(examTitle.match(/\d+/)?.[0] ?? 1)}`,
      title: examTitle,
      total,
      correct,
      scoreOutOf20,
      percentage,
      weakChapters: Array.from(weakChapters),
      answers: answerList,
    };
    setResult(res);
    const newProgress = addExamResult(progress, res);
    setProgress(newProgress);
    setMode('result');
  }, [answers, questions, examTitle, progress, setProgress]);

  // Keep the latest submit callback without restarting the clock when answers change.
  useEffect(() => {
    submitExamRef.current = submitExam;
  }, [submitExam]);

  // Deadline-based timer: answer changes and renders cannot pause or reset elapsed time.
  useEffect(() => {
    if (mode !== 'taking' || deadlineRef.current === null) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current! - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0 && !submittedRef.current) submitExamRef.current();
    };
    tick();
    const timerId = window.setInterval(tick, 250);
    return () => window.clearInterval(timerId);
  }, [mode]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // SELECT MODE
  if (mode === 'select') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <SectionTitle title="آزمون آنلاین" subtitle="آزمون جامع یا آزمون اختصاصی هر فصل را شروع کنید" center />

        <Card className="p-8 mb-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-center shadow-xl">
          <Trophy className="mx-auto mb-3 text-amber-300" size={48} />
          <h2 className="text-2xl font-extrabold mb-2">آزمون جامع ۸ فصل</h2>
          <p className="text-indigo-100 mb-5">۱۰ سؤال تصادفی از همه فصل‌ها • تصحیح خودکار • نمره از ۲۰ • شناسایی فصل‌های ضعیف</p>
          <Button size="lg" onClick={() => startExam()} className="!bg-white !text-indigo-700 hover:!bg-indigo-50">
            <Award size={20} /> شروع آزمون جامع
          </Button>
        </Card>

        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 mt-10">آزمون اختصاصی هر فصل</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {chapters.map((ch) => {
            const chExams = progress.exams.filter((e) => e.title === `آزمون فصل ${ch.id}`);
            const best = chExams.length ? Math.max(...chExams.map((e) => e.scoreOutOf20)) : null;
            return (
              <Card key={ch.id} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">فصل {ch.id}</span>
                  {best !== null && <Badge color={best >= 15 ? 'green' : 'amber'}>بهترین: {best}/20</Badge>}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">{ch.title}</h4>
                <Button size="sm" className="w-full" onClick={() => startExam(ch.id)}>شروع آزمون</Button>
              </Card>
            );
          })}
        </div>

        {progress.exams.length > 0 && (
          <div className="mt-10">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">آزمون‌های اخیر</h3>
            <div className="space-y-3">
              {progress.exams.slice(-5).reverse().map((e) => (
                <Card key={e.id} className="p-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{e.title}</div>
                    <div className="text-sm text-slate-400">{new Date(e.date).toLocaleDateString('fa-IR')}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge color={e.scoreOutOf20 >= 15 ? 'green' : e.scoreOutOf20 >= 10 ? 'amber' : 'rose'}>{e.scoreOutOf20}/20</Badge>
                    <span className="text-sm text-slate-500">{e.percentage}%</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // TAKING MODE
  if (mode === 'taking' && questions.length > 0) {
    const q = questions[current];
    const answered = Object.keys(answers).length;
    const progressPct = (answered / questions.length) * 100;
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{examTitle}</h1>
            <p className="text-sm text-slate-500">سؤال {current + 1} از {questions.length}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${timeLeft < 60 ? 'bg-rose-50 dark:bg-rose-500/15 text-rose-600' : 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600'}`}>
            <Clock size={18} /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Question */}
        <Card className="p-7 animate-fade-in" key={q.id}>
          <Badge color="slate">{q.chapterTitle}</Badge>
          <p className="text-lg text-slate-900 dark:text-white leading-8 my-4 font-medium">
            <RichText text={q.question} />
          </p>
          <div className="grid gap-3">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi;
              return (
                <button
                  key={oi}
                  onClick={() => setAnswers({ ...answers, [q.id]: oi })}
                  className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-right transition-all ${
                    selected
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    selected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  <span className="flex-1"><RichText text={opt} /></span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="secondary" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
            <ChevronRight size={18} /> قبلی
          </Button>
          <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
            {questions.map((qq, i) => (
              <button
                key={qq.id}
                onClick={() => setCurrent(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  i === current
                    ? 'bg-indigo-600 text-white'
                    : answers[qq.id] !== undefined
                    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {current < questions.length - 1 ? (
            <Button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
              بعدی <ChevronLeft size={18} />
            </Button>
          ) : (
            <Button variant="danger" onClick={submitExam}>
              <Award size={18} /> ثبت آزمون
            </Button>
          )}
        </div>
      </div>
    );
  }

  // RESULT MODE
  if (mode === 'result' && result) {
    const weakChapterNames = result.weakChapters
      .map((id) => chapters.find((c) => c.id === id)?.title)
      .filter(Boolean);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Card className="p-8 mb-6 text-center bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl">
          <Trophy className="mx-auto mb-3 text-amber-300" size={48} />
          <h1 className="text-2xl font-extrabold mb-2">نتیجه آزمون</h1>
          <p className="text-indigo-100 mb-6">{result.title}</p>
          <div className="text-7xl font-extrabold mb-2">{result.scoreOutOf20}<span className="text-3xl text-indigo-200">/20</span></div>
          <div className="text-xl font-bold text-amber-300 mb-4">{result.percentage}%</div>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-300" /> {result.correct} درست</div>
            <div className="flex items-center gap-2"><XCircle size={18} className="text-rose-300" /> {result.total - result.correct} نادرست</div>
          </div>
        </Card>

        {weakChapterNames.length > 0 && (
          <Card className="p-6 mb-6 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20">
            <div className="flex items-center gap-2 mb-3 text-amber-800 dark:text-amber-300 font-bold">
              <TrendingDown size={22} /> فصل‌های ضعیف شما
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-200 mb-3">برای بهبود، این فصل‌ها را مرور کنید:</p>
            <div className="flex flex-wrap gap-2">
              {weakChapterNames.map((n) => (
                <Badge key={n} color="amber"><BookOpen size={14} /> {n}</Badge>
              ))}
            </div>
          </Card>
        )}

        <h2 className="font-bold text-xl text-slate-900 dark:text-white mb-4">پاسخ‌نامه و توضیحات</h2>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const sel = answers[q.id];
            const correct = sel === q.correctIndex;
            return (
              <Card key={q.id} className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-7 flex-1"><RichText text={q.question} /></p>
                  {correct ? <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" /> : <XCircle size={20} className="text-rose-500 flex-shrink-0" />}
                </div>
                <div className="grid sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === q.correctIndex;
                    const isSelected = sel === oi;
                    let cls = 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400';
                    if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
                    else if (isSelected) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300';
                    return (
                      <div key={oi} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm ${cls}`}>
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">{String.fromCharCode(65 + oi)}</span>
                        <span className="flex-1"><RichText text={opt} /></span>
                        {isCorrect && <CheckCircle2 size={16} className="text-emerald-500" />}
                        {isSelected && !isCorrect && <XCircle size={16} className="text-rose-500" />}
                      </div>
                    );
                  })}
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-400 leading-7">
                  <span className="font-bold">توضیح: </span><RichText text={q.explanation} />
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <Button size="lg" onClick={() => { setMode('select'); setResult(null); }}><RefreshCw size={18} /> آزمون دوباره</Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('dashboard')}>مشاهده پیشرفت</Button>
        </div>
      </div>
    );
  }

  return null;
}
