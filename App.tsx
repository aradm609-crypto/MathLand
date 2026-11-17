import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar, Footer } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { ChaptersPage } from '@/pages/ChaptersPage';
import { ChapterPage } from '@/pages/ChapterPage';
import { ExamPage } from '@/pages/ExamPage';
import { PracticePage } from '@/pages/PracticePage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { GamePage } from '@/pages/GamePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AboutPage } from '@/pages/AboutPage';

function Router() {
  const { page } = useApp();
  switch (page) {
    case 'home': return <HomePage />;
    case 'chapters': return <ChaptersPage />;
    case 'chapter': return <ChapterPage />;
    case 'exam': return <ExamPage />;
    case 'practice': return <PracticePage />;
    case 'calculator': return <CalculatorPage />;
    case 'game': return <GamePage />;
    case 'dashboard': return <DashboardPage />;
    case 'about': return <AboutPage />;
    default: return <HomePage />;
  }
}

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Navbar />
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
