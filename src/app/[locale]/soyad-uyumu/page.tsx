"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Check, AlertTriangle, X } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ═══════════════════════════════════════════
   SCORING ENGINE — 7 criteria, 100 points max
   100% client-side, zero API calls
   ═══════════════════════════════════════════ */

const VOWELS = new Set("aeıioöuüAEIİOÖUÜ");

function countSyllables(word: string): number {
  return [...word].filter((c) => VOWELS.has(c)).length || 1;
}

function countVowelRatio(word: string): number {
  if (word.length === 0) return 0;
  return [...word].filter((c) => VOWELS.has(c)).length / word.length;
}

interface CriterionResult {
  name: string;
  description: string;
  score: number;
  maxScore: number;
  icon: "good" | "neutral" | "bad";
}

function analyzeSurnameHarmony(
  firstName: string,
  surname: string
): { total: number; criteria: CriterionResult[] } {
  const fn = firstName.trim().toLowerCase();
  const sn = surname.trim().toLowerCase();
  if (!fn || !sn) return { total: 0, criteria: [] };

  const fnSyl = countSyllables(fn);
  const snSyl = countSyllables(sn);
  const totalSyl = fnSyl + snSyl;
  const totalLen = fn.length + sn.length;

  const criteria: CriterionResult[] = [];

  // 1. Syllable harmony (max 20)
  {
    let score = 0;
    let desc = "";
    if (totalSyl >= 4 && totalSyl <= 6) {
      score = 20;
      desc = `Toplam ${totalSyl} hece — ideal aralıkta (4-6)`;
    } else if (totalSyl === 3 || totalSyl === 7) {
      score = 12;
      desc = `Toplam ${totalSyl} hece — kabul edilebilir`;
    } else {
      score = 5;
      desc = `Toplam ${totalSyl} hece — ideal aralığın dışında`;
    }
    criteria.push({
      name: "Hece Uyumu",
      description: desc,
      score,
      maxScore: 20,
      icon: score >= 15 ? "good" : score >= 10 ? "neutral" : "bad",
    });
  }

  // 2. Last-first letter clash (max 10, penalty based)
  {
    const lastOfFirst = fn[fn.length - 1];
    const firstOfSurname = sn[0];
    let score = 10;
    let desc = "";
    if (lastOfFirst === firstOfSurname) {
      score = 0;
      desc = `"${lastOfFirst}" harfi tekrarlanıyor — akış bozulur`;
    } else {
      desc = "Harf geçişi akıcı";
    }
    criteria.push({
      name: "Harf Geçişi",
      description: desc,
      score,
      maxScore: 10,
      icon: score >= 8 ? "good" : score >= 5 ? "neutral" : "bad",
    });
  }

  // 3. Vowel balance (max 15)
  {
    const fnRatio = countVowelRatio(fn);
    const snRatio = countVowelRatio(sn);
    const diff = Math.abs(fnRatio - snRatio);
    let score = 0;
    if (diff < 0.1) score = 15;
    else if (diff < 0.2) score = 10;
    else if (diff < 0.3) score = 5;
    criteria.push({
      name: "Sesli Harf Dengesi",
      description: `İsim: %${Math.round(fnRatio * 100)} — Soyad: %${Math.round(snRatio * 100)} sesli harf`,
      score,
      maxScore: 15,
      icon: score >= 12 ? "good" : score >= 7 ? "neutral" : "bad",
    });
  }

  // 4. Rhythm (max 15)
  {
    let score = 0;
    const diff = Math.abs(fnSyl - snSyl);
    if (diff >= 1 && diff <= 2) {
      score = 15;
    } else if (diff === 0) {
      score = 8;
    } else {
      score = 4;
    }
    criteria.push({
      name: "Ritim Analizi",
      description: `İsim: ${fnSyl} hece, Soyad: ${snSyl} hece — ${diff === 0 ? "eşit" : diff <= 2 ? "dengeli kontrast" : "büyük fark"}`,
      score,
      maxScore: 15,
      icon: score >= 12 ? "good" : score >= 7 ? "neutral" : "bad",
    });
  }

  // 5. Letter repetition (max 10, penalty based)
  {
    const full = fn + sn;
    const freq: Record<string, number> = {};
    for (const c of full) freq[c] = (freq[c] || 0) + 1;
    const maxRepeat = Math.max(...Object.values(freq));
    let score = 10;
    if (maxRepeat > full.length * 0.3) score = 2;
    else if (maxRepeat > full.length * 0.25) score = 5;
    else if (maxRepeat > full.length * 0.2) score = 7;
    criteria.push({
      name: "Harf Tekrarı",
      description:
        score >= 8
          ? "Harf dağılımı dengeli"
          : "Bazı harfler çok tekrarlanıyor",
      score,
      maxScore: 10,
      icon: score >= 8 ? "good" : score >= 5 ? "neutral" : "bad",
    });
  }

  // 6. Phonetic flow (max 15)
  {
    const transition = fn[fn.length - 1] + sn[0];
    const firstVowel = VOWELS.has(transition[0]);
    const secondVowel = VOWELS.has(transition[1]);
    let score = 0;
    if (firstVowel !== secondVowel) {
      score = 15; // vowel→consonant or consonant→vowel = smooth
    } else if (firstVowel && secondVowel) {
      score = 8; // vowel→vowel = ok
    } else {
      score = 5; // consonant→consonant = harder
    }
    criteria.push({
      name: "Fonetik Akış",
      description:
        score >= 12
          ? "Sessiz-sesli geçişi akıcı"
          : score >= 8
          ? "Sesli-sesli geçiş, kabul edilebilir"
          : "Sessiz-sessiz geçiş, biraz sert",
      score,
      maxScore: 15,
      icon: score >= 12 ? "good" : score >= 7 ? "neutral" : "bad",
    });
  }

  // 7. Total length (max 15)
  {
    let score = 0;
    if (totalLen >= 10 && totalLen <= 16) score = 15;
    else if (totalLen >= 8 && totalLen <= 20) score = 10;
    else score = 4;
    criteria.push({
      name: "Toplam Uzunluk",
      description: `${totalLen} karakter — ${totalLen >= 10 && totalLen <= 16 ? "ideal aralıkta" : "ideal dışında"} (10-16)`,
      score,
      maxScore: 15,
      icon: score >= 12 ? "good" : score >= 7 ? "neutral" : "bad",
    });
  }

  const total = criteria.reduce((sum, c) => sum + c.score, 0);
  return { total, criteria };
}

/* ═══════════════════════════════════════════
   SCORE CIRCLE — Animated SVG gauge
   ═══════════════════════════════════════════ */

function ScoreCircle({ score }: { score: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const color =
    score >= 75
      ? "text-emerald-500"
      : score >= 50
      ? "text-gold-400"
      : "text-coral-400";
  const strokeColor =
    score >= 75 ? "#10B981" : score >= 50 ? "#FBBF24" : "#F56565";
  const label =
    score >= 85
      ? "Mükemmel"
      : score >= 70
      ? "Çok İyi"
      : score >= 55
      ? "İyi"
      : score >= 40
      ? "Orta"
      : "Düşük";

  return (
    <div className="relative flex flex-col items-center">
      <svg width="200" height="200" className="-rotate-90">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-ocean-100"
        />
        {/* Progress circle */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`text-5xl font-display font-bold ${color}`}
        >
          {score}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-slate-500 mt-1"
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function SurnameHarmonyPage() {
  const t = useTranslations("common");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [result, setResult] = useState<ReturnType<
    typeof analyzeSurnameHarmony
  > | null>(null);

  function handleAnalyze() {
    if (!firstName.trim() || !surname.trim()) return;
    setResult(analyzeSurnameHarmony(firstName, surname));
  }

  function handleReset() {
    setFirstName("");
    setSurname("");
    setResult(null);
  }

  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal blur>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-gold-50 text-gold-500 text-sm font-medium mb-4 border border-gold-200">
              <Sparkles className="h-4 w-4" />
              Kişiselleştirilmiş analiz
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl">
              Soyadı Uyum Analizi
            </h1>
            <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">
              Bebeğinizin ismi soyadınızla ne kadar uyumlu? 7 kriter üzerinden
              analiz edin.
            </p>
          </div>
        </ScrollReveal>

        {/* Input Section */}
        <ScrollReveal>
          <div className="glass-strong rounded-hero p-8 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Bebek İsmi
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setResult(null);
                  }}
                  placeholder="örn: Elif"
                  className="input-glass w-full h-14 px-5 text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Soyadınız
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => {
                    setSurname(e.target.value);
                    setResult(null);
                  }}
                  placeholder="örn: Yılmaz"
                  className="input-glass w-full h-14 px-5 text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!firstName.trim() || !surname.trim()}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Heart className="h-4.5 w-4.5" />
                Uyumu Test Et
              </button>
              {result && (
                <button onClick={handleReset} className="btn-ghost">
                  Temizle
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="mt-10"
            >
              {/* Score display */}
              <div className="glass-strong rounded-hero p-8 sm:p-10 text-center">
                <p className="text-lg text-slate-500 mb-6">
                  <span className="font-display font-semibold text-ocean-800">
                    {firstName}
                  </span>{" "}
                  +{" "}
                  <span className="font-display font-semibold text-ocean-800">
                    {surname}
                  </span>
                </p>

                <ScoreCircle score={result.total} />
              </div>

              {/* Criteria breakdown */}
              <div className="mt-6 space-y-3">
                {result.criteria.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.8 + i * 0.08,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1] as const,
                    }}
                    className="glass rounded-card p-4 flex items-start gap-4"
                  >
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                        c.icon === "good"
                          ? "bg-emerald-50 text-emerald-500"
                          : c.icon === "neutral"
                          ? "bg-gold-50 text-gold-500"
                          : "bg-coral-50 text-coral-400"
                      }`}
                    >
                      {c.icon === "good" ? (
                        <Check className="h-4 w-4" />
                      ) : c.icon === "neutral" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-ocean-800 text-sm">
                          {c.name}
                        </span>
                        <span className="text-sm font-semibold text-slate-500">
                          {c.score}/{c.maxScore}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {c.description}
                      </p>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 bg-ocean-50 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            c.icon === "good"
                              ? "bg-emerald-400"
                              : c.icon === "neutral"
                              ? "bg-gold-400"
                              : "bg-coral-400"
                          }`}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(c.score / c.maxScore) * 100}%`,
                          }}
                          transition={{
                            delay: 1 + i * 0.08,
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1] as const,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
