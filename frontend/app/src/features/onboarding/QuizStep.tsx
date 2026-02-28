import React, { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/stores';
import { MatrixProgress } from '@/components/ui/MatrixProgress';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';



export const QuizStep: React.FC = () => {
  const {
    selectedPath,
    assessmentAnswers,
    setAssessmentAnswer,
    setAssessmentComplete,
    assessmentComplete,
    dynamicQuiz,
    isQuizLoading,
    fetchDynamicQuiz
  } = useOnboardingStore();

  const [showResults, setShowResults] = useState<Record<number, boolean>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    if (dynamicQuiz.length === 0 && selectedPath && !isQuizLoading) {
      fetchDynamicQuiz(selectedPath);
    }
  }, [selectedPath, dynamicQuiz.length, isQuizLoading, fetchDynamicQuiz]);

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setAssessmentAnswer(questionIndex, answerIndex);
    setShowResults({ ...showResults, [questionIndex]: true });

    // Check if all questions are answered
    const newAnswers = [...assessmentAnswers];
    newAnswers[questionIndex] = answerIndex;

    // We compare with dynamicQuiz.length
    if (newAnswers.filter(a => a !== undefined).length === dynamicQuiz.length) {
      setAssessmentComplete(true);
    }

    // Auto-advance after a short delay
    if (currentQuestion < dynamicQuiz.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 1500);
    }
  };

  if (isQuizLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-black border-t-brutal-yellow rounded-full animate-spin"></div>
        <h3 className="text-xl font-black text-black">Generating your custom assessment...</h3>
        <p className="text-black/60 font-medium text-center max-w-sm">
          AI is creating a skill check tailored specifically to your chosen career path.
        </p>
      </div>
    );
  }

  if (dynamicQuiz.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-black/60">Something went wrong. Please go back and re-select your path.</p>
      </div>
    );
  }

  const progress = ((assessmentAnswers.filter(a => a !== undefined).length) / dynamicQuiz.length) * 100;
  const score = assessmentAnswers.reduce((acc, answerIndex, idx) => {
    if (answerIndex === undefined) return acc;
    const answeredText = dynamicQuiz[idx].options[answerIndex];
    return acc + (answeredText === dynamicQuiz[idx].correct_answer ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Knowledge Assessment</h2>
        <p className="text-slate-500">
          Answer these questions so we can tailor your learning experience
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">
        <MatrixProgress value={progress} className="flex-1" />
        <span className="text-sm text-slate-500 whitespace-nowrap">
          {assessmentAnswers.filter(a => a !== undefined).length} / {dynamicQuiz.length}
        </span>
      </div>

      {/* Score Display (when complete) */}
      {assessmentComplete && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-none text-center">
          <p className="text-emerald-700 font-medium">
            Quiz Complete! You scored {score}/{dynamicQuiz.length}
          </p>
          <p className="text-emerald-600 text-sm mt-1">
            We'll use this to create your personalized course
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {dynamicQuiz.map((question, qIndex) => {
          const hasAnswered = assessmentAnswers[qIndex] !== undefined;
          const answeredIndex = assessmentAnswers[qIndex];
          const answeredText = hasAnswered ? question.options[answeredIndex] : null;
          const isCorrect = hasAnswered && answeredText === question.correct_answer;
          const showResult = showResults[qIndex];
          const isCurrent = qIndex === currentQuestion;

          return (
            <div
              key={question.id || qIndex}
              className={cn(
                'p-5 rounded-none border transition-all',
                isCurrent || hasAnswered
                  ? 'border-slate-200 bg-white'
                  : 'border-slate-100 bg-slate-50 opacity-60'
              )}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-none flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {qIndex + 1}
                </span>
                <h3 className="font-medium text-slate-900">{question.question}</h3>
              </div>

              <div className="space-y-2 ml-10">
                {question.options.map((option: string, optIndex: number) => {
                  const isThisOptionCorrect = option === question.correct_answer;
                  const isThisOptionSelected = answeredIndex === optIndex;

                  return (
                    <button
                      key={optIndex}
                      onClick={() => !hasAnswered && handleAnswer(qIndex, optIndex)}
                      disabled={hasAnswered}
                      className={cn(
                        'w-full p-3 rounded-none text-left text-sm transition-all border',
                        showResult && isThisOptionCorrect
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : showResult && isThisOptionSelected && !isCorrect
                            ? 'bg-red-50 border-red-400 text-red-700'
                            : hasAnswered
                              ? 'bg-slate-50 border-slate-200 text-slate-400'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {showResult && isThisOptionCorrect && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                        {showResult && isThisOptionSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showResult && (
                <div className={cn(
                  'mt-3 ml-10 p-3 rounded-none text-sm',
                  isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                )}>
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>{question.explanation || "No explanation provided."}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
