import React from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles,
  Info
} from 'lucide-react';
import { useEWS } from '../../context/EWSContext';

export const PresentationBanner: React.FC = () => {
  const { 
    isPresentationMode, 
    presentationStep, 
    presentationSteps, 
    nextPresentationStep, 
    prevPresentationStep, 
    setStepIndex, 
    stopPresentationTour 
  } = useEWS();

  if (!isPresentationMode) return null;

  const currentStep = presentationSteps[presentationStep];

  return (
    <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-11/12 max-w-3xl animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-xl">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  Step {presentationStep + 1}/{presentationSteps.length}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 truncate max-w-[120px] sm:max-w-none">
                  {currentStep.systemStage}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 mt-0.5 line-clamp-1">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <button
            onClick={stopPresentationTour}
            className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            title="Exit Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Explanation Text */}
        <div className="py-2 sm:py-3 flex items-start gap-2 text-xs md:text-sm text-slate-600 leading-relaxed max-h-24 sm:max-h-none overflow-y-auto">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs md:text-sm">{currentStep.explanation}</p>
        </div>

        {/* Step Progression Dots & Controls */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Step Dots */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {presentationSteps.map((step, idx) => (
              <button
                key={step.stepNumber}
                onClick={() => setStepIndex(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  idx === presentationStep
                    ? 'w-4 sm:w-6 bg-blue-600'
                    : idx < presentationStep
                    ? 'w-1.5 sm:w-2 bg-blue-300'
                    : 'w-1.5 sm:w-2 bg-slate-200'
                }`}
                title={`Step ${idx + 1}: ${step.title}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={prevPresentationStep}
              disabled={presentationStep === 0}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-[11px] sm:text-xs font-medium text-slate-700 flex items-center gap-0.5 sm:gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={nextPresentationStep}
              className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-[11px] sm:text-xs font-semibold text-white flex items-center gap-0.5 sm:gap-1 shadow-sm transition-colors"
            >
              <span>{presentationStep === presentationSteps.length - 1 ? 'Finish' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
