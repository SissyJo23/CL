import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FileText, ChevronRight, Scale, Shield, BarChart3, Gavel, BrainCircuit, Activity, Heart, User, Users, BookOpen, Sparkles } from "lucide-react";

const APP_URL = "https://best-possible.replit.app";
const DEMO_URL = "https://best-possible.replit.app/cases/1";

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const DEMO_STEPS = [
  {
    label: "Upload Documents",
    step: "01",
    panel: () => (
      <div className="p-5 space-y-3">
        <p className="text-xs font-sans uppercase tracking-widest text-[#c8a96e] mb-4">Case Documents — State v. Lagerman</p>
        {[
          { name: "Trial Transcript Vol. 1", type: "Court Transcript", status: "ready", pages: 212 },
          { name: "Officer Houdek Police Report", type: "Police Report", status: "ready", pages: 18 },
          { name: "No-Merit Report (Crawford)", type: "No-Merit Report", status: "ready", pages: 34 },
          { name: "Sentencing Transcript", type: "Court Transcript", status: "ready", pages: 67 },
        ].map((doc, i) => (
          <div key={i} className="flex items-center justify-between bg-[#1a2744] border border-white/10 rounded px-4 py-3">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#c8a96e] shrink-0" />
              <div>
                <div className="text-white text-sm font-sans">{doc.name}</div>
                <div className="text-white/40 text-xs font-sans">{doc.type} · {doc.pages} pages</div>
              </div>
            </div>
            <span className="text-xs font-sans px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
              Ready
            </span>
          </div>
        ))}
        <div className="border-2 border-dashed border-white/20 rounded px-4 py-4 text-center">
          <p className="text-white/40 text-xs font-sans">Drop additional files here — PDF, DOCX, or image</p>
        </div>
      </div>
    ),
  },
  {
    label: "AI Finds Issues",
    step: "02",
    panel: () => (
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-sans uppercase tracking-widest text-[#c8a96e]">Analysis Results — 47 Findings</p>
          <span className="text-xs font-sans text-white/40">Trial Transcript Vol. 1</span>
        </div>
        {[
          {
            title: "Miranda Rights Waiver — Invocation Ambiguity",
            excerpt: '"I think I might want a lawyer" — Officer: "Are you sure?" — Suspect: "I guess not..."',
            vehicle: "Federal Habeas § 2254",
            strength: "Strong",
            color: "text-emerald-300 bg-emerald-900/60 border-emerald-700/50",
          },
          {
            title: "Brady Violation — Suppressed Lab Report",
            excerpt: "DA File Index, Item 22: 'Hair analysis — inconclusive' — Never disclosed to defense",
            vehicle: "Brady/Giglio Motion",
            strength: "Strong",
            color: "text-emerald-300 bg-emerald-900/60 border-emerald-700/50",
          },
          {
            title: "Ineffective Assistance — Failure to Investigate Alibi",
            excerpt: "Counsel notes: 'Alibi witness not contacted per client request' — No record of advice given",
            vehicle: "§ 974.06 Motion",
            strength: "Moderate",
            color: "text-amber-300 bg-amber-900/50 border-amber-700/40",
          },
        ].map((f, i) => (
          <div key={i} className="bg-[#1a2744] border border-white/10 rounded px-4 py-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="text-white text-sm font-sans leading-snug">{f.title}</span>
              <span className={`shrink-0 text-xs font-sans px-2 py-0.5 rounded border ${f.color}`}>{f.strength}</span>
            </div>
            <p className="text-white/50 text-xs font-sans italic leading-relaxed">"{f.excerpt}"</p>
            <span className="inline-block text-xs font-sans px-2 py-0.5 rounded bg-[#243060] text-[#c8a96e] border border-[#c8a96e]/30">{f.vehicle}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Simulate the Court",
    step: "03",
    panel: () => (
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-sans uppercase tracking-widest text-[#c8a96e]">Court Simulation — Round 2 of 4</p>
          <span className="text-xs font-sans text-white/40">Federal Habeas § 2254</span>
        </div>
        <div className="bg-red-950/40 border border-red-800/40 rounded px-4 py-3">
          <p className="text-xs font-sans uppercase tracking-widest text-red-400 mb-2">The State</p>
          <p className="text-white/80 text-sm font-serif leading-relaxed italic">
            "Defense counsel's failure to contact the alibi witness was a strategic decision entitled to deference under Strickland. There is no reasonable probability a single alibi witness would have changed the outcome given three eyewitness identifications."
          </p>
        </div>
        <div className="bg-[#1a2744] border border-white/20 rounded px-4 py-3">
          <p className="text-xs font-sans uppercase tracking-widest text-white/50 mb-2 flex items-center gap-1.5"><Gavel className="w-3 h-3" /> The Court</p>
          <p className="text-white/70 text-sm font-serif leading-relaxed italic">
            "Counsel, the record shows no note of any advice given regarding the alibi witness. How do you distinguish this from Wiggins v. Smith, where the failure to investigate was held per se unreasonable?"
          </p>
        </div>
        <div className="bg-[#1a3a2a] border border-emerald-800/40 rounded px-4 py-3">
          <p className="text-xs font-sans uppercase tracking-widest text-emerald-400 mb-2">The Defense</p>
          <p className="text-white/80 text-sm font-serif leading-relaxed italic">
            "Under Wiggins, the failure to investigate cannot be excused without documentation of advice rendered. The record is silent — and silence defeats the presumption of strategy."
          </p>
        </div>
      </div>
    ),
  },
  {
    label: "Generate the Motion",
    step: "04",
    panel: () => (
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-sans uppercase tracking-widest text-[#c8a96e]">Generated Motion — Ready to File</p>
          <span className="text-xs font-sans px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">Complete</span>
        </div>
        <div className="bg-[#1a2744] border border-white/10 rounded px-5 py-4 space-y-3 font-serif">
          <p className="text-white/90 text-sm text-center font-bold tracking-wide">
            MOTION FOR POST-CONVICTION RELIEF<br />
            PURSUANT TO WIS. STAT. § 974.06
          </p>
          <p className="text-white/90 text-sm text-center">State v. Joseph Lagerman, Case No. 2009CF004521</p>
          <div className="border-t border-white/10 pt-3">
            <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-2">I. Introduction</p>
            <p className="text-white/70 text-xs leading-relaxed">
              Petitioner Joseph Lagerman, by counsel, respectfully moves this Court for post-conviction relief. The trial record discloses three independent constitutional violations — each independently reversible — that in combination denied Petitioner a fundamentally fair trial under <span className="text-[#c8a96e]">Chambers v. Mississippi, 410 U.S. 284 (1973)</span>...
            </p>
          </div>
          <div className="border-t border-white/10 pt-3">
            <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-2">II. Standard of Review</p>
            <p className="text-white/70 text-xs leading-relaxed">
              Constitutional claims are reviewed de novo. <span className="text-[#c8a96e]">State v. Thiel, 264 Wis. 2d 571 (2003)</span>. Ineffective assistance claims require deficiency and prejudice under <span className="text-[#c8a96e]">Strickland v. Washington, 466 U.S. 668 (1984)</span>...
            </p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button className="flex-1 text-xs font-sans py-2 rounded bg-[#c8a96e] text-[#0d1b3e] font-semibold">Download PDF</button>
          <button className="flex-1 text-xs font-sans py-2 rounded border border-white/20 text-white/70">Copy Text</button>
        </div>
      </div>
    ),
  },
];

const DemoPreview = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused]);

  const ActivePanel = DEMO_STEPS[active].panel;

  return (
    <div
      className="mt-20 rounded-xl overflow-hidden border border-white/10 shadow-2xl"
      style={{ background: "#0d1b3e" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ background: "#0a1530" }}>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white/5 rounded text-center text-xs font-sans text-white/30 py-0.5 px-3 max-w-xs mx-auto">
            best-possible.replit.app/cases/1
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* Step tabs */}
      <div className="flex border-b border-white/10" style={{ background: "#0a1530" }}>
        {DEMO_STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setPaused(true); }}
            className={`flex-1 py-2.5 px-2 text-xs font-sans transition-all duration-300 border-b-2 ${
              active === i
                ? "text-[#c8a96e] border-[#c8a96e] bg-white/5"
                : "text-white/40 border-transparent hover:text-white/70"
            }`}
          >
            <span className="hidden sm:inline">{s.step}. </span>{s.label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="min-h-[340px] md:min-h-[360px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ActivePanel />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-3 border-t border-white/10" style={{ background: "#0a1530" }}>
        {DEMO_STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setPaused(true); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              active === i ? "bg-[#c8a96e] w-5" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const AnimatedScale = () => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-secondary/20 drop-shadow-2xl"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.path
        d="M100 20 V180 M50 180 H150 M100 40 L30 80 M100 40 L170 80 M30 80 V120 M170 80 V120 M10 120 H50 M150 120 H190 M20 120 C20 140 40 140 40 120 M160 120 C160 140 180 140 180 120"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.circle
        cx="100"
        cy="20"
        r="6"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      />
    </motion.svg>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen w-full bg-background selection:bg-secondary/30 selection:text-foreground">

      {/* 1. Hero */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-6 pt-20 pb-32">
        <div className="absolute inset-0 pointer-events-none opacity-40 flex items-center justify-center scale-150">
          <div className="w-[600px] h-[600px]">
            <AnimatedScale />
          </div>
        </div>

        <motion.div
          style={{ y: yHero, opacity: opacityHero }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-8 font-serif tracking-widest uppercase text-secondary text-sm font-semibold"
          >
            CaseLight
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground leading-[1.1] mb-8"
          >
            From CaseLight <br className="hidden md:block" />to Freedom.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-sans leading-relaxed"
          >
            For the family that won't stop asking questions. For the inmate with no one to call.
            For the attorney who suspects the trial was wrong. For everyone who can't afford to give up.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={APP_URL}
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden bg-primary px-8 font-sans font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 w-full sm:w-auto"
            >
              <span className="mr-2">Begin Your Case</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={DEMO_URL}
              className="group inline-flex h-14 items-center justify-center border border-border bg-transparent px-8 font-sans font-medium text-foreground transition-all duration-300 hover:bg-muted w-full sm:w-auto"
            >
              See a Real Case
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Mission Strip */}
      <section className="bg-primary text-primary-foreground py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-4xl font-serif leading-snug">
              Most people who have been wronged by the legal system never find out — not because
              the evidence isn't there, but because no one looked hard enough.
            </h2>
          </FadeIn>
        </div>
      </section>

      {/* 3. What CaseLight Is */}
      <section className="py-24 md:py-32 px-6 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-8 text-center">What CaseLight Is</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.15] mb-10">
              Not a lawyer. Not a miracle.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed mb-6 max-w-3xl">
              CaseLight doesn't tell you what you want to hear. It reads every page of the record —
              every transcript, every motion, every police report — and flags the moments where
              the legal system may have failed: procedural violations, withheld evidence,
              unchallenged constitutional errors, rights that were never enforced.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed mb-10 max-w-3xl">
              Whether you're a family member who can't afford an attorney, an inmate with nothing
              but time and determination, or an appellate lawyer building the strongest brief
              of your career — CaseLight makes sure you don't miss what matters.
            </p>
            <p className="font-serif text-xl md:text-2xl text-foreground italic">
              CaseLight doesn't give false hope; but CaseLight won't stop at "No."
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 4. Who This Is For */}
      <section className="py-32 px-6 bg-muted border-y border-border">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <span className="text-secondary font-sans font-bold tracking-widest uppercase mb-4 text-sm block">Who This Is For</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">Everyone the system left behind.</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <FadeIn delay={0.1} className="bg-background border border-border p-8 md:p-10">
              <div className="flex items-center gap-3 mb-5">
                <User className="w-5 h-5 text-secondary shrink-0" />
                <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground">The Incarcerated</p>
              </div>
              <p className="font-serif text-lg text-foreground leading-relaxed">
                You have the records. You've read them until the words blur. CaseLight reads them
                differently — not as someone who is tired or afraid, but as a system that was
                built specifically to find what people miss.
              </p>
            </FadeIn>

            <FadeIn delay={0.15} className="bg-background border border-border p-8 md:p-10">
              <div className="flex items-center gap-3 mb-5">
                <Heart className="w-5 h-5 text-secondary shrink-0" />
                <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground">Families &amp; Advocates</p>
              </div>
              <p className="font-serif text-lg text-foreground leading-relaxed">
                You know something went wrong. You've been told to move on, accept the outcome,
                trust the process. CaseLight gives you the specific language — the findings,
                the precedents, the procedural arguments — to stop being dismissed.
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="bg-background border border-border p-8 md:p-10">
              <div className="flex items-center gap-3 mb-5">
                <Scale className="w-5 h-5 text-secondary shrink-0" />
                <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground">Defense Attorneys &amp; Public Defenders</p>
              </div>
              <p className="font-serif text-lg text-foreground leading-relaxed">
                You have the caseload and the cases keeping you up at night. CaseLight does
                the discovery pass — flagging every error, categorizing by legal weight,
                mapping to precedent — so your hours go to strategy, not search.
              </p>
            </FadeIn>

            <FadeIn delay={0.25} className="bg-background border border-border p-8 md:p-10">
              <div className="flex items-center gap-3 mb-5">
                <BookOpen className="w-5 h-5 text-secondary shrink-0" />
                <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground">Appellate &amp; Post-Conviction Counsel</p>
              </div>
              <p className="font-serif text-lg text-foreground leading-relaxed">
                AEDPA deadlines. Procedural bars. Exhaustion requirements. CaseLight tracks
                the federal readiness of every claim, models each argument through adversarial
                court simulation, and generates the cumulative error brief before you file.
              </p>
              <p className="font-serif text-lg text-foreground/60 mt-5 italic">
                Start at the finish line of discovery, not the starting blocks.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <div className="bg-primary text-primary-foreground p-10 md:p-16 text-center">
              <span className="text-secondary font-sans text-xs uppercase tracking-widest mb-8 block">The Equalizer</span>
              <h3 className="font-serif text-3xl md:text-4xl mb-8 leading-snug">
                Access to justice should not be a function of income.
              </h3>
              <p className="font-sans text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Every finding CaseLight surfaces is a finding that exists in the record —
                whether you can afford a hundred hours of attorney review or not.
                The facts don't change based on who's looking. Now anyone can look.
              </p>
              <p className="font-serif text-xl text-secondary italic">
                From CaseLight to Freedom.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-32 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex flex-col items-center text-center mb-20">
              <span className="text-secondary font-sans font-bold tracking-widest uppercase mb-4 text-sm">How It Works</span>
              <h2 className="text-4xl md:text-5xl font-serif">Four steps from record to relief.</h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-[1px] bg-border z-0" />

            {[
              {
                step: "01",
                icon: FileText,
                title: "Upload Documents",
                desc: "Add any case file — transcripts, motions, police reports — in any format.",
              },
              {
                step: "02",
                icon: BrainCircuit,
                title: "AI Finds Issues",
                desc: "CaseLight reads every page and flags constitutional errors, withheld evidence, and procedural violations.",
              },
              {
                step: "03",
                icon: Gavel,
                title: "Simulate the Court",
                desc: "Run your arguments against an adversarial judge and the State before anything is filed.",
              },
              {
                step: "04",
                icon: Sparkles,
                title: "Generate the Motion",
                desc: "Export a court-ready brief with citations, precedents, and cumulative error arguments built in.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.15} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-background border border-border flex items-center justify-center mb-6 transition-colors duration-500 group-hover:border-secondary group-hover:bg-muted">
                  <span className="text-secondary font-serif text-xl">{item.step}</span>
                </div>
                <item.icon className="w-7 h-7 text-foreground/50 mb-5" />
                <h3 className="text-xl font-serif mb-3">{item.title}</h3>
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <DemoPreview />
          </FadeIn>
        </div>
      </section>

      {/* 6. Three Feature Pillars */}
      <section className="py-32 px-6 bg-muted border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                title: "The Finding Classifier",
                desc: "Turns thousands of pages into a prioritized list of issues. Every error is mapped to a legal category, rated for strength, and tied to the exact line in the record.",
                icon: BrainCircuit,
              },
              {
                title: "Cumulative Error Brief + Strategic Roadmap",
                desc: "Individual errors are often dismissed. Combined, they can win. CaseLight builds the cumulative argument automatically and generates a state-by-state roadmap of remaining relief options.",
                icon: BarChart3,
              },
              {
                title: "The Court Simulator",
                desc: "Before anyone files anything, CaseLight runs your case through an adversarial simulation — the State argues back, the judge is skeptical, and you see every weakness before it counts.",
                icon: Shield,
              },
            ].map((feature, i) => (
              <FadeIn key={i} delay={i * 0.15} className="bg-background p-10 border border-border transition-all duration-300 hover:border-secondary hover:-translate-y-1">
                <feature.icon className="w-10 h-10 text-secondary mb-8" />
                <h3 className="text-2xl font-serif mb-4">{feature.title}</h3>
                <p className="text-muted-foreground font-sans leading-relaxed">{feature.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Integrity Statement */}
      <section className="bg-primary text-primary-foreground py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-secondary mb-8">
              <Scale className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif leading-[1.3] mb-8">
              "CaseLight doesn't give false hope; but CaseLight won't stop at 'No.'"
            </h2>
            <p className="text-primary-foreground/60 font-sans text-lg max-w-2xl mx-auto">
              If the record shows no viable argument, CaseLight will tell you that. But until
              every door has been opened — state court, federal court, clemency, actual
              innocence — CaseLight keeps looking.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-primary text-primary-foreground py-16 px-6 border-t border-primary-foreground/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="font-serif tracking-widest uppercase text-secondary text-xl font-bold mb-2">CaseLight</div>
            <p className="text-primary-foreground/60 font-sans text-sm tracking-wide">From CaseLight to Freedom.</p>
          </div>

          <div className="text-center md:text-right max-w-sm">
            <p className="text-primary-foreground/40 text-xs font-sans leading-relaxed mb-6">
              CaseLight provides structural analysis of legal documents to assist in advocacy. It does not provide legal advice or establish attorney-client privilege. All findings should be reviewed by a licensed attorney before filing.
            </p>
            <a
              href={APP_URL}
              className="inline-flex h-10 items-center justify-center border border-secondary text-secondary hover:bg-secondary hover:text-primary transition-colors px-6 font-sans text-sm uppercase tracking-wider"
            >
              Begin Your Case
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
