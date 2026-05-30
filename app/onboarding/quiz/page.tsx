"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TierType, PlanType } from "@/lib/types";

type QuestionType = "q1" | "q2" | "q3" | "q3a" | "q3b";

interface QuizState {
  q1?: "free" | "premium";
  q2?: "commissioner" | "team-owner" | "both";
  q3?: "league" | "teams";
  focus?: "content" | "balanced" | "analytical";
}

export default function QuizPage() {
  const router = useRouter();
  const [state, setState] = useState<QuizState>({});
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType>("q1");

  function handleAnswer(key: keyof QuizState, value: any) {
    const newState = { ...state, [key]: value };
    setState(newState);
    next(newState, key);
  }

  function next(updatedState: QuizState, lastAnswered: keyof QuizState) {
    // Q1: Premium or free?
    if (lastAnswered === "q1") {
      if (updatedState.q1 === "free") {
        // Recommend Free (Standard)
        submitQuiz("free", "double");
      } else {
        setCurrentQuestion("q2");
      }
      return;
    }

    // Q2: Commissioner, Team Owner, or Both?
    if (lastAnswered === "q2") {
      if (updatedState.q2 === "commissioner") {
        // League Newsroom path
        setCurrentQuestion("q3a");
      } else if (updatedState.q2 === "team-owner") {
        // All-Access path
        setCurrentQuestion("q3b");
      } else if (updatedState.q2 === "both") {
        // Q3: Entire league or just teams?
        setCurrentQuestion("q3");
      }
      return;
    }

    // Q3: Both answer - Entire league or just teams?
    if (lastAnswered === "q3") {
      if (updatedState.q3 === "league") {
        // League Newsroom path
        setCurrentQuestion("q3a");
      } else {
        // All-Access path
        setCurrentQuestion("q3b");
      }
      return;
    }

    // Q3a (League Newsroom): Content, Both, or Analytical?
    // Q3b (All-Access): Content, Both, or Analytical?
    if (lastAnswered === "focus") {
      const tier: TierType =
        currentQuestion === "q3a" ? "league-newsroom" : "all-access";
      const plan: PlanType =
        updatedState.focus === "content"
          ? "beat"
          : updatedState.focus === "balanced"
            ? "double"
            : "war-room";

      submitQuiz(tier, plan);
    }
  }

  function submitQuiz(tier: TierType, plan: PlanType) {
    router.push(
      `/onboarding/result?tier=${tier}&plan=${plan}`
    );
  }

  function back() {
    if (currentQuestion === "q1") return;

    if (currentQuestion === "q2") {
      setCurrentQuestion("q1");
      setState({ q1: undefined });
    } else if (currentQuestion === "q3") {
      setCurrentQuestion("q2");
      setState({ ...state, q3: undefined });
    } else if (currentQuestion === "q3a" || currentQuestion === "q3b") {
      if (state.q2 === "commissioner" || state.q2 === "team-owner") {
        setCurrentQuestion("q2");
      } else {
        setCurrentQuestion("q3");
      }
      setState({ ...state, focus: undefined });
    }
  }

  return (
    <div className="min-h-screen bg-obsidian-900 text-on-surface p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        {currentQuestion !== "q1" && (
          <button
            onClick={back}
            className="mb-8 text-football-cyan hover:text-football-cyan/80 transition text-sm font-bold uppercase"
          >
            ← Back
          </button>
        )}

        {/* Q1 */}
        {currentQuestion === "q1" && (
          <Question1 onAnswer={(v) => handleAnswer("q1", v)} />
        )}

        {/* Q2 */}
        {currentQuestion === "q2" && (
          <Question2 onAnswer={(v) => handleAnswer("q2", v)} />
        )}

        {/* Q3 */}
        {currentQuestion === "q3" && (
          <Question3 onAnswer={(v) => handleAnswer("q3", v)} />
        )}

        {/* Q3a (League Newsroom path) */}
        {currentQuestion === "q3a" && (
          <QuestionFocus
            tier="league-newsroom"
            onAnswer={(v) => handleAnswer("focus", v)}
          />
        )}

        {/* Q3b (All-Access path) */}
        {currentQuestion === "q3b" && (
          <QuestionFocus
            tier="all-access"
            onAnswer={(v) => handleAnswer("focus", v)}
          />
        )}
      </div>
    </div>
  );
}

function Question1({ onAnswer }: { onAnswer: (v: "free" | "premium") => void }) {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-4">Are you looking for a premium version or just a free version?</h1>
      <div className="grid gap-4 md:grid-cols-2 mt-12">
        <button
          onClick={() => onAnswer("free")}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold mb-2">Free</h2>
          <p className="text-on-surface-variant">Just a free version</p>
        </button>
        <button
          onClick={() => onAnswer("premium")}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold mb-2">Premium</h2>
          <p className="text-on-surface-variant">Looking for premium</p>
        </button>
      </div>
    </div>
  );
}

function Question2({
  onAnswer,
}: {
  onAnswer: (v: "commissioner" | "team-owner" | "both") => void;
}) {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-4">Are you a commissioner, team owner, or both?</h1>
      <div className="grid gap-4 md:grid-cols-3 mt-12">
        <button
          onClick={() => onAnswer("commissioner")}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold mb-2">Commissioner</h2>
        </button>
        <button
          onClick={() => onAnswer("team-owner")}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold mb-2">Team Owner</h2>
        </button>
        <button
          onClick={() => onAnswer("both")}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold mb-2">Both</h2>
        </button>
      </div>
    </div>
  );
}

function Question3({ onAnswer }: { onAnswer: (v: "league" | "teams") => void }) {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-4">Would you like to use this for your entire league or just your team(s)?</h1>
      <div className="grid gap-4 md:grid-cols-2 mt-12">
        <button
          onClick={() => onAnswer("league")}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold mb-2">Entire League</h2>
        </button>
        <button
          onClick={() => onAnswer("teams")}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold mb-2">Just My Team(s)</h2>
        </button>
      </div>
    </div>
  );
}

function QuestionFocus({
  tier,
  onAnswer,
}: {
  tier: "league-newsroom" | "all-access";
  onAnswer: (v: "content" | "balanced" | "analytical") => void;
}) {
  const tierName =
    tier === "league-newsroom" ? "League Newsroom" : "All-Access";

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-4">What would you like to focus on?</h1>
      <p className="text-on-surface-variant text-lg mb-12">
        {tierName} is best for you.
      </p>
      <div className="grid gap-4 md:grid-cols-3 mt-12">
        <button
          onClick={() => onAnswer("content")}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold mb-2">Content</h2>
          <p className="text-on-surface-variant text-sm">Coverage-focused</p>
        </button>
        <button
          onClick={() => onAnswer("balanced")}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold mb-2">Both</h2>
          <p className="text-on-surface-variant text-sm">Balanced</p>
        </button>
        <button
          onClick={() => onAnswer("analytical")}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 glass-blur transition hover:border-football-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]"
        >
          <h2 className="text-2xl font-bold mb-2">Analytical</h2>
          <p className="text-on-surface-variant text-sm">Analytics-focused</p>
        </button>
      </div>
    </div>
  );
}
