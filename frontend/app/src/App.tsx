import { useState } from 'react';
import { LoginPage } from '@/features/auth/LoginPage';
import { OnboardingWizard } from '@/features/onboarding';
import { DashboardPage } from '@/features/dashboard';
import { SkillGapPage } from '@/features/skillgap';
import { LearningPage } from '@/features/learning';
import { JobsPage } from '@/features/jobs';
import { ProgressPage } from '@/features/progress';
import { SettingsPage } from '@/features/settings';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { StudyTimer } from '@/components/ui/StudyTimer';
import { OnboardingTooltips } from '@/components/ui/OnboardingTooltips';
import './App.css';

type Page =
  | 'login'
  | 'onboarding'
  | 'dashboard'
  | 'skill-gap'
  | 'learning'
  | 'jobs'
  | 'ai-helper'
  | 'progress'
  | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  useKeyboardShortcuts();

  const isDashboard = !['login', 'onboarding'].includes(currentPage);

  // Handle login
  const handleLogin = () => {
    setCurrentPage('onboarding');
  };

  // Handle navigation
  const navigate = (path: string) => {
    const page = path.replace('/dashboard/', '').replace('/dashboard', 'dashboard') as Page;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setCurrentPage('dashboard');
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'onboarding':
        return <OnboardingWizard onComplete={handleOnboardingComplete} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case 'skill-gap':
        return <SkillGapPage onNavigate={navigate} />;
      case 'learning':
        return <LearningPage onNavigate={navigate} />;
      case 'jobs':
        return <JobsPage onNavigate={navigate} />;
      case 'ai-helper':
        return <DashboardPage onNavigate={navigate} />;
      case 'progress':
        return <ProgressPage onNavigate={navigate} />;
      case 'settings':
        return <SettingsPage onNavigate={navigate} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      {renderPage()}

      {/* Global Overlays — only on dashboard pages */}
      {isDashboard && (
        <>
          <CommandPalette onNavigate={navigate} />
          <StudyTimer />
          <OnboardingTooltips />
        </>
      )}
    </div>
  );
}

export default App;
