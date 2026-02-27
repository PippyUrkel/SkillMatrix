import React, { useState, useRef, useEffect } from 'react';
import { useDashboardStore } from '@/stores';
import { MatrixButton } from '@/components/ui/MatrixButton';
import { cn } from '@/lib/utils';
import { Bot, X, Send, Mic, Sparkles, PhoneOff } from 'lucide-react';
import { Conversation } from '@elevenlabs/client';

interface AIHelperProps {
  variant?: 'floating' | 'panel';
}

export const AIHelper: React.FC<AIHelperProps> = ({ variant = 'floating' }) => {
  const { chatMessages, sendChatMessage, addChatMessage, isChatOpen, setChatOpen, isLoadingChat, activeVideoUrl } = useDashboardStore();
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const conversationInstance = useRef<any>(null);
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
    sendChatMessage(input);
    setInput('');
  };

  const startVoiceInput = async () => {
    if (isConnected || isConnecting) {
      if (conversationInstance.current) {
        await conversationInstance.current.endSession();
      }
      setIsConnected(false);
      setIsAgentSpeaking(false);
      setIsConnecting(false);
      return;
    }

    try {
      setIsConnecting(true);
      await navigator.mediaDevices.getUserMedia({ audio: true });

      let transcriptContext = "";
      if (activeVideoUrl) {
        try {
          const res = await fetch(`http://localhost:8000/api/curriculum/transcript?youtube_url=${encodeURIComponent(activeVideoUrl)}`);
          if (res.ok) {
            const data = await res.json();
            transcriptContext = data.transcript;
          }
        } catch (err) {
          console.error("Failed to fetch transcript", err);
        }
      }

      conversationInstance.current = await Conversation.startSession({
        agentId: 'agent_7301kjg96r6ee229kjh53b62hrej',
        connectionType: 'webrtc',
        dynamicVariables: {
          youtube_transcript: transcriptContext || "No video context available.",
        },
        onConnect: () => {
          setIsConnected(true);
          setIsConnecting(false);
          addChatMessage({
            id: Date.now().toString(),
            role: 'assistant',
            content: transcriptContext ? 'Voice connection established with video context. Start speaking...' : 'Voice connection established. Start speaking...',
            timestamp: new Date()
          });
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsAgentSpeaking(false);
          setIsConnecting(false);
        },
        onMessage: (message: any) => {
          const text = message.message || message.text || '';
          const role = message.role || 'assistant';
          if (text) {
            addChatMessage({
              id: Date.now().toString() + Math.random(),
              role: role === 'assistant' ? 'assistant' : 'user',
              content: text,
              timestamp: new Date()
            });
          }
        },
        onError: (error: any) => {
          console.error("ElevenLabs error:", error);
        },
        onModeChange: (mode: any) => {
          setIsAgentSpeaking(mode.mode === 'speaking');
        }
      });
    } catch (error) {
      console.error("Failed to start voice session:", error);
      alert("Microphone access is required for voice chat, or connection failed.");
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (conversationInstance.current) {
        conversationInstance.current.endSession();
      }
    };
  }, []);

  if (variant === 'panel') {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header (Simplified for panel) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-none flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">AI Assistant</h4>
            </div>
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' && 'justify-end'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[90%] p-3 rounded-none text-xs leading-relaxed',
                  message.role === 'assistant'
                    ? 'bg-white text-slate-700 border border-slate-100'
                    : 'bg-emerald-500 text-white shadow-sm'
                )}
              >
                <p className="font-medium whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[8px] font-black italic">YOU</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-none text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 bg-emerald-500 text-white rounded-none disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[9px] text-slate-400">
            Logic hints only. No direct answers.
          </p>
        </div>
      </div>
    );
  }

  if (!isChatOpen) {
    return (
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => setChatOpen(true)}
          className="bg-emerald-500 text-white px-3 py-6 rounded-none shadow-xl flex flex-col items-center gap-2 hover:bg-emerald-600 transition-all hover:pr-4 group"
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
            <div className={cn(
              "w-10 h-10 rounded-none flex items-center justify-center shadow-lg transition-colors",
              isConnected ? (isAgentSpeaking ? "bg-emerald-500 shadow-emerald-200" : "bg-emerald-400 shadow-emerald-100") : "bg-emerald-600 shadow-emerald-200"
            )}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-lg">SkillMatrix AI</h4>
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "w-2 h-2 rounded-none",
                  isConnected ? "bg-emerald-500 animate-pulse" : (isConnecting ? "bg-yellow-400 animate-pulse" : "bg-slate-400")
                )} />
                <span className="text-slate-500 text-xs font-medium">
                  {isConnected ? (isAgentSpeaking ? "Speaking..." : "Listening...") : (isConnecting ? "Connecting..." : "Assistant Ready")}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-none transition-all"
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
                <div className="w-8 h-8 bg-emerald-500 rounded-none flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[85%] p-4 rounded-none text-sm leading-relaxed',
                  message.role === 'assistant'
                    ? 'bg-white text-slate-700 rounded-none shadow-sm border border-slate-100'
                    : 'bg-emerald-500 text-white rounded-none shadow-md shadow-emerald-100'
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
                <div className="w-8 h-8 bg-slate-900 rounded-none flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-[10px] font-black italic">YOU</span>
                </div>
              )}
            </div>
          ))}
          {isLoadingChat && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-none flex items-center justify-center flex-shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white text-slate-400 p-4 rounded-none text-xs border border-slate-100 italic">
                AI is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {chatMessages.length < 3 && (
          <div className="px-6 py-4 flex flex-wrap gap-2 bg-white border-t border-slate-100">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-semibold rounded-none border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
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
                  'w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 pr-12 rounded-none text-sm font-medium',
                  'focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all',
                  isConnected && 'border-emerald-500 ring-4 ring-emerald-500/10'
                )}
              />
              <button
                onClick={startVoiceInput}
                disabled={isConnecting}
                className={cn(
                  'absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-none transition-all',
                  isConnected ? 'bg-emerald-100 text-emerald-600 animate-pulse scale-110' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50'
                )}
                title={isConnected ? "End Voice Chat" : "Start Voice Chat"}
              >
                {isConnected || isConnecting ? <PhoneOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            <MatrixButton
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-5 py-3.5 rounded-none"
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
