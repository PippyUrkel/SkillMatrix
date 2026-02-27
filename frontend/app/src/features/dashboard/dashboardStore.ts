import { create } from 'zustand';
import type { Skill, Course, Job, ChatMessage, Achievement, ProgressData, MarketSkill, Activity } from '@/types';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';

interface DashboardStore {
  // Loading States
  isLoadingSkills: boolean;
  isLoadingCurriculum: boolean;
  isLoadingChat: boolean;

  // Skills
  skills: Skill[];
  skillCategories: { name: string; currentScore: number; requiredScore: number }[];

  // Courses
  courses: Course[];
  activeCourse: Course | null;

  // Jobs
  jobs: Job[];
  savedJobs: string[];

  // AI Helper
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  isSidebarCollapsed: boolean;

  // Achievements
  achievements: Achievement[];

  // Progress
  progressData: ProgressData[];

  // Market Data
  marketSkills: MarketSkill[];

  // Activities
  activities: Activity[];

  // Actions
  fetchSkills: () => Promise<void>;
  evaluateGaps: (targetRole: string) => Promise<void>;
  generateCurriculum: (topic: string, constraints: any) => Promise<void>;
  sendChatMessage: (content: string) => Promise<void>;
  setActiveCourse: (course: Course | null) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  completeCourse: (courseId: string) => void;
  saveJob: (jobId: string) => void;
  unsaveJob: (jobId: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial State
  isLoadingSkills: false,
  isLoadingCurriculum: false,
  isLoadingChat: false,
  skills: [],
  skillCategories: [],
  courses: [],
  activeCourse: null,
  jobs: [],
  savedJobs: [],
  chatMessages: [
    { id: '1', role: 'assistant', content: "Hello! I'm your AI learning assistant. How can I help you today?", timestamp: new Date() },
  ],
  isChatOpen: false,
  isSidebarCollapsed: false,
  achievements: [],
  progressData: [],
  marketSkills: [],
  activities: [],

  // Actions
  fetchSkills: async () => {
    set({ isLoadingSkills: true });
    try {
      const response = await api.get<any>('/api/profile/');
      const mappedSkills: Skill[] = response.skills.map((s: any) => ({
        id: s.id,
        name: s.skill_name,
        category: 'Technical',
        currentLevel: s.proficiency_level || 'beginner',
        requiredLevel: 'intermediate',
        gap: 'none',
      }));
      set({ skills: mappedSkills, isLoadingSkills: false });
    } catch (error) {
      set({ isLoadingSkills: false });
      console.error('Failed to fetch skills:', error);
    }
  },

  evaluateGaps: async (targetRole: string) => {
    set({ isLoadingSkills: true });
    try {
      const response = await api.post<any>('/api/skills/evaluate', {
        target_job: targetRole,
        user_skills: get().skills.map(s => s.name),
      });

      // Backend returns: { target_job, strong_subskills: [], weak_subskills: [], recommended_courses: [] }
      const evaluatedSkills: Skill[] = [
        ...(response.strong_subskills || []).map((s: string) => ({
          id: Math.random().toString(),
          name: s,
          category: 'Strong',
          currentLevel: 'advanced' as const,
          requiredLevel: 'advanced' as const,
          gap: 'none' as const,
        })),
        ...(response.weak_subskills || []).map((s: string) => ({
          id: Math.random().toString(),
          name: s,
          category: 'Growth',
          currentLevel: 'beginner' as const,
          requiredLevel: 'intermediate' as const,
          gap: 'high' as const,
        })),
      ];

      // Build skill categories for the radar chart
      const categories = [
        { name: 'Strong Skills', currentScore: (response.strong_subskills || []).length * 20, requiredScore: 100 },
        { name: 'Growth Areas', currentScore: 20, requiredScore: (response.weak_subskills || []).length * 20 },
      ];

      // Synthesize job recommendations from skill data
      const strongList = response.strong_subskills || [];
      const weakList = response.weak_subskills || [];
      const allSkillNames = [...strongList, ...weakList];

      const jobTemplates = [
        { title: `${targetRole}`, company: 'Tech Corp', location: 'Remote', type: 'remote' as const },
        { title: `Junior ${targetRole}`, company: 'StartupHub', location: 'San Francisco, CA', type: 'hybrid' as const },
        { title: `Senior ${targetRole}`, company: 'Enterprise Ltd', location: 'New York, NY', type: 'onsite' as const },
        { title: `${targetRole} Lead`, company: 'InnovateTech', location: 'Austin, TX', type: 'remote' as const },
        { title: `${targetRole} Intern`, company: 'GrowthCo', location: 'Remote', type: 'remote' as const },
      ];

      const synthesizedJobs: Job[] = jobTemplates.map((tmpl, i) => {
        const fitScore = Math.max(40, Math.min(98, 60 + strongList.length * 5 - weakList.length * 3 - i * 5));
        return {
          id: `synth-job-${i}`,
          title: tmpl.title,
          company: tmpl.company,
          location: tmpl.location,
          type: tmpl.type,
          description: `Looking for a skilled ${targetRole} with experience in ${allSkillNames.slice(0, 3).join(', ')}. This role offers growth opportunities and competitive compensation.`,
          fitScore,
          matchedSkills: strongList.slice(0, Math.min(4, strongList.length)),
          missingSkills: weakList.slice(0, Math.min(3, weakList.length)),
          experienceLevel: i <= 1 ? 'Junior' : i === 2 ? 'Senior' : 'Mid',
          source: (['linkedin', 'indeed', 'glassdoor'] as const)[i % 3],
          saved: false,
        };
      });

      set({ skills: evaluatedSkills, skillCategories: categories, jobs: synthesizedJobs, isLoadingSkills: false });
    } catch (error) {
      set({ isLoadingSkills: false });
      console.error('Failed to evaluate gaps:', error);
    }
  },

  generateCurriculum: async (topic: string, constraints: any) => {
    set({ isLoadingCurriculum: true });
    try {
      const user = useUserStore.getState().user;

      // ── FL Integration: Predict learning pace ──────────
      let paceAdjustment = 1.0;
      let brain: InstanceType<typeof import('@/features/adaptive/AdaptiveBrain').AdaptiveBrain> | null = null;

      try {
        const { AdaptiveBrain } = await import('@/features/adaptive/AdaptiveBrain');
        const { usePerformanceStore } = await import('@/features/adaptive/performanceStore');
        const signals = usePerformanceStore.getState().getSignalVector();

        // Fetch global weights from FL server
        try {
          const globalModel = await api.get<any>('/api/fl/model');
          brain = new AdaptiveBrain(globalModel.weights);
        } catch {
          // FL server unavailable — use default weights
          brain = new AdaptiveBrain();
        }

        const prediction = brain.predict(signals);
        paceAdjustment = prediction.pace_factor;
        console.log(`[FL] Pace prediction: ${paceAdjustment} (${prediction.recommendation})`);
      } catch (e) {
        // Graceful degradation — proceed with default pace
        console.warn('[FL] AdaptiveBrain unavailable, using default pace:', e);
      }
      // ── End FL Integration ─────────────────────────────

      const response = await api.post<any>('/api/curriculum/generate', {
        course_topic: topic,
        user_profile: {
          current_level: user?.level ? (user.level > 5 ? 'advanced' : 'beginner') : 'beginner',
          weak_subskills: get().skills.filter(s => s.gap === 'high').map(s => s.name),
          strong_subskills: get().skills.filter(s => s.gap === 'none').map(s => s.name),
        },
        constraints: {
          target_course_duration_days: constraints.durationDays || 7,
          daily_time_minutes: constraints.dailyMinutes || 60,
        },
        pace_adjustment: paceAdjustment,
      });

      const mappedCourse: Course = {
        id: Math.random().toString(),
        title: response.course_title,
        description: `Custom path for ${topic}`,
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
        channel: 'SkillMatrix AI',
        duration: `${response.estimated_completion_days} days`,
        skills: [topic],
        complementarySkills: [],
        progress: 0,
        status: 'not_started',
        checkpoints: [],
        modules: response.modules.map((m: any) => ({
          id: `m-${m.module_number}`,
          title: m.module_title,
          lessons: m.videos.map((v: any, vIdx: number) => ({
            id: `l-${m.module_number}-${vIdx}`,
            title: v.title,
            duration: `${v.duration_minutes}m`,
            type: 'video',
            completed: false,
            url: v.youtube_url,
          })),
        })),
      };

      set((state) => ({
        courses: [mappedCourse, ...state.courses],
        activeCourse: mappedCourse,
        isLoadingCurriculum: false,
      }));

      // Save course skills to the backend profile
      try {
        await api.post('/api/profile/skills', { skill_name: topic, proficiency_level: 'beginner' });
      } catch {
        // Non-critical — course is still usable even if save fails
      }

      // ── FL Integration: Submit weight deltas ──────────
      if (brain) {
        try {
          const { usePerformanceStore } = await import('@/features/adaptive/performanceStore');
          const sampleCount = usePerformanceStore.getState().sampleCount;
          if (sampleCount > 0) {
            const delta = brain.getWeightDelta();
            await api.post('/api/fl/updates', {
              delta,
              sample_count: sampleCount,
            });
            console.log('[FL] Weight update submitted successfully');
          }
        } catch (e) {
          console.warn('[FL] Failed to submit weight update:', e);
        }
      }
      // ── End FL Integration ─────────────────────────────
    } catch (error) {
      set({ isLoadingCurriculum: false });
      console.error('Failed to generate curriculum:', error);
    }
  },

  sendChatMessage: async (content: string) => {
    const newMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    set((state) => ({ chatMessages: [...state.chatMessages, newMessage], isLoadingChat: true }));

    try {
      // Use the text analysis endpoint as a chat proxy
      const report = await api.post<any>('/api/skills/analyze/text', {
        profile_text: content,
        source: 'chat',
        target_role: useUserStore.getState().user?.targetRole || 'Software Developer',
      });

      // Build a meaningful reply from the SkillGapReport
      let replyContent = '';
      if (report.all_skills && report.all_skills.length > 0) {
        const strongList = (report.strong_subskills || []).join(', ');
        const weakList = (report.weak_subskills || []).join(', ');
        replyContent = `Based on your input, here's what I found:\n\n`;
        replyContent += `**Level:** ${report.current_level || 'N/A'}\n`;
        if (strongList) replyContent += `**Strong:** ${strongList}\n`;
        if (weakList) replyContent += `**Needs work:** ${weakList}\n`;
        replyContent += `\nI recommend focusing on your growth areas. Would you like me to generate a curriculum for any of these?`;
      } else {
        replyContent = `I've analyzed your request. Based on your current profile, I recommend reviewing your skill gaps on the dashboard and generating a targeted learning path.`;
      }

      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date(),
      };
      set((state) => ({ chatMessages: [...state.chatMessages, reply], isLoadingChat: false }));
    } catch (error) {
      const errorReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble processing that. Please try again or check your connection.',
        timestamp: new Date(),
      };
      set((state) => ({ chatMessages: [...state.chatMessages, errorReply], isLoadingChat: false }));
    }
  },

  setActiveCourse: (course) => set({ activeCourse: course }),

  updateCourseProgress: (courseId, progress) =>
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId ? { ...c, progress } : c
      ),
    })),

  completeCourse: (courseId) =>
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId ? { ...c, status: 'completed' as const, progress: 100 } : c
      ),
    })),

  saveJob: (jobId) =>
    set((state) => ({
      savedJobs: [...state.savedJobs, jobId],
      jobs: state.jobs.map((j) =>
        j.id === jobId ? { ...j, saved: true } : j
      ),
    })),

  unsaveJob: (jobId) =>
    set((state) => ({
      savedJobs: state.savedJobs.filter((id) => id !== jobId),
      jobs: state.jobs.map((j) =>
        j.id === jobId ? { ...j, saved: false } : j
      ),
    })),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  toggleChat: () => set((state) => ({
    isChatOpen: !state.isChatOpen,
    ...(!state.isChatOpen ? { isSidebarCollapsed: true } : {}),
  })),

  setChatOpen: (open) => set({ isChatOpen: open, ...(open ? { isSidebarCollapsed: true } : {}) }),

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
