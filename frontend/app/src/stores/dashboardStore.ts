import { create } from 'zustand';
import type { Skill, Course, Job, ChatMessage, Achievement, ProgressData, MarketSkill, Activity } from '@/types';

interface DashboardStore {
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

const defaultSkills: Skill[] = [
  { id: '1', name: 'System Design', category: 'Architecture', currentLevel: 'intermediate', requiredLevel: 'advanced', gap: 'medium' },
  { id: '2', name: 'API Security', category: 'Security', currentLevel: 'beginner', requiredLevel: 'intermediate', gap: 'medium' },
  { id: '3', name: 'SQL Optimization', category: 'Database', currentLevel: 'intermediate', requiredLevel: 'advanced', gap: 'medium' },
  { id: '4', name: 'Leadership', category: 'Soft Skills', currentLevel: 'beginner', requiredLevel: 'intermediate', gap: 'high' },
  { id: '5', name: 'React', category: 'Frontend', currentLevel: 'advanced', requiredLevel: 'advanced', gap: 'none' },
  { id: '6', name: 'TypeScript', category: 'Languages', currentLevel: 'advanced', requiredLevel: 'intermediate', gap: 'none' },
  { id: '7', name: 'Node.js', category: 'Backend', currentLevel: 'intermediate', requiredLevel: 'intermediate', gap: 'none' },
  { id: '8', name: 'Docker', category: 'DevOps', currentLevel: 'beginner', requiredLevel: 'intermediate', gap: 'high' },
];

const defaultSkillCategories = [
  { name: 'DSA', currentScore: 75, requiredScore: 90 },
  { name: 'System Design', currentScore: 60, requiredScore: 85 },
  { name: 'Frameworks', currentScore: 90, requiredScore: 80 },
  { name: 'Databases', currentScore: 65, requiredScore: 80 },
  { name: 'DevOps', currentScore: 45, requiredScore: 70 },
  { name: 'Soft Skills', currentScore: 55, requiredScore: 75 },
];

const defaultCourses: Course[] = [
  {
    id: '1',
    title: 'System Design Interviews',
    description: 'Master system design concepts for technical interviews. Learn to design scalable, reliable, and maintainable systems.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    channel: 'TechLead Academy',
    duration: '8 hours',
    skills: ['System Design', 'Scalability', 'Architecture'],
    complementarySkills: ['Cloud Computing', 'Microservices'],
    progress: 65,
    status: 'in_progress',
    checkpoints: [
      {
        id: '1',
        question: 'What is the primary purpose of load balancing?',
        options: ['To increase server storage', 'To distribute traffic across multiple servers', 'To reduce database queries', 'To improve CSS performance'],
        correctAnswer: 1,
        explanation: 'Load balancing distributes incoming network traffic across multiple servers to ensure no single server bears too much demand.',
      },
    ],
    modules: [
      {
        id: 'm1-1',
        title: 'Introduction to System Design',
        lessons: [
          { id: 'l1-1', title: 'What is System Design?', duration: '12:30', type: 'video', completed: true },
          { id: 'l1-2', title: 'Design Principles Overview', duration: '18:45', type: 'video', completed: true },
          { id: 'l1-3', title: 'Quiz: Core Concepts', duration: '5:00', type: 'quiz', completed: true },
        ],
      },
      {
        id: 'm1-2',
        title: 'Scalability & Load Balancing',
        lessons: [
          { id: 'l2-1', title: 'Horizontal vs Vertical Scaling', duration: '22:10', type: 'video', completed: true },
          { id: 'l2-2', title: 'Load Balancer Strategies', duration: '19:30', type: 'video', completed: true },
          { id: 'l2-3', title: 'CDN & Caching Layers', duration: '16:00', type: 'video', completed: false },
          { id: 'l2-4', title: 'Reading: CAP Theorem', duration: '8:00', type: 'reading', completed: false },
        ],
      },
      {
        id: 'm1-3',
        title: 'Database Design & Sharding',
        lessons: [
          { id: 'l3-1', title: 'SQL vs NoSQL Trade-offs', duration: '20:00', type: 'video', completed: false },
          { id: 'l3-2', title: 'Database Sharding Strategies', duration: '25:15', type: 'video', completed: false },
          { id: 'l3-3', title: 'Quiz: Database Design', duration: '5:00', type: 'quiz', completed: false },
        ],
      },
      {
        id: 'm1-4',
        title: 'Real-World Case Studies',
        lessons: [
          { id: 'l4-1', title: 'Design Twitter', duration: '35:00', type: 'video', completed: false },
          { id: 'l4-2', title: 'Design a URL Shortener', duration: '28:00', type: 'video', completed: false },
          { id: 'l4-3', title: 'Design Netflix', duration: '40:00', type: 'video', completed: false },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    description: 'Learn advanced React patterns including hooks, context, and performance optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    channel: 'React Masters',
    duration: '6 hours',
    skills: ['React', 'Hooks', 'Performance'],
    complementarySkills: ['TypeScript', 'Testing'],
    progress: 0,
    status: 'not_started',
    checkpoints: [],
    modules: [
      {
        id: 'm2-1',
        title: 'Getting Started',
        lessons: [
          { id: 'l5-1', title: 'Course Overview', duration: '5:00', type: 'video', completed: false },
          { id: 'l5-2', title: 'Environment Setup', duration: '10:00', type: 'video', completed: false },
        ],
      },
      {
        id: 'm2-2',
        title: 'Advanced Hooks',
        lessons: [
          { id: 'l6-1', title: 'useReducer Deep Dive', duration: '22:00', type: 'video', completed: false },
          { id: 'l6-2', title: 'Custom Hooks Patterns', duration: '28:00', type: 'video', completed: false },
          { id: 'l6-3', title: 'useSyncExternalStore', duration: '18:00', type: 'video', completed: false },
        ],
      },
      {
        id: 'm2-3',
        title: 'Performance Optimization',
        lessons: [
          { id: 'l7-1', title: 'React.memo & useMemo', duration: '20:00', type: 'video', completed: false },
          { id: 'l7-2', title: 'Code Splitting & Lazy Loading', duration: '15:00', type: 'video', completed: false },
          { id: 'l7-3', title: 'Quiz: Performance', duration: '5:00', type: 'quiz', completed: false },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Docker & Kubernetes Fundamentals',
    description: 'Containerization basics and orchestration with Kubernetes.',
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400',
    channel: 'DevOps Pro',
    duration: '10 hours',
    skills: ['Docker', 'Kubernetes', 'DevOps'],
    complementarySkills: ['CI/CD', 'Cloud'],
    progress: 30,
    status: 'in_progress',
    checkpoints: [],
    modules: [
      {
        id: 'm3-1',
        title: 'Docker Basics',
        lessons: [
          { id: 'l8-1', title: 'What is Docker?', duration: '10:00', type: 'video', completed: true },
          { id: 'l8-2', title: 'Dockerfile & Images', duration: '25:00', type: 'video', completed: true },
          { id: 'l8-3', title: 'Docker Compose', duration: '20:00', type: 'video', completed: false },
        ],
      },
      {
        id: 'm3-2',
        title: 'Kubernetes Fundamentals',
        lessons: [
          { id: 'l9-1', title: 'Kubernetes Architecture', duration: '30:00', type: 'video', completed: false },
          { id: 'l9-2', title: 'Pods, Services & Deployments', duration: '35:00', type: 'video', completed: false },
          { id: 'l9-3', title: 'Reading: K8s Best Practices', duration: '10:00', type: 'reading', completed: false },
        ],
      },
      {
        id: 'm3-3',
        title: 'Production Deployment',
        lessons: [
          { id: 'l10-1', title: 'CI/CD Pipelines', duration: '28:00', type: 'video', completed: false },
          { id: 'l10-2', title: 'Monitoring & Logging', duration: '22:00', type: 'video', completed: false },
          { id: 'l10-3', title: 'Quiz: DevOps Practices', duration: '5:00', type: 'quiz', completed: false },
        ],
      },
    ],
  },
];

const defaultJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Engineer',
    company: 'TechCorp',
    location: 'Remote',
    type: 'remote',
    description: 'We are looking for a skilled Frontend Engineer to join our team. You will be responsible for building scalable web applications using React and TypeScript.',
    fitScore: 92,
    matchedSkills: ['React', 'TypeScript', 'CSS'],
    missingSkills: ['GraphQL'],
    experienceLevel: '2-4 years',
    source: 'linkedin',
    saved: false,
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'DesignStudio',
    location: 'Bangalore',
    type: 'hybrid',
    description: 'Join our creative team as a Product Designer. Work on exciting products and collaborate with cross-functional teams.',
    fitScore: 88,
    matchedSkills: ['Figma', 'UI/UX', 'Prototyping'],
    missingSkills: ['Motion Design'],
    experienceLevel: '1-3 years',
    source: 'indeed',
    saved: true,
  },
  {
    id: '3',
    title: 'Data Analyst',
    company: 'DataDriven',
    location: 'Hyderabad',
    type: 'onsite',
    description: 'Analyze complex datasets and provide insights to drive business decisions.',
    fitScore: 85,
    matchedSkills: ['SQL', 'Python', 'Visualization'],
    missingSkills: ['Machine Learning'],
    experienceLevel: '0-2 years',
    source: 'glassdoor',
    saved: false,
  },
];

const defaultAchievements: Achievement[] = [
  { id: '1', name: 'First Course Complete', description: 'Completed your first learning module', icon: '🎓', dateEarned: new Date('2024-01-15'), locked: false },
  { id: '2', name: '7-Day Streak', description: 'Maintained a 7-day learning streak', icon: '🔥', dateEarned: new Date('2024-01-20'), locked: false },
  { id: '3', name: 'GitHub Connected', description: 'Linked your GitHub profile', icon: '🔗', dateEarned: new Date('2024-01-10'), locked: false },
  { id: '4', name: 'Job Applied', description: 'Applied to your first job through SkillMatrix', icon: '💼', dateEarned: new Date('2024-02-01'), locked: false },
  { id: '5', name: 'AI Chat Master', description: 'Asked 50 questions to the AI helper', icon: '🤖', locked: true },
  { id: '6', name: 'Top 10% Skill Score', description: 'Achieved top 10% skill score in your domain', icon: '🏆', locked: true },
  { id: '7', name: 'Profile Scrape Complete', description: 'Successfully analyzed your profiles', icon: '✅', dateEarned: new Date('2024-01-12'), locked: false },
  { id: '8', name: 'Voice Learning Pioneer', description: 'Used voice-guided learning for 10 sessions', icon: '🎙️', locked: true },
];

const defaultProgressData: ProgressData[] = [
  { week: 'Week 1', overallScore: 45, targetRoleMatch: 40 },
  { week: 'Week 2', overallScore: 52, targetRoleMatch: 48 },
  { week: 'Week 3', overallScore: 58, targetRoleMatch: 55 },
  { week: 'Week 4', overallScore: 65, targetRoleMatch: 62 },
  { week: 'Week 5', overallScore: 70, targetRoleMatch: 68 },
  { week: 'Week 6', overallScore: 75, targetRoleMatch: 73 },
  { week: 'Week 7', overallScore: 78, targetRoleMatch: 76 },
  { week: 'Week 8', overallScore: 82, targetRoleMatch: 80 },
  { week: 'Week 9', overallScore: 85, targetRoleMatch: 83 },
  { week: 'Week 10', overallScore: 88, targetRoleMatch: 86 },
  { week: 'Week 11', overallScore: 90, targetRoleMatch: 88 },
  { week: 'Week 12', overallScore: 92, targetRoleMatch: 90 },
];

const defaultMarketSkills: MarketSkill[] = [
  { name: 'React', demandScore: 95 },
  { name: 'TypeScript', demandScore: 90 },
  { name: 'Node.js', demandScore: 88 },
  { name: 'Python', demandScore: 92 },
  { name: 'AWS', demandScore: 85 },
  { name: 'Docker', demandScore: 80 },
  { name: 'Kubernetes', demandScore: 75 },
  { name: 'GraphQL', demandScore: 70 },
  { name: 'PostgreSQL', demandScore: 82 },
  { name: 'MongoDB', demandScore: 78 },
];

const defaultActivities: Activity[] = [
  { id: '1', course: 'System Design Interviews', action: 'Completed checkpoint', skillGained: 'Load Balancing', date: new Date('2024-02-25') },
  { id: '2', course: 'Advanced React Patterns', action: 'Started course', skillGained: 'React Hooks', date: new Date('2024-02-24') },
  { id: '3', course: 'Docker Fundamentals', action: 'Watched video', skillGained: 'Containerization', date: new Date('2024-02-23') },
  { id: '4', course: 'System Design Interviews', action: 'Watched video', skillGained: 'Caching Strategies', date: new Date('2024-02-22') },
];

export const useDashboardStore = create<DashboardStore>((set) => ({
  skills: defaultSkills,
  skillCategories: defaultSkillCategories,
  courses: defaultCourses,
  activeCourse: defaultCourses[0],
  jobs: defaultJobs,
  savedJobs: ['2'],
  chatMessages: [
    { id: '1', role: 'assistant', content: 'Hello! I\'m your AI learning assistant. How can I help you today?', timestamp: new Date() },
  ],
  isChatOpen: false,
  isSidebarCollapsed: false,
  achievements: defaultAchievements,
  progressData: defaultProgressData,
  marketSkills: defaultMarketSkills,
  activities: defaultActivities,

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
