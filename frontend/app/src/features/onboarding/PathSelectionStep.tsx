import React, { useMemo, useEffect } from 'react';
import { useOnboardingStore } from '@/stores';
import { cn } from '@/lib/utils';
import { Clock, BookOpen, Code, Database, Server, Shield, Smartphone, TrendingUp, Sparkles, Layout, Activity } from 'lucide-react';
import type { RiasecScores } from '@/types';

// Map string icons from backend to actual Lucide components
const IconMap: Record<string, React.ElementType> = {
  Code,
  Server,
  Database,
  Shield,
  Smartphone,
  TrendingUp,
  Layout,
  Activity,
  BookOpen
};

/**
 * Calculate how well a career path matches the user's RIASEC interest profile.
 * Returns 0-100 where 100 = perfect match.
 */
function calculateInterestMatch(path: any, scores: RiasecScores): number {
  if (!path.riasec || path.riasec.length === 0) return 50;
  const total = path.riasec.reduce((sum: number, key: string) => sum + ((scores as any)[key] || 0), 0);
  return Math.round(total / path.riasec.length);
}

export const PathSelectionStep: React.FC = () => {
  const { selectedPath, setSelectedPath, riasecScores, dynamicPaths, isPathsLoading, fetchDynamicPaths } = useOnboardingStore();

  useEffect(() => {
    fetchDynamicPaths();
  }, []);

  // Sort paths by interest match if RIASEC scores exist
  const sortedPaths = useMemo(() => {
    if (!riasecScores) return dynamicPaths;
    return [...dynamicPaths].sort(
      (a, b) => calculateInterestMatch(b, riasecScores) - calculateInterestMatch(a, riasecScores)
    );
  }, [riasecScores, dynamicPaths]);

  if (isPathsLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-black border-t-brutal-yellow rounded-full animate-spin"></div>
        <h3 className="text-xl font-black text-black">AI is analyzing your profile...</h3>
        <p className="text-black/60 font-medium text-center max-w-sm">
          We are evaluating your current skills and interests to generate personalized career paths just for you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-black uppercase mb-2">Choose Your Path</h2>
        <p className="text-black/60 font-medium">
          Select a career path that aligns with your goals.{' '}
          {riasecScores && <span className="text-brutal-purple font-bold">Sorted by your interest profile!</span>}
        </p>
      </div>

      {/* Path Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedPaths.map((path) => {
          const isSelected = selectedPath === path.id;
          const Icon = IconMap[path.icon as string] || Code;
          const match = riasecScores ? calculateInterestMatch(path, riasecScores) : null;

          return (
            <div
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              className={cn(
                'relative p-5 border-2 border-black cursor-pointer transition-all',
                isSelected
                  ? 'bg-brutal-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn('w-12 h-12 flex items-center justify-center flex-shrink-0 border-2 border-black', path.color)}>
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-black">{path.title}</h3>
                    <span className={cn(
                      'text-xs px-2 py-0.5 border border-black font-bold uppercase',
                      path.difficulty === 'beginner' && 'bg-green-100 text-green-800',
                      path.difficulty === 'intermediate' && 'bg-yellow-100 text-yellow-800',
                      path.difficulty === 'advanced' && 'bg-red-100 text-red-800',
                    )}>
                      {path.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-black/60 mb-3 line-clamp-2 font-medium">{path.description}</p>

                  <div className="flex items-center gap-4 text-sm text-black/50 font-bold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {path.courses} courses
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {path.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 bg-black/5 text-black/70 border border-black/20 font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interest Match Badge */}
              {match !== null && (
                <div className={cn(
                  'absolute top-3 right-3 px-2 py-1 border-2 border-black text-xs font-black flex items-center gap-1',
                  match >= 70 ? 'bg-brutal-yellow' : match >= 40 ? 'bg-brutal-blue/40' : 'bg-gray-100'
                )}>
                  <Sparkles className="w-3 h-3" />
                  {match}% match
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute bottom-3 right-3 w-6 h-6 bg-black flex items-center justify-center">
                  <svg className="w-4 h-4 text-brutal-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-3 p-4 bg-brutal-yellow/20 border-2 border-black">
        <div className="w-5 h-5 bg-brutal-yellow border border-black flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-black text-xs font-black">!</span>
        </div>
        <p className="text-sm text-black/70 font-medium">
          After selecting a path, you'll take a short quiz to assess your current knowledge.
          This helps us create a personalized course just for you.
        </p>
      </div>
    </div>
  );
};
