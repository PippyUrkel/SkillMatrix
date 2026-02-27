import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout';
import { MatrixCard } from '@/components/ui/MatrixCard';
import { MatrixButton } from '@/components/ui/MatrixButton';
import { MatrixProgress } from '@/components/ui/MatrixProgress';
import { MatrixBadge } from '@/components/ui/MatrixBadge';
import { StreakToast } from '@/components/ui/StreakToast';
import { useDashboardStore, useUserStore } from '@/stores';
import { cn } from '@/lib/utils';
import {
  Info,
  CheckCircle,
  CheckSquare,
  FileText,
  Download,
  Clock,
  ChevronRight,
  PlayCircle,
  BookOpen,
  HelpCircle,
  Bot,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import { AIHelper } from '@/features/aihelper';
import confetti from 'canvas-confetti';

interface LearningPageProps {
  onNavigate: (path: string) => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ onNavigate }) => {
  const { courses, activeCourse, setActiveCourse, completeCourse, isChatOpen, setChatOpen, isSidebarCollapsed, toggleSidebar } = useDashboardStore();
  const { addXP, user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'checkpoints' | 'notes'>('overview');
  const [notes, setNotes] = useState('');
  const [notesMode, setNotesMode] = useState<'edit' | 'preview'>('edit');
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<string, number>>({});
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [focusMode, setFocusMode] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [showStreakToast, setShowStreakToast] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const prevSidebarState = useRef(isSidebarCollapsed);

  // Focus mode: collapse sidebar on enter, restore on exit
  const enterFocusMode = useCallback(() => {
    prevSidebarState.current = isSidebarCollapsed;
    if (!isSidebarCollapsed) toggleSidebar();
    if (isChatOpen) setChatOpen(false);
    setFocusMode(true);
  }, [isSidebarCollapsed, isChatOpen, toggleSidebar, setChatOpen]);

  const exitFocusMode = useCallback(() => {
    if (!prevSidebarState.current && isSidebarCollapsed) toggleSidebar();
    setFocusMode(false);
  }, [isSidebarCollapsed, toggleSidebar]);

  // Escape exits focus mode
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusMode) exitFocusMode();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [focusMode, exitFocusMode]);

  // Mini-player scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current && !focusMode) {
        const rect = videoRef.current.getBoundingClientRect();
        setShowMiniPlayer(rect.bottom < -50);
      }
    };
    const scrollContainer = document.querySelector('.custom-scrollbar');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [focusMode]);

  if (!activeCourse) return null;

  const currentCourse = activeCourse;

  const handleComplete = () => {
    completeCourse(currentCourse.id);
    addXP(150);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2EE9A8', '#00CC33', '#F2FFF8'],
    });
  };

  const handleCheckpointSubmit = (checkpointId: string, answerIndex: number) => {
    setCheckpointAnswers({
      ...checkpointAnswers,
      [checkpointId]: answerIndex,
    });
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const totalLessons = currentCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = currentCourse.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return PlayCircle;
      case 'quiz':
        return HelpCircle;
      case 'reading':
        return BookOpen;
      default:
        return PlayCircle;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'checkpoints', label: 'Checkpoints', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
  ];

  return (
    <DashboardLayout activeItem="learning" onNavigate={onNavigate} title="Learning Path">
      <div className="flex gap-6 h-[calc(100vh-130px)]">

        {/* ─── Left: Video + Tabs ─── */}
        <div className={cn(
          "flex flex-col gap-4 transition-all duration-300 min-w-0 overflow-y-auto custom-scrollbar",
          focusMode ? "flex-1" : isChatOpen ? "flex-[2]" : "flex-[3]"
        )}>
          {/* Video Player */}
          <MatrixCard className="flex-shrink-0 p-4" ref={videoRef}>
            <div className={cn(
              "bg-slate-900 rounded-xl overflow-hidden mb-4 relative group",
              focusMode ? "aspect-[21/9]" : "aspect-video"
            )}>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                </div>
              </div>
              <img src={currentCourse.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20" />
                  <span className="text-white text-sm font-medium">{currentCourse.channel}</span>
                </div>
                <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded text-white text-[10px] font-bold">1080p</div>
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{currentCourse.title}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {currentCourse.duration}
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="text-sm text-slate-500">{completedLessons}/{totalLessons} lessons</span>
                </div>
              </div>
              <div className="flex gap-2">
                <MatrixButton variant="secondary" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Resources
                </MatrixButton>
                {!focusMode && (
                  <MatrixButton
                    variant={isChatOpen ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setChatOpen(!isChatOpen)}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    AI Help
                  </MatrixButton>
                )}
                <MatrixButton
                  variant={focusMode ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={focusMode ? exitFocusMode : enterFocusMode}
                  title={focusMode ? 'Exit Focus Mode (Esc)' : 'Focus Mode'}
                >
                  {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </MatrixButton>
              </div>
            </div>
          </MatrixCard>

          {/* Tabs */}
          <MatrixCard className="min-h-[300px] flex flex-col overflow-hidden p-4">
            <div className="flex border-b border-slate-100 mb-4 flex-shrink-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'px-5 py-2.5 text-sm font-bold transition-all relative',
                    activeTab === tab.id
                      ? 'text-emerald-600'
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Description</h3>
                    <p className="text-slate-600 leading-relaxed">{currentCourse.description}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Skills you'll gain</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentCourse.skills.map((s) => (
                        <MatrixBadge key={s} variant="accent">{s}</MatrixBadge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'checkpoints' && (
                <div className="space-y-6">
                  {currentCourse.checkpoints.length > 0 ? (
                    currentCourse.checkpoints.map((checkpoint) => {
                      const answer = checkpointAnswers[checkpoint.id];
                      const isCorrect = answer === checkpoint.correctAnswer;

                      return (
                        <div key={checkpoint.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <h4 className="font-bold text-slate-900 mb-4">{checkpoint.question}</h4>
                          <div className="space-y-3">
                            {checkpoint.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleCheckpointSubmit(checkpoint.id, idx)}
                                className={cn(
                                  "w-full p-4 rounded-xl border text-sm font-medium transition-all text-left",
                                  answer === idx
                                    ? isCorrect
                                      ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                                      : "bg-red-50 border-red-400 text-red-700"
                                    : "bg-white border-slate-100 hover:border-emerald-200"
                                )}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                          {answer !== undefined && (
                            <div className={cn(
                              "mt-4 p-4 rounded-xl text-sm",
                              isCorrect ? "bg-emerald-100/50 text-emerald-700" : "bg-red-100/50 text-red-700"
                            )}>
                              <p className="font-bold mb-1">{isCorrect ? 'Correct!' : 'Not quite right'}</p>
                              {!isCorrect && (
                                <p className="text-slate-600">{checkpoint.explanation}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-400">No checkpoints available for this course yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      <button
                        onClick={() => setNotesMode('edit')}
                        className={cn(
                          "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                          notesMode === 'edit' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        Write
                      </button>
                      <button
                        onClick={() => setNotesMode('preview')}
                        className={cn(
                          "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                          notesMode === 'preview' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {notesMode === 'edit' ? (
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Take notes about this lesson..."
                      className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-900 focus:outline-none focus:border-emerald-400 resize-none font-medium text-sm leading-relaxed"
                    />
                  ) : (
                    <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-100 overflow-y-auto">
                      {notes ? (
                        <pre className="text-slate-700 whitespace-pre-wrap font-sans">{notes}</pre>
                      ) : (
                        <p className="text-slate-400 text-center py-8">No notes yet. Start typing in edit mode.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </MatrixCard>

          {/* Course Progress Bar */}
          <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl flex-shrink-0">
            <span className="text-slate-500 text-sm whitespace-nowrap">Progress</span>
            <MatrixProgress value={currentCourse.progress} className="flex-1" showLabel />
            <MatrixButton
              onClick={handleComplete}
              disabled={currentCourse.progress < 100}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete
            </MatrixButton>
          </div>
        </div>

        {/* ─── Right: Module Accordion (Udemy-style) — hidden in focus mode ─── */}
        {!focusMode && (
          <div className="w-[360px] flex-shrink-0 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Module header */}
            <div className="p-4 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-slate-900 text-sm">Course Content</h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentCourse.modules.length} sections · {totalLessons} lessons · {currentCourse.duration}
              </p>
            </div>

            {/* Module list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {currentCourse.modules.map((module) => {
                const isExpanded = expandedModules[module.id] ?? false;
                const moduleCompleted = module.lessons.filter((l) => l.completed).length;
                const moduleTotal = module.lessons.length;

                return (
                  <div key={module.id} className="border-b border-slate-100 last:border-b-0">
                    {/* Module header (accordion trigger) */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          "transition-transform duration-200",
                          isExpanded && "rotate-90"
                        )}>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">{module.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {moduleCompleted}/{moduleTotal} completed
                          </p>
                        </div>
                      </div>
                      {moduleCompleted === moduleTotal && moduleTotal > 0 && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      )}
                    </button>

                    {/* Expanded lessons */}
                    {isExpanded && (
                      <div className="bg-slate-50/50">
                        {module.lessons.map((lesson) => {
                          const LessonIcon = getLessonIcon(lesson.type);
                          return (
                            <div
                              key={lesson.id}
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 pl-11 hover:bg-slate-100/60 transition-colors cursor-pointer border-t border-slate-100/60",
                                lesson.completed && "opacity-60"
                              )}
                            >
                              {/* Completion checkbox */}
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                lesson.completed
                                  ? "bg-emerald-500 border-emerald-500"
                                  : "border-slate-300"
                              )}>
                                {lesson.completed && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>

                              {/* Lesson icon */}
                              <LessonIcon className={cn(
                                "w-4 h-4 flex-shrink-0",
                                lesson.completed ? "text-slate-400" : "text-slate-500"
                              )} />

                              {/* Lesson info */}
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "text-xs font-medium truncate",
                                  lesson.completed ? "text-slate-400 line-through" : "text-slate-700"
                                )}>
                                  {lesson.title}
                                </p>
                              </div>

                              {/* Duration */}
                              <span className="text-[10px] text-slate-400 flex-shrink-0">{lesson.duration}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Other courses in path */}
            <div className="border-t border-slate-100 p-4 flex-shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Other courses</p>
              <div className="space-y-2">
                {courses.filter((c) => c.id !== currentCourse.id).map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setActiveCourse(course)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <img src={course.thumbnail} alt="" className="w-10 h-7 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700 truncate">{course.title}</p>
                      <p className="text-[10px] text-slate-400">{course.duration}</p>
                    </div>
                    {course.status === 'completed' && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Far Right: Collapsible AI Assistant ─── */}
        {isChatOpen && !focusMode && (
          <div className="w-[340px] flex-shrink-0 border border-slate-200 rounded-2xl bg-white shadow-lg flex flex-col overflow-hidden transition-all duration-300">
            <AIHelper variant="panel" />
          </div>
        )}
      </div>

      {/* ─── Sticky Mini-Player (PiP) ─── */}
      {showMiniPlayer && !focusMode && (
        <div className="fixed bottom-6 right-6 z-50 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="relative">
            <img src={currentCourse.thumbnail} alt="" className="w-full h-20 object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
              <PlayCircle className="w-8 h-8 text-white/80" />
            </div>
            <button
              onClick={() => setShowMiniPlayer(false)}
              className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="p-3">
            <p className="text-xs font-semibold text-slate-900 truncate">{currentCourse.title}</p>
            <div className="mt-2">
              <MatrixProgress value={currentCourse.progress} className="h-1" />
            </div>
          </div>
        </div>
      )}

      {/* ─── Streak Toast ─── */}
      <StreakToast
        streak={user?.streak || 1}
        visible={showStreakToast}
        onDismiss={() => setShowStreakToast(false)}
      />
    </DashboardLayout>
  );
};

export default LearningPage;
