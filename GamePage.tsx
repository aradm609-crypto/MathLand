import { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, Clock, Trophy, RefreshCw, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Badge, SectionTitle } from '@/components/ui';
import { addGameRecord } from '@/lib/storage';
import type { Difficulty } from '@/types';

type GameState = 'select' | 'playing' | 'result';

interface Question {
  text: string;
  answer: number;
}

function genQuestion(diff: Difficulty): Question {
  const r = (max: number) => Math.floor(Math.random() * max) + 1;
  let a: number, b: number, c: number, op: string, ans: number, text: string;
  if (diff === 'easy') {
    a = r(20); b = r(20);
    op = ['+', '-', '×'][Math.floor(Math.random() * 3)];
    if (op === '+') ans = a + b;
    else if (op === '-') { if (a < b) [a, b] = [b, a]; ans = a - b; }
    else ans = a * b;
    text = `${a} ${op} ${b}`;
  } else if (diff === 'medium') {
    const choice = Math.floor(Math.random() * 4);
    if (choice === 0) { a = r(50); b = r(50); ans = a + b; text = `${a} + ${b}`; }
    else if (choice === 1) { a = r(99); b = r(50); if (a < b) [a, b] = [b, a]; ans = a - b; text = `${a} − ${b}`; }
    else if (choice === 2) { a = r(12); b = r(12); ans = a * b; text = `${a} × ${b}`; }
    else { b = r(10); ans = r(10); a = b * ans; text = `${a} ÷ ${b}`; }
  } else {
    const choice = Math.floor(Math.random() * 4);
    if (choice === 0) { a = r(12); b = r(12); c = r(12); ans = a * b - c; text = `${a} × ${b} − ${c}`; }
    else if (choice === 1) { a = r(5) + 2; b = r(5) + 2; ans = a * a + b; text = `${a}² + ${b}`; }
    else if (choice === 2) { const sq = (r(10) + 1); ans = sq; text = `√${sq * sq}`; }
    else { b = r(10) + 1; ans = r(10) + 1; a = b * ans; text = `${a} ÷ ${b}`; }
  }
  return { text, answer: ans };
}

const ROUND_TIME: Record<Difficulty, number> = { easy: 30, medium: 30, hard: 45 };
const TOTAL_QS = 10;

export function GamePage() {
  const { progress, setProgress } = useApp();
  const [state, setState] = useState<GameState>('select');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [qNum, setQNum] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finalRecord, setFinalRecord] = useState<{ score: number; correct: number } | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishedRef = useRef(false);

  const nextQuestion = useCallback((diff: Difficulty) => {
    setQuestion(genQuestion(diff));
    setAnswer('');
    setFeedback(null);
  }, []);

  const start = (diff: Difficulty) => {
    finishedRef.current = false;
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setDifficulty(diff);
    setScore(0);
    setCorrect(0);
    setQNum(0);
    setTimeLeft(ROUND_TIME[diff]);
    setState('playing');
    nextQuestion(diff);
  };

  const finishGame = useCallback((finalScore: number, finalCorrect: number, diff: Difficulty) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    const rec = { date: Date.now(), difficulty: diff, score: finalScore, correct: finalCorrect, total: TOTAL_QS };
    setProgress(addGameRecord(progress, rec));
    setFinalRecord({ score: finalScore, correct: finalCorrect });
    setState('result');
  }, [progress, setProgress]);

  const submitAnswer = useCallback(() => {
    if (!question || !difficulty || feedback) return;
    const userNum = parseFloat(answer);
    const isCorrect = userNum === question.answer;
    if (isCorrect) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      setScore((s) => s + points);
      setCorrect((c) => c + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => {
      setQNum((q) => {
        const next = q + 1;
        if (next >= TOTAL_QS) {
          finishGame(
            isCorrect ? score + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30) : score,
            isCorrect ? correct + 1 : correct,
            difficulty,
          );
          return q;
        }
        nextQuestion(difficulty);
        return next;
      });
    }, 700);
  }, [question, answer, difficulty, feedback, score, correct, finishGame, nextQuestion]);

  // Timer
  useEffect(() => {
    if (state !== 'playing') return;
    if (timeLeft <= 0) {
      finishGame(score, correct, difficulty!);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [state, timeLeft, score, correct, difficulty, finishGame]);

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  // Enter key
  useEffect(() => {
    if (state !== 'playing') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') submitAnswer();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state, submitAnswer]);

  if (state === 'select') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <SectionTitle title="بازی ریاضی" subtitle="با سؤالات تصادفی و شمارش معکوس، ریاضی را به چالش بکشید!" center />
        <div className="grid sm:grid-cols-3 gap-4">
          {([
            { key: 'easy', label: 'آسان', desc: 'جمع، تفریق، ضرب اعداد کوچک', time: '۳۰ ثانیه', color: 'from-emerald-500 to-teal-600', pts: '۱۰ امتیاز' },
            { key: 'medium', label: 'متوسط', desc: 'عمل‌های ترکیبی و تقسیم', time: '۳۰ ثانیه', color: 'from-amber-500 to-orange-600', pts: '۲۰ امتیاز' },
            { key: 'hard', label: 'دشوار', desc: 'توان، ریشه و ترکیبی', time: '۴۵ ثانیه', color: 'from-rose-500 to-pink-600', pts: '۳۰ امتیاز' },
          ] as const).map((d) => (
            <Card key={d.key} className="p-6 text-center group hover:scale-105 transition-transform cursor-pointer" onClick={() => start(d.key)}>
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${d.color} text-white mb-4 shadow-lg`}>
                <Gamepad2 size={32} />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">{d.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3 leading-6">{d.desc}</p>
              <div className="flex items-center justify-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-slate-400"><Clock size={14} /> {d.time}</span>
                <span className="inline-flex items-center gap-1 text-amber-500 font-bold"><Zap size={14} /> {d.pts}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (state === 'playing' && question && difficulty) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* HUD */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Badge color="indigo">سؤال {qNum + 1} از {TOTAL_QS}</Badge>
          <Badge color={difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'amber' : 'rose'}>
            {difficulty === 'easy' ? 'آسان' : difficulty === 'medium' ? 'متوسط' : 'دشوار'}
          </Badge>
          <Badge color="amber"><Zap size={14} /> {score} امتیاز</Badge>
        </div>

        {/* Timer bar */}
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${timeLeft < 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
            style={{ width: `${(timeLeft / ROUND_TIME[difficulty]) * 100}%` }}
          />
        </div>
        <div className={`text-center text-2xl font-extrabold mb-6 ${timeLeft < 10 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
          {timeLeft}s
        </div>

        {/* Question */}
        <Card className="p-10 text-center mb-6">
          <div className="text-5xl font-extrabold text-slate-900 dark:text-white mb-2" style={{ direction: 'ltr' }}>
            {question.text} = ?
          </div>
          {feedback && (
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold animate-scale-in ${
              feedback === 'correct' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600'
            }`}>
              {feedback === 'correct' ? <><CheckCircle2 size={20} /> درست! +{difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30}</> : <><XCircle size={20} /> نادرست — پاسخ: {question.answer}</>}
            </div>
          )}
        </Card>

        <div className="flex gap-2">
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value.replace(/[^0-9.-]/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
            disabled={!!feedback}
            placeholder="پاسخ عددی..."
            className="flex-1 px-5 py-4 text-2xl font-bold text-center rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            style={{ direction: 'ltr' }}
            autoFocus
          />
          <Button size="lg" onClick={submitAnswer} disabled={!!feedback || !answer}>تأیید</Button>
        </div>
      </div>
    );
  }

  if (state === 'result' && finalRecord && difficulty) {
    const pct = Math.round((finalRecord.correct / TOTAL_QS) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Card className="p-8 text-center bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl">
          <Trophy className="mx-auto mb-3 text-amber-300" size={56} />
          <h1 className="text-3xl font-extrabold mb-2">پایان بازی!</h1>
          <div className="text-6xl font-extrabold my-4">{finalRecord.score}</div>
          <p className="text-indigo-100 mb-6">امتیاز نهایی</p>
          <div className="flex items-center justify-center gap-8">
            <div>
              <div className="text-3xl font-bold text-amber-300">{finalRecord.correct}/{TOTAL_QS}</div>
              <div className="text-sm text-indigo-200">درست</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-300">{pct}%</div>
              <div className="text-sm text-indigo-200">دقت</div>
            </div>
          </div>
        </Card>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button size="lg" onClick={() => start(difficulty)}><RefreshCw size={18} /> بازی دوباره</Button>
          <Button size="lg" variant="secondary" onClick={() => setState('select')}>تغییر سطح</Button>
        </div>
      </div>
    );
  }

  return null;
}
