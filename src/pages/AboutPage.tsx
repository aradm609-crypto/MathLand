import { useState } from 'react';
import { Info, Edit2, Check, Sparkles, Target, BookOpen, Award, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, Button, SectionTitle } from '@/components/ui';
import { Logo } from '@/components/Logo';

export function AboutPage() {
  const { settings, setSettings, navigate } = useApp();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(settings.creatorName || 'محمد آراد محمدی');

  const saveName = () => {
    setSettings({ ...settings, creatorName: nameInput.trim() });
    setEditing(false);
  };

  const values = [
    { icon: BookOpen, title: 'یادگیری تعاملی', desc: 'به‌جای حفظ صرف، با مثال‌های حل‌شده و تمرین‌های گام‌به‌گام، مفاهیم را عمیقاً درک کنید.' },
    { icon: Award, title: 'سنجش دقیق', desc: 'آزمون‌های آنلاین با تصحیح خودکار و شناسایی فصل‌های ضعیف، مسیر یادگیری را روشن می‌کنند.' },
    { icon: Target, title: 'هدف‌گذاری', desc: 'داشبورد پیشرفت به شما کمک می‌کند اهداف خود را پیگیری کنید و انگیزه خود را حفظ کنید.' },
    { icon: Heart, title: 'عشق به ریاضی', desc: 'بازی‌ها و چالش‌های ریاضی، یادگیری را لذت‌بخش می‌کنند و ترس از ریاضی را از بین می‌برند.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <SectionTitle title="درباره سرزمین ریاضی" subtitle="آشنایی با هدف و ویژگی‌های این پلتفرم" center />

      {/* Hero */}
      <Card className="p-8 mb-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-center shadow-xl">
        <div className="flex justify-center mb-5">
          <Logo size={72} showText={false} />
        </div>
        <h2 className="text-2xl font-extrabold mb-4">درباره سرزمین ریاضی</h2>
        <p className="text-indigo-100 leading-8 max-w-2xl mx-auto">
          «سرزمین ریاضی» ساخته شده تا یادگیری ریاضی نهم را برای دانش‌آموزان ایرانی ساده‌تر و لذت‌بخش‌تر کند.
          این پلتفرم با ارائه محتوای کامل ۸ فصل کتاب درسی، آزمون‌های آنلاین، تمرین‌های تعاملی، ماشین‌حساب و بازی ریاضی،
          فضایی فراهم کرده تا هر دانش‌آموز بتواند ریاضی را با سرعت و اعتمادبه‌نفس خود بیاموزد.
        </p>
      </Card>

      {/* Mission */}
      <Card className="p-7 mb-8">
        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles size={22} className="text-amber-500" /> مأموریت ما
        </h3>
        <p className="text-slate-600 dark:text-slate-300 leading-8">
          هدف سرزمین ریاضی، تبدیل ریاضی از یک درس دشوار به یک تجربه لذت‌بخش است. ما با طراحی محتوای دقیق و تطبیق‌یافته با
          کتاب درسی ریاضی نهم ایران، ابزارهای سنجش و تمرین هوشمند و بازی‌های آموزشی، دانش‌آموزان را برای موفقیت در
          امتحانات و درک عمیق مفاهیم آماده می‌کنیم. این وب‌سایت بدون نیاز به ثبت‌نام و کاملاً در دسترس همه است.
        </p>
      </Card>

      {/* Values */}
      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <Card key={i} className="p-6 animate-fade-in-up">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">{v.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-7">{v.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Creator */}
      <Card className="p-7 mb-8">
        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Info size={22} className="text-indigo-600" /> سازنده
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            {editing ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="نام سازنده را وارد کنید..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  autoFocus
                />
                <Button size="sm" onClick={saveName}><Check size={16} /> ذخیره</Button>
              </div>
            ) : (
              <>
                <div className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold min-w-[160px]">
                  {settings.creatorName || 'محمد آراد محمدی'}
                </div>
                <Button variant="secondary" size="sm" onClick={() => { setNameInput(settings.creatorName || 'محمد آراد محمدی'); setEditing(true); }}>
                  <Edit2 size={14} /> ویرایش
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 px-4 py-3">
            <div className="text-xs text-slate-400 mb-1">پایه تحصیلی</div>
            <div className="font-bold text-slate-800 dark:text-slate-100">نهم</div>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 px-4 py-3">
            <div className="text-xs text-slate-400 mb-1">کلاس</div>
            <div className="font-bold text-slate-800 dark:text-slate-100">نهم ب</div>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-3 leading-6">نام سازنده قابل ویرایش است.</p>
      </Card>

      <Card className="p-7 text-center">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">برای دانش‌آموزان نهم ایران</h3>
        <p className="text-slate-500 dark:text-slate-400 leading-7 mb-5">
          سرزمین ریاضی با عشق برای تسهیل یادگیری ریاضی نهم ساخته شده است.
        </p>
        <Button onClick={() => navigate('home')}>بازگشت به خانه</Button>
      </Card>
    </div>
  );
}
