import React, { useState } from 'react';
import { MessageSquare, Sparkles, X, Bot, ChevronRight, Info } from 'lucide-react';

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {/* Floating Blue AI Chat Trigger Button */}
      <div className="fixed bottom-16 md:bottom-5 right-4 md:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Chat Assistant"
          className="group relative flex items-center justify-center w-12 h-12 md:w-13 md:h-13 rounded-full bg-[#1d63ff] hover:bg-[#1554e0] text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {isOpen ? (
            <X className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-90" />
          ) : (
            <>
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
              {/* Pulse Indicator badge */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-400 border-2 border-white"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* AI Chat Modal / Popover */}
      {isOpen && (
        <div className="fixed bottom-28 md:bottom-20 right-4 md:right-6 z-50 w-[92vw] max-w-sm bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#1d63ff] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">FloodWatch AI Assistant</h3>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-300"></span>
                  Concept &bull; Preview
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 bg-[var(--panel)] text-[var(--ink)]">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-semibold text-[var(--ink)]">
                  Work in Progress
                </p>
                <p className="text-[var(--muted)] leading-relaxed">
                  Future implementation — the AI Chat is a work in progress.
                </p>
              </div>
            </div>

            <div className="text-xs text-[var(--muted)] leading-relaxed space-y-2">
              <p>
                This upcoming feature will provide automated conversational insights, instant flood advisory explanations, and interactive risk analysis for ASEAN communities.
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--line)] flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--sea)] text-white hover:opacity-95 transition-opacity cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

