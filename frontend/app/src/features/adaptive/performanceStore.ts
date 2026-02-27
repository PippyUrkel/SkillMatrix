/**
 * Performance Signal Store — RAM-Only
 *
 * Tracks transient learning signals per session.
 * Data is NEVER persisted to disk or localStorage.
 * Signals are reset on page reload by design (Federated Learning privacy).
 */
import { create } from 'zustand';

// ── Signal Types ────────────────────────────────────

export interface PerformanceSignals {
    quiz_score: number;             // 0.0 - 1.0  (latest quiz result)
    time_per_question: number;      // avg seconds per question
    attempt_count: number;          // total quiz attempts this session
    confidence_score: number;       // 0.0 - 1.0  (user self-report or inferred)
    skill_mastery_delta: number;    // change in mastery since session start
    drop_off_rate: number;          // 0.0 - 1.0  (fraction of modules abandoned)
    module_completion_time: number; // avg minutes to finish a module
    revision_frequency: number;     // how often user revisits completed content
}

export interface PerformanceState {
    signals: PerformanceSignals;
    sampleCount: number;            // how many signal updates we've collected

    // Actions
    recordQuizResult: (score: number, timePerQuestion: number) => void;
    recordModuleCompletion: (completionMinutes: number) => void;
    recordConfidence: (score: number) => void;
    recordDropOff: () => void;
    recordRevision: () => void;
    updateMasteryDelta: (delta: number) => void;
    getSignalVector: () => number[];
    reset: () => void;
}

// ── Default (zeroed) signals ────────────────────────

const DEFAULT_SIGNALS: PerformanceSignals = {
    quiz_score: 0,
    time_per_question: 0,
    attempt_count: 0,
    confidence_score: 0.5,
    skill_mastery_delta: 0,
    drop_off_rate: 0,
    module_completion_time: 0,
    revision_frequency: 0,
};

// ── Store (RAM-only, no persist middleware) ──────────

export const usePerformanceStore = create<PerformanceState>((set, get) => ({
    signals: { ...DEFAULT_SIGNALS },
    sampleCount: 0,

    recordQuizResult: (score: number, timePerQuestion: number) => {
        set((state) => {
            const s = state.signals;
            const n = s.attempt_count + 1;
            return {
                signals: {
                    ...s,
                    quiz_score: score,
                    time_per_question:
                        (s.time_per_question * s.attempt_count + timePerQuestion) / n,
                    attempt_count: n,
                },
                sampleCount: state.sampleCount + 1,
            };
        });
    },

    recordModuleCompletion: (completionMinutes: number) => {
        set((state) => {
            const s = state.signals;
            const prev = s.module_completion_time;
            const count = state.sampleCount || 1;
            return {
                signals: {
                    ...s,
                    module_completion_time:
                        prev === 0 ? completionMinutes : (prev * (count - 1) + completionMinutes) / count,
                },
                sampleCount: state.sampleCount + 1,
            };
        });
    },

    recordConfidence: (score: number) => {
        set((state) => ({
            signals: { ...state.signals, confidence_score: Math.max(0, Math.min(1, score)) },
        }));
    },

    recordDropOff: () => {
        set((state) => {
            const total = state.signals.attempt_count + 1;
            return {
                signals: {
                    ...state.signals,
                    drop_off_rate: Math.min(1, state.signals.drop_off_rate + 1 / total),
                },
            };
        });
    },

    recordRevision: () => {
        set((state) => ({
            signals: {
                ...state.signals,
                revision_frequency: state.signals.revision_frequency + 1,
            },
        }));
    },

    updateMasteryDelta: (delta: number) => {
        set((state) => ({
            signals: { ...state.signals, skill_mastery_delta: delta },
        }));
    },

    /**
     * Convert signals to a normalized float vector for the neural network.
     * Order matches AdaptiveBrain input layer.
     */
    getSignalVector: () => {
        const s = get().signals;
        return [
            s.quiz_score,                          // already 0-1
            Math.min(s.time_per_question / 120, 1), // normalize to 0-1 (120s cap)
            Math.min(s.attempt_count / 10, 1),      // normalize to 0-1 (10 cap)
            s.confidence_score,                     // already 0-1
            Math.max(-1, Math.min(1, s.skill_mastery_delta)), // clamp -1 to 1
            s.drop_off_rate,                        // already 0-1
        ];
    },

    reset: () => {
        set({ signals: { ...DEFAULT_SIGNALS }, sampleCount: 0 });
    },
}));
