"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import {
  ApplicantTimeline,
  TimelineEvent,
} from "../services/applicant.service";
import styles from "../../../styles/Timeline.module.css";

type Props = { steps: ApplicantTimeline[] };

export function Timeline({ steps }: Props) {
  const [highlightStep, setHighlightStep] = useState<number | null>(null);

  useEffect(() => {
    const currentIndex = steps.findIndex((step) => step.currentStep);
    if (currentIndex !== -1) {
      setHighlightStep(currentIndex);
      const timer = setTimeout(() => setHighlightStep(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [steps]);

  return (
    <div className={styles.timelineWrapper}>
      <ol className={styles.timelineList}>
        {[...steps]
          .filter(
            (step) =>
              step.completed ||
              step.currentStep ||
              (step.events && step.events.length > 0)
          )
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .map((step, idx) => (
            <li key={idx} className={styles.timelineStep}>
              <span
                className={`${styles.dot} ${
                  step.completed
                    ? styles.completed
                    : step.currentStep
                    ? highlightStep === idx
                      ? styles.currentPulse
                      : styles.current
                    : styles.pending
                }`}
              >
                {step.completed ? (
                  <CheckCircle size={14} />
                ) : (
                  <Clock size={14} />
                )}
              </span>

              {idx < steps.length - 1 && <span className={styles.line}></span>}

              <div className={styles.content}>
                <h4
                  className={`${styles.stepTitle} ${
                    step.completed
                      ? styles.textCompleted
                      : step.currentStep
                      ? styles.textCurrent
                      : styles.textPending
                  }`}
                >
                  {step.status} {step.currentStep && "(Current)"}
                </h4>

                <div className={styles.events}>
                  {step.events?.map((ev: TimelineEvent, i) => {
                    if ("changedAt" in ev)
                      return (
                        <p key={i} className={styles.event}>
                          <span className={styles.eventTime}>
                            {new Date(ev.changedAt).toLocaleString()}
                          </span>{" "}
                          - {ev.note || "No note"}{" "}
                          <span className={styles.eventBy}>
                            ({ev.changedBy})
                          </span>
                        </p>
                      );
                    if ("scheduledAt" in ev)
                      return (
                        <p key={i} className={styles.event}>
                          <span className={styles.eventTime}>
                            {new Date(ev.scheduledAt).toLocaleString()}
                          </span>{" "}
                          - Interview at {ev.location} with {ev.interviewer}
                        </p>
                      );
                    return null;
                  })}
                </div>
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}
