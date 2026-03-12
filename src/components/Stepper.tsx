import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  steps: { label: string; labelBn: string }[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full px-2 py-4">
      {steps.map((step, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? "stepper-done"
                    : isActive
                    ? "stepper-active shadow-md"
                    : "stepper-pending"
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.label}
                <br />
                <span className="text-[9px] opacity-70">{step.labelBn}</span>
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded-full transition-colors duration-300 ${
                  isDone ? "bg-primary/40" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
