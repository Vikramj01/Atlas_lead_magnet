"use client";

import { useState } from "react";

export type AssessmentStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Direction = "forward" | "back";

export interface AssessmentState {
  currentStep: AssessmentStep;
  answers: Record<string, string>;
  direction: Direction;
}

export interface AssessmentActions {
  start: () => void;
  answer: (questionId: string, value: string) => void;
  goNext: () => void;
  goBack: () => void;
  submitEmail: () => void;
}

export function useAssessment(): AssessmentState & AssessmentActions {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<Direction>("forward");

  function start() {
    setDirection("forward");
    setCurrentStep(1);
  }

  function answer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function goNext() {
    if (currentStep >= 1 && currentStep <= 8) {
      setDirection("forward");
      setCurrentStep((prev) => (prev + 1) as AssessmentStep);
    }
  }

  function goBack() {
    // Back nav allowed only on question steps 1–7
    if (currentStep >= 2 && currentStep <= 7) {
      setDirection("back");
      setCurrentStep((prev) => (prev - 1) as AssessmentStep);
    }
  }

  function submitEmail() {
    setDirection("forward");
    setCurrentStep(9);
  }

  return {
    currentStep,
    answers,
    direction,
    start,
    answer,
    goNext,
    goBack,
    submitEmail,
  };
}
