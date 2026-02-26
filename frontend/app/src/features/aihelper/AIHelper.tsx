import React, { useState, useRef, useEffect } from 'react';
import { useDashboardStore } from '@/stores';
import { MatrixButton } from '@/components/ui/MatrixButton';
import { cn } from '@/lib/utils';
import { Bot, X, Send, Mic, Sparkles } from 'lucide-react';

export const AIHelper: React.FC = () => {
  const { chatMessages, addChatMessage, isChatOpen, setChatOpen } = useDashboardStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Explain this concept',
    'Quiz me on this topic',
    'Give me an example',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: generateResponse(input),
        timestamp: new Date(),
      };
      addChatMessage(aiResponse);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('explain')) {
      return 'Let me break this down for you. The key concept here is about understanding how components work together in a system. Would you like me to go deeper into any specific part?';
    }
    if (lowerQuery.includes('quiz')) {
      return 'Great idea! Here\'s a quick question: What is the primary purpose of load balancing in system design?';
    }
    if (lowerQuery.includes('example')) {
      return 'Here\'s a real-world example: Imagine you\'re building a shopping website. When Black Friday hits, load balancers distribute traffic across multiple servers so no single server crashes.';
    }
    return 'I\'m here to help with your learning! Feel free to ask about any concept, request examples, or ask for a quiz to test your knowledge.';
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  if (!isChatOpen) {
    return (
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => setChatOpen(true)}
          className="bg-emerald-500 text-white px-3 py-6 rounded-l-2xl shadow-xl flex flex-col items-center gap-2 hover:bg-emerald-600 transition-all hover:pr-4 group"
        >
          <Bot className="w-5 h-5" />
          <span className="[writing-mode:vertical-lr] rotate-180 text-xs font-bold uppercase tracking-widest">
            AI Helper
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm pointer-events-auto"
        onClick={() => setChatOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute right-0 top-0 h-full w-[400px] bg-white shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-lg">SkillMatrix AI</h4>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-slate-500 text-xs font-medium">Assistant Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-4',
                message.role === 'user' && 'justify-end'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed',
                  message.role === 'assistant'
                    ? 'bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100'
                    : 'bg-emerald-500 text-white rounded-tr-none shadow-md shadow-emerald-100'
                )}
              >
                <p className="font-medium whitespace-pre-wrap">{message.content}</p>
                <p className={cn(
                  'text-[10px] mt-2 font-bold uppercase tracking-wider',
                  message.role === 'assistant' ? 'text-slate-400' : 'text-emerald-100'
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-[10px] font-black italic">YOU</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {chatMessages.length < 3 && (
          <div className="px-6 py-4 flex flex-wrap gap-2 bg-white border-t border-slate-100">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className={cn(
                  'w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 pr-12 rounded-2xl text-sm font-medium',
                  'focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all',
                  isListening && 'border-emerald-500 ring-4 ring-emerald-500/10'
                )}
              />
              <button
                onClick={startVoiceInput}
                className={cn(
                  'absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all',
                  isListening ? 'bg-emerald-100 text-emerald-600 scale-110' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <MatrixButton
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-5 py-3.5 rounded-2xl"
            >
              <Send className="w-5 h-5" />
            </MatrixButton>
          </div>
          <p className="mt-3 text-center text-[10px] text-slate-400 font-medium">
            AI provides context and logic hints only. No direct solutions.
          </p>
        </div>
      </div>
    </div>
  );
};
