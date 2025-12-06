"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { ApplicantTimeline, TimelineEvent } from "../services/applicant.service";

type Props = { steps: ApplicantTimeline[] };

export function HorizontalTimeline({ steps }: Props) {
  const [highlightStep, setHighlightStep] = useState<number | null>(null);

  useEffect(() => {
    const currentIndex = steps.findIndex(step => step.currentStep);
    if (currentIndex !== -1) {
      setHighlightStep(currentIndex);
      const timer = setTimeout(() => setHighlightStep(null), 2000); // nháy 2s
      return () => clearTimeout(timer);
    }
  }, [steps]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Tiến trình ứng tuyển</h3>
      <div className="flex items-center gap-4 relative">
        {steps.map((step, idx) => (
          <div key={idx} className="flex-1 relative text-center">
            {/* connector line */}
            {idx < steps.length - 1 && (
              <div className="absolute top-3 left-full w-full h-1 bg-gray-300 -z-10"></div>
            )}

            <div
              className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500
                ${step.completed 
                  ? "bg-green-500 text-white" 
                  : step.currentStep 
                    ? highlightStep === idx 
                      ? "bg-blue-400 text-white animate-pulse" 
                      : "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.completed ? <CheckCircle size={14} /> : <Clock size={14} />}
            </div>
            <div className={`mt-2 text-xs font-medium ${highlightStep === idx ? "text-blue-600" : ""}`}>
              {step.status}
            </div>
          </div>
        ))}
      </div>

      {/* Optional: events under each step */}
      {steps.map((step, idx) => (
        <div key={idx} className="mt-2 text-xs text-gray-500">
          {step.events?.map((ev: TimelineEvent, i: number) => {
            if ("changedAt" in ev) {
              // ApplicantHistory
              return (
                <p key={i}>
                  {new Date(ev.changedAt).toLocaleString()} - {ev.note || "No note"} ({ev.changedBy})
                </p>
              );
            }
            if ("scheduledAt" in ev) {
              // InterviewSchedule
              return (
                <p key={i}>
                  {new Date(ev.scheduledAt).toLocaleString()} - Interview at {ev.location} with {ev.interviewer}
                </p>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
}
