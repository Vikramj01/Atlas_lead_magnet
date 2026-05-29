"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingScreen from "@/components/LandingScreen";
import ProgressBar from "@/components/ProgressBar";
import QuestionScreen from "@/components/QuestionScreen";
import EmailCaptureScreen from "@/components/EmailCaptureScreen";
import { QUESTIONS } from "@/lib/questions";
import { useAssessment } from "@/lib/useAssessment";
import { useUtm } from "@/lib/useUtm";
import type { LeadFormData } from "@/lib/types";

function getVariants(direction: "forward" | "back") {
  return {
    initial: { opacity: 0, y: direction === "forward" ? 8 : -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: direction === "forward" ? -8 : 8 },
  };
}

export default function Home() {
  const { currentStep, answers, direction, start, answer, goNext, goBack } =
    useAssessment();

  const utms = useUtm();
  // Store UTMs in a ref so they don't cause re-renders
  const utmRef = useRef(utms);
  utmRef.current = utms;

  const [leadData, setLeadData] = useState<LeadFormData | null>(null);

  function handleEmailSubmit(data: LeadFormData) {
    setLeadData(data);
    goNext();
  }

  const isQuestionStep = currentStep >= 1 && currentStep <= 7;
  const question = isQuestionStep ? QUESTIONS[currentStep - 1] : null;
  const variants = getVariants(direction);
  const transition = { duration: currentStep === 0 ? 0.2 : 0.15 };

  // leadData and utmRef.current available for Sprint 4 (Supabase + email send)
  void leadData;

  return (
    <>
      {/* Progress bar — outside animated content so it doesn't flash */}
      {isQuestionStep && <ProgressBar step={currentStep} />}

      <AnimatePresence mode="wait" initial={false}>
        {currentStep === 0 && (
          <motion.div
            key="landing"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <LandingScreen onStart={start} />
          </motion.div>
        )}

        {isQuestionStep && question && (
          <motion.div
            key={`question-${currentStep}`}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <QuestionScreen
              step={currentStep}
              question={question.question}
              subtext={question.subtext}
              contextNote={question.contextNote}
              options={question.options}
              selected={answers[question.id] ?? null}
              onSelect={(value) => answer(question.id, value)}
              onNext={goNext}
              onBack={goBack}
            />
          </motion.div>
        )}

        {currentStep === 8 && (
          <motion.div
            key="email-capture"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <EmailCaptureScreen onSubmit={handleEmailSubmit} />
          </motion.div>
        )}

        {currentStep === 9 && (
          <motion.div
            key="results"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex min-h-[80vh] flex-col justify-center py-12"
          >
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Results screen — Sprint 3
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
