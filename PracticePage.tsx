import { useState } from 'react';
import { PenTool, CheckCircle2, XCircle, RefreshCw, Award, BookOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { chapters } from '@/data';
import { Card, Button, Badge, SectionTitle } from '@/components/ui';
import { RichText } from '@/components/Math';
import { addPracticeRecord } from '@/lib/storage';
import { answersMatch } from '@/lib/answer';
import type { PracticeQuestion } from '@/types';

type Difficulty = 'easy' | 'medium' | 'hard';

function generateQuestions(chapterId: number, difficulty: Difficulty): PracticeQuestion[] {
  const base = chapters.find((c) => c.id === chapterId);
  const extra: Record<number, Record<Difficulty, PracticeQuestion[]>> = {
    1: {
      easy: [
        { question: '$A = \\{1, 2\\}$، تعداد زیرمجموعه‌های $A$؟', answer: '4', explanation: '$2^2 = 4$.' },
        { question: 'اگر $A = \\{a, b\\}$ و $B = \\{a, b, c\\}$، $A \\subseteq B$؟ (بله/خیر)', answer: 'بله', explanation: 'هر عضو $A$ عضو $B$ است.' },
      ],
      medium: [
        { question: 'در کلاس ۳۰ نفره، ۱۵ نفر فوتبال و ۱۰ نفر والیبال و ۵ نفر هر دو. چند نفر هیچ‌کدام؟', answer: '10', explanation: '$15+10-5=20$، $30-20=10$.' },
        { question: 'تعداد زیرمجموعه‌های مجموعه ۴ عضوی چند است؟', answer: '16', explanation: '$2^4 = 16$.' },
      ],
      hard: [
        { question: 'در نظرسنجی ۱۰۰ نفر، ۶۰ چای و ۵۰ قهوه و ۲۰ هر دو. چند نفر قهوه ولی چای نه؟', answer: '30', explanation: 'قهوه‌خوران: ۵۰، هر دو: ۲۰، فقط قهوه: $50-20=30$.' },
        { question: 'اگر $|A|=5$، تعداد زیرمجموعه‌های ناتهی و محض $A$ چند است؟', answer: '30', explanation: '$2^5-2=30$ (کم کردن خود $A$ و مجموعه خالی).' },
      ],
    },
    3: {
      easy: [
        { question: 'مجموع زاویه‌های داخلی یک مثلث چند درجه است؟', answer: '180°', explanation: 'همیشه $180^\\circ$ است.' },
        { question: 'در مثلث متساوی‌الاضلاع هر زاویه چند درجه است؟', answer: '60°', explanation: '$180^\\circ \\div 3 = 60^\\circ$.' },
      ],
      medium: [
        { question: 'مجموع زاویه‌های داخلی یک پنج‌ضلعی چند درجه است؟', answer: '540°', explanation: '$(5-2) \\times 180^\\circ = 540^\\circ$.' },
        { question: 'آیا مثلث با اضلاع ۲، ۳، ۶ قابل ترسیم است؟ (بله/خیر)', answer: 'خیر', explanation: '$2+3=5 < 6$، پس خیر.' },
      ],
      hard: [
        { question: 'مجموع زاویه‌های داخلی یک هشت‌ضلعی چند درجه است؟', answer: '1080°', explanation: '$(8-2) \\times 180^\\circ = 1080^\\circ$.' },
        { question: 'در مثلث با زاویه‌های $40^\\circ$ و $70^\\circ$، زاویه سوم چند است؟', answer: '70°', explanation: '$180 - 40 - 70 = 70^\\circ$.' },
      ],
    },
    7: {
      easy: [
        { question: 'ساده کنید: $\\frac{x^2 - 4}{x - 2}$', answer: 'x + 2', explanation: '$\\frac{(x-2)(x+2)}{x-2} = x+2$.' },
        { question: 'حاصل $\\frac{x}{3} \\times \\frac{6}{x^2}$ با شرط $x \\ne 0$؟', answer: '2/x', explanation: '$\\frac{6x}{3x^2} = \\frac{2}{x}$.' },
      ],
      medium: [
        { question: 'ساده کنید: $\\frac{x^2 - 25}{x + 5}$', answer: 'x - 5', explanation: '$\\frac{(x-5)(x+5)}{x+5} = x-5$.' },
        { question: 'حل: $\\frac{2}{x} = 4$', answer: 'x = 1/2', explanation: '$2 = 4x$، $x = \\frac{1}{2}$.' },
      ],
      hard: [
        { question: 'حاصل $\\frac{2x}{3} \\div \\frac{x}{6}$ با شرط $x \\ne 0$؟', answer: '4', explanation: '$\\frac{2x}{3} \\times \\frac{6}{x} = \\frac{12x}{3x} = 4$.' },
        { question: 'حل: $\\frac{1}{x} + \\frac{1}{2} = 1$', answer: 'x = 2', explanation: 'مخرج مشترک $2x$: $2 + x = 2x$، $x = 2$.' },
      ],
    },
    2: {
      easy: [
        { question: 'کدام گویا است؟ $\\sqrt{4}$ یا $\\sqrt{2}$؟', answer: '\\sqrt{4}', explanation: '$\\sqrt{4} = 2$ که گویا است.' },
        { question: 'عدد ۰٫۵ به صورت کسر؟', answer: '1/2', explanation: '$0.5 = \\frac{5}{10} = \\frac{1}{2}$.' },
      ],
      medium: [
        { question: '$0.\\overline{4}$ (متناوب) به کسر؟', answer: '4/9', explanation: '$x=0.44\\ldots$، $10x=4.44\\ldots$، $9x=4$، $x=\\frac{4}{9}$.' },
        { question: 'خطای مطلق تقریب ۳ به‌جای $3.14$ چند است؟', answer: '0.14', explanation: '$|3.14 - 3| = 0.14$.' },
      ],
      hard: [
        { question: 'خطای نسبی تقریب $1.41$ به‌جای $\\sqrt{2}\\approx 1.4142$ چند درصد؟ (تا ۲ رقم)', answer: '0.30%', explanation: '$\\frac{0.0042}{1.4142} \\times 100 \\approx 0.30\\%$.' },
        { question: 'آیا $0.1010010001\\ldots$ گویا است؟ (بله/خیر)', answer: 'خیر', explanation: 'این عدد غیرمتناوب است پس ناگویا.' },
      ],
    },
    4: {
      easy: [
        { question: 'مقدار $3^2$ چند است؟', answer: '9', explanation: '$3 \\times 3 = 9$.' },
        { question: '$\\sqrt{49}$ چند است؟', answer: '7', explanation: '$7^2 = 49$.' },
      ],
      medium: [
        { question: '$2^3 \\times 2^2$ را ساده کنید.', answer: '2^5', explanation: '$2^{3+2} = 2^5$.' },
        { question: '$\\sqrt{50}$ ساده‌شده؟', answer: '5\\sqrt{2}', explanation: '$50 = 25 \\times 2$، $\\sqrt{50} = 5\\sqrt{2}$.' },
      ],
      hard: [
        { question: '$(2^{-2})^{-3}$ را ساده کنید.', answer: '2^6', explanation: '$(2^{-2})^{-3} = 2^6$.' },
        { question: '$\\sqrt{8 \\times 18}$ را ساده کنید.', answer: '12', explanation: '$8 \\times 18 = 144$، $\\sqrt{144} = 12$.' },
      ],
    },
    5: {
      easy: [
        { question: 'حاصل $(x + 1)(x + 2)$؟', answer: 'x^2 + 3x + 2', explanation: '$x \\cdot x + x \\cdot 2 + 1 \\cdot x + 1 \\cdot 2$.' },
        { question: 'تجزیه $x^2 - 1$؟', answer: '(x-1)(x+1)', explanation: 'تفاضل دو مربع.' },
      ],
      medium: [
        { question: 'عبارت $x^2 - 5x + 6$ را تجزیه کنید.', answer: '(x-2)(x-3)', explanation: 'دو عدد ۲ و ۳ حاصل‌ضرب ۶ و مجموع ۵ دارند؛ پس $x^2-5x+6=(x-2)(x-3)$. ' },
        { question: 'تجزیه $2x^2 - 8$؟', answer: '2(x-2)(x+2)', explanation: '$2(x^2-4) = 2(x-2)(x+2)$.' },
      ],
      hard: [
        { question: 'عبارت $2x^2 + 5x - 3$ را تجزیه کنید.', answer: '(2x-1)(x+3)', explanation: 'با ضرب دو دوجمله‌ای: $(2x-1)(x+3)=2x^2+5x-3$. ' },
        { question: 'حاصل $(2x + 1)(2x - 1)$؟', answer: '4x^2 - 1', explanation: 'تفاضل دو مربع: $(2x)^2 - 1^2$.' },
      ],
    },
    6: {
      easy: [
        { question: 'شیب خط $y = 5x + 2$؟', answer: '5', explanation: 'ضریب $x$ شیب است.' },
        { question: 'عرض از مبدا $y = 3x - 7$؟', answer: '-7', explanation: 'جمله ثابت $b = -7$.' },
      ],
      medium: [
        { question: 'خط گذرنده از $(0,0)$ و $(2,6)$، معادله؟', answer: 'y = 3x', explanation: '$m = \\frac{6}{2} = 3$، $b = 0$.' },
        { question: 'حل: $x + y = 4$، $x - y = 2$', answer: 'x = 3, y = 1', explanation: 'جمع: $2x=6$، $x=3$، $y=1$.' },
      ],
      hard: [
        { question: 'معادله خط عمود بر $y = 2x + 1$ از $(0,0)$؟', answer: 'y = -1/2 x', explanation: '$m_1 \\cdot m_2 = -1$، پس $m = -\\frac{1}{2}$.' },
        { question: 'حل: $2x + 3y = 12$، $x - y = 1$', answer: 'x = 3, y = 2', explanation: '$x=y+1$، $2(y+1)+3y=12$، $5y=10$، $y=2$، $x=3$.' },
      ],
    },
    8: {
      easy: [
        { question: 'حجم مکعب با ضلع ۳؟', answer: '27', explanation: '$V = 3^3 = 27$.' },
        { question: 'مساحت دایره با $r = 2$؟', answer: '4\\pi', explanation: '$A = \\pi r^2 = 4\\pi$.' },
      ],
      medium: [
        { question: 'حجم مخروط $r=3$، $h=4$؟', answer: '12\\pi', explanation: '$V = \\frac{1}{3}\\pi (9)(4) = 12\\pi$.' },
        { question: 'مساحت کره با $r = 3$؟', answer: '36\\pi', explanation: '$S = 4\\pi (9) = 36\\pi$.' },
      ],
      hard: [
        { question: 'حجم کره با $r = 6$؟', answer: '288\\pi', explanation: '$V = \\frac{4}{3}\\pi (216) = 288\\pi$.' },
        { question: 'حجم هرم با قاعده مربع ضلع ۶ و ارتفاع ۸؟', answer: '96', explanation: '$V = \\frac{1}{3}(36)(8) = 96$.' },
      ],
    },
  };
  const fromExtra = extra[chapterId]?.[difficulty] ?? [];
  const fromBase = base ? base.practice : [];
  return [...fromExtra, ...fromBase];
}

export function PracticePage() {
  const { progress, setProgress } = useApp();
  const [chapterId, setChapterId] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [started, setStarted] = useState(false);

  const start = () => {
    if (!chapterId || !difficulty) return;
    const qs = generateQuestions(chapterId, difficulty);
    setQuestions(qs);
    setAnswers({});
    setChecked({});
    setStarted(true);
  };

  const reset = () => {
    setStarted(false);
    setChapterId(null);
    setDifficulty(null);
    setQuestions([]);
  };

  const correctCount = Object.keys(checked).filter((k) => {
    if (!checked[Number(k)]) return false;
    const i = Number(k);
    return answersMatch(answers[i] || '', questions[i].answer);
  }).length;

  const check = (i: number) => {
    if (!answers[i]?.trim()) return;
    setChecked({ ...checked, [i]: true });
  };

  const finish = () => {
    if (!chapterId || !difficulty) return;
    const rec = {
      date: Date.now(),
      chapterId,
      difficulty,
      correct: correctCount,
      total: questions.length,
      pointsEarned: correctCount * 5,
    };
    setProgress(addPracticeRecord(progress, rec));
    reset();
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <SectionTitle title="مرکز تمرین" subtitle="یک فصل و سطح دشواری انتخاب کنید و شروع به تمرین کنید" center />
        <Card className="p-7">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><BookOpen size={20} /> انتخاب فصل</h3>
          <div className="grid sm:grid-cols-2 gap-2 mb-6">
            {chapters.map((c) => (
              <button
                key={c.id}
                onClick={() => setChapterId(c.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-right transition-all ${
                  chapterId === c.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                <span className="text-xs font-bold text-slate-400 w-6">فصل {c.id}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{c.title}</span>
              </button>
            ))}
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white mb-3">سطح دشواری</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {([
              { key: 'easy', label: 'آسان', active: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
              { key: 'medium', label: 'متوسط', active: 'border-amber-500 bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300' },
              { key: 'hard', label: 'دشوار', active: 'border-rose-500 bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300' },
            ] as const).map((d) => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={`px-4 py-3 rounded-xl border-2 font-bold transition-all ${
                  difficulty === d.key
                    ? d.active
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-600 dark:text-slate-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <Button size="lg" className="w-full" onClick={start} disabled={!chapterId || !difficulty}>
            <PenTool size={18} /> شروع تمرین
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">تمرین</h1>
        <div className="flex items-center gap-2">
          <Badge color="indigo">{chapters.find((c) => c.id === chapterId)?.title}</Badge>
          <Badge color={difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'amber' : 'rose'}>
            {difficulty === 'easy' ? 'آسان' : difficulty === 'medium' ? 'متوسط' : 'دشوار'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">{correctCount} از {questions.length} درست</span>
        <Button variant="ghost" size="sm" onClick={reset}><RefreshCw size={14} /> تغییر</Button>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => {
          const isChecked = checked[i];
          const userAns = answers[i] || '';
          const correct = isChecked && answersMatch(userAns, q.answer);
          return (
            <Card key={i} className="p-6 animate-fade-in-up">
              <div className="flex items-start gap-2 mb-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <p className="text-slate-800 dark:text-slate-200 leading-7"><RichText text={q.question} /></p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <input
                  value={userAns}
                  onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                  disabled={isChecked}
                  placeholder="پاسخ..."
                  className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-indigo-500 disabled:opacity-60"
                  style={{ direction: 'ltr' }}
                />
                {!isChecked ? (
                  <Button size="sm" onClick={() => check(i)} disabled={!userAns.trim()}>بررسی</Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setChecked({ ...checked, [i]: false })}>دوباره</Button>
                )}
              </div>
              {isChecked && (
                <div className="mt-4 animate-fade-in">
                  <div className={`flex items-center gap-2 font-bold mb-2 ${correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    {correct ? 'درست!' : 'نادرست'}
                    {!correct && <span className="text-sm font-normal">— پاسخ: <RichText text={'$' + q.answer + '$'} /></span>}
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-400 leading-7">
                    <RichText text={q.explanation} />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Button size="lg" onClick={finish}><Award size={18} /> ثبت و پایان تمرین</Button>
      </div>
    </div>
  );
}
