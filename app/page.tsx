"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingScreen from "@/components/LandingScreen";
import ProgressBar from "@/components/ProgressBar";
import QuestionScreen from "@/components/QuestionScreen";
import EmailCaptureScreen from "@/components/EmailCaptureScreen";
import ResultsScreen from "@/components/ResultsScreen";
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

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/mikael-mcaconsulting/30min";

const ATLAS_URL =
  process.env.NEXT_PUBLIC_ATLAS_URL ?? "https://vimi.digital/atlas";

export default function Home() {
  const { currentStep, answers, direction, start, answer, goNext, goBack } =
    useAssessment();

  const utms = useUtm();
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

  // leadData and utmRef.current available for Sprint 4 (Supabase + Resend)
  void leadData;

  return (
    <>
      {/* Progress bar — only on question steps, outside animated content */}
      {isQuestionStep && <ProgressBar step={currentStep} />}

      {/* Results screen rendered outside AnimatePresence — appears instantly per PRD §11 */}
      {currentStep === 9 && (
        <ResultsScreen
          answers={answers}
          bookingUrl={BOOKING_URL}
          atlasUrl={ATLAS_URL}
        />
      )}

      {/* Steps 0–8 use AnimatePresence for directional transitions */}
      {currentStep !== 9 && (
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
        </AnimatePresence>
      )}
    </>
  );
}
