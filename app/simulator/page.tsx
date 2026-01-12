"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { PHASES, EMPLOYER, DIFFICULTY_LABELS, DifficultyLevel, getScenario } from "@/utils/scenario";
import { jsPDF } from "jspdf";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface Pillar {
  id: string;
  label: string;
  description: string;
  score: number;
}

interface AnalysisResult {
  score: number;
  phaseKey: string;
  phaseLabel: string;
  difficulty: DifficultyLevel;
  pillars: Pillar[];
  good: string[];
  improve: string[];
  nextLevel: string | null;
}

type SimulatorState = "setup" | "chatting" | "analyzing" | "results";

export default function SimulatorPage() {
  const [state, setState] = useState<SimulatorState>("setup");
  const [selectedPhase, setSelectedPhase] = useState(PHASES[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("Easy");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const currentPhase = PHASES.find((p) => p.id === selectedPhase);
  const currentScenario = getScenario(selectedPhase, selectedDifficulty);

  const handleStart = () => {
    setMessages([]);
    setAnalysis(null);
    setState("chatting");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isStreaming || !currentScenario || !currentPhase) return;

    const userMessage: Message = { role: "user", text: inputText.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          employerLabel: EMPLOYER.label,
          phaseLabel: currentPhase.label,
          difficulty: selectedDifficulty,
          managerName: currentScenario.managerName,
          scenarioDescription: currentScenario.description,
        }),
      });

      if (!response.ok) throw new Error("Chat request failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages([...newMessages, { role: "assistant", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantText += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { role: "assistant", text: assistantText }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", text: "Beklager, noe gikk galt. Prøv igjen." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAnalyze = async () => {
    if (!currentPhase || !currentScenario || messages.length === 0) return;

    setState("analyzing");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          phaseKey: selectedPhase,
          phaseLabel: currentPhase.label,
          difficulty: selectedDifficulty,
          characterLabel: EMPLOYER.label,
          scenarioDescription: currentScenario.description,
        }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const result: AnalysisResult = await response.json();
      setAnalysis(result);
      setState("results");
    } catch (error) {
      console.error("Error analyzing:", error);
      setState("chatting");
    }
  };

  const handleDownloadPdf = () => {
    if (!analysis || !currentPhase) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let y = 20;

    doc.setFontSize(18);
    doc.text("Jobbkonsulent Simulator - Analyse", margin, y);
    y += 12;

    doc.setFontSize(10);
    doc.text(`Dato: ${new Date().toLocaleDateString("no-NO")}`, margin, y);
    y += 8;
    doc.text(`Arbeidsgiver: ${EMPLOYER.label}`, margin, y);
    y += 6;
    doc.text(`Fase: ${currentPhase.label}`, margin, y);
    y += 6;
    doc.text(`Vanskelighetsgrad: ${DIFFICULTY_LABELS[selectedDifficulty]}`, margin, y);
    y += 12;

    doc.setFontSize(14);
    doc.text(`Total score: ${analysis.score}/100`, margin, y);
    y += 12;

    doc.setFontSize(12);
    doc.text("Evaluering per område:", margin, y);
    y += 8;

    doc.setFontSize(10);
    for (const pillar of analysis.pillars) {
      const pillarText = `${pillar.label}: ${pillar.score}/100`;
      doc.text(pillarText, margin, y);
      y += 5;

      const descLines = doc.splitTextToSize(pillar.description, maxWidth - 10);
      doc.setTextColor(100);
      for (const line of descLines) {
        doc.text(line, margin + 5, y);
        y += 4;
      }
      doc.setTextColor(0);
      y += 3;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    y += 5;
    doc.setFontSize(12);
    doc.text("Det du gjorde bra:", margin, y);
    y += 7;

    doc.setFontSize(10);
    for (const item of analysis.good) {
      const lines = doc.splitTextToSize(`• ${item}`, maxWidth);
      for (const line of lines) {
        doc.text(line, margin, y);
        y += 5;
      }
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    y += 5;
    doc.setFontSize(12);
    doc.text("Forbedringsområder:", margin, y);
    y += 7;

    doc.setFontSize(10);
    for (const item of analysis.improve) {
      const lines = doc.splitTextToSize(`• ${item}`, maxWidth);
      for (const line of lines) {
        doc.text(line, margin, y);
        y += 5;
      }
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    if (analysis.nextLevel) {
      y += 8;
      doc.setFontSize(11);
      doc.text(
        `Anbefaling: Prøv ${analysis.nextLevel === "Moderate" ? "moderat" : "vanskelig"} nivå neste gang!`,
        margin,
        y
      );
    }

    doc.save("jobbkonsulent-analyse.pdf");
  };

  const handleReset = () => {
    setMessages([]);
    setAnalysis(null);
    setState("setup");
  };

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Image
            src="/fretex.png"
            alt="Fretex"
            width={280}
            height={280}
            className="mx-auto mb-6 w-auto h-auto"
          />
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Jobbutvikling-simulator
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Du er en jobbkonsulent som skal gjennomføre samtaler med en arbeidsgiver.
            Målet er å bli bedre kjent med arbeidsgiveren og på sikt matche jobbsøkere
            til <strong>ordinært, lønnet arbeid</strong> – ikke arbeidspraksis eller andre tiltak.
            Velg fase og vanskelighetsgrad, og start samtalen ved å skrive i meldingsfeltet.
            Når du avslutter får du en rapport du kan bruke til å forbedre deg.
            Husk å bruke jobbutviklings-teknikkene. Lykke til!
          </p>
        </div>

        {/* Setup */}
        {state === "setup" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Velg scenario
            </h2>

            <div className="space-y-6">
              {/* Phase Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fase
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PHASES.map((phase) => (
                    <button
                      key={phase.id}
                      onClick={() => setSelectedPhase(phase.id)}
                      className={`p-4 rounded-xl border-2 text-left transition ${
                        selectedPhase === phase.id
                          ? "border-rose-500 bg-rose-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-medium text-slate-800">
                        {phase.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vanskelighetsgrad
                </label>
                <div className="flex gap-3">
                  {(Object.keys(DIFFICULTY_LABELS) as DifficultyLevel[]).map(
                    (diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-6 py-3 rounded-xl border-2 font-medium transition ${
                          selectedDifficulty === diff
                            ? "border-rose-500 bg-rose-50 text-rose-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {DIFFICULTY_LABELS[diff]}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Scenario Description */}
              {currentScenario && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-medium text-slate-700 mb-2">
                    Scenario
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {currentScenario.shortDescription}
                  </p>
                </div>
              )}

              {/* Job Seeker Profile (only for phase-3a) */}
              {selectedPhase === "phase-3a" && currentScenario?.jobSeekerProfile && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Jobbsøker: {currentScenario.jobSeekerProfile.name} ({currentScenario.jobSeekerProfile.age} år)
                  </h3>
                  <p className="text-blue-700 text-sm mb-2">
                    {currentScenario.jobSeekerProfile.background}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-medium text-blue-800">Styrker:</p>
                      <ul className="text-blue-700 list-disc list-inside">
                        {currentScenario.jobSeekerProfile.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Utfordringer:</p>
                      <ul className="text-blue-700 list-disc list-inside">
                        {currentScenario.jobSeekerProfile.challenges.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="text-blue-700 text-sm mt-2">
                    <span className="font-medium">Ønsker:</span> {currentScenario.jobSeekerProfile.preferences}
                  </p>
                </div>
              )}

              {/* Employer Profile (only for phase-3a) */}
              {selectedPhase === "phase-3a" && currentScenario?.employerProfile && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h3 className="font-medium text-amber-800 mb-2">
                    Arbeidsgiver: {EMPLOYER.label}
                  </h3>
                  <p className="text-amber-700 text-sm mb-2">
                    {currentScenario.employerProfile.summary}
                  </p>
                  <p className="text-amber-700 text-sm">
                    <span className="font-medium">Behov:</span> {currentScenario.employerProfile.currentNeed}
                  </p>
                  <div className="mt-2 text-sm text-amber-700">
                    <p><span className="font-medium">Fysisk miljø:</span> {currentScenario.employerProfile.workEnv.physical}</p>
                  </div>
                </div>
              )}

              {/* Start Button */}
              <button
                onClick={handleStart}
                className="w-full py-4 bg-rose-600 text-white font-semibold rounded-full hover:bg-rose-700 transition shadow-sm"
              >
                Start samtale
              </button>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {(state === "chatting" || state === "analyzing") && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-slate-800">
                    {EMPLOYER.label}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {currentPhase?.label} • {DIFFICULTY_LABELS[selectedDifficulty]}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-slate-500 hover:text-slate-700 text-sm"
                >
                  Avbryt
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <p className="text-slate-500 text-center py-8">
                  Start samtalen ved å skrive en melding nedenfor.
                </p>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex gap-3">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Skriv din melding..."
                  disabled={isStreaming || state === "analyzing"}
                  rows={2}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-slate-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isStreaming || state === "analyzing"}
                  className="px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              {messages.length > 0 && state === "chatting" && (
                <button
                  onClick={handleAnalyze}
                  disabled={isStreaming}
                  className="mt-4 w-full py-3 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700 transition disabled:bg-slate-300"
                >
                  Avslutt og få tilbakemelding
                </button>
              )}
              {state === "analyzing" && (
                <div className="mt-4 text-center text-slate-600">
                  <span className="inline-block animate-pulse">
                    Analyserer samtalen...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {state === "results" && analysis && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">
                  Analyse av samtalen
                </h2>
                <div className="text-3xl font-bold text-rose-600">
                  {analysis.score}/100
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">{currentPhase?.label}</span>
                  {" • "}
                  {DIFFICULTY_LABELS[selectedDifficulty]}
                  {" • "}
                  {EMPLOYER.label}
                </p>
              </div>

              {/* Pillars */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-700">
                  Evaluering per område
                </h3>
                {analysis.pillars.map((pillar) => (
                  <div key={pillar.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-800">
                        {pillar.label}
                      </span>
                      <span
                        className={`font-semibold ${
                          pillar.score >= 80
                            ? "text-emerald-600"
                            : pillar.score >= 50
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}
                      >
                        {pillar.score}/100
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${
                          pillar.score >= 80
                            ? "bg-emerald-500"
                            : pillar.score >= 50
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${pillar.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-600">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Good */}
            {analysis.good.length > 0 && (
              <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
                <h3 className="font-semibold text-emerald-800 mb-4">
                  Det du gjorde bra
                </h3>
                <ul className="space-y-2">
                  {analysis.good.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-emerald-700"
                    >
                      <span className="mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improve */}
            {analysis.improve.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
                <h3 className="font-semibold text-amber-800 mb-4">
                  Forbedringsområder
                </h3>
                <ul className="space-y-2">
                  {analysis.improve.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-amber-700"
                    >
                      <span className="mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Level Recommendation */}
            {analysis.nextLevel && (
              <div className="bg-rose-50 rounded-2xl border border-rose-200 p-6">
                <p className="text-rose-800 font-medium">
                  Anbefaling: Prøv{" "}
                  {analysis.nextLevel === "Moderate" ? "moderat" : "vanskelig"}{" "}
                  nivå neste gang!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleDownloadPdf}
                className="flex-1 py-4 bg-rose-600 text-white font-semibold rounded-full hover:bg-rose-700 transition"
              >
                Last ned analyse (PDF)
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-4 bg-slate-200 text-slate-800 font-semibold rounded-full hover:bg-slate-300 transition"
              >
                Prøv igjen
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
