import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, ChevronRight, Scale, Shield, BarChart3, Gavel, FileCheck, BrainCircuit, Activity } from "lucide-react";

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
            Stop guessing how <br className="hidden md:block" />a judge will rule.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-sans leading-relaxed"
          >
            Upload your transcripts. Surface every legal error. Run your case through the gauntlet before you file.
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
              <span className="mr-2">Open the App</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={DEMO_URL}
              className="group inline-flex h-14 items-center justify-center border border-border bg-transparent px-8 font-sans font-medium text-foreground transition-all duration-300 hover:bg-muted w-full sm:w-auto"
            >
              See the Demo
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Problem Strip */}
      <section className="bg-primary text-primary-foreground py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-4xl font-serif leading-snug">
              Most post-conviction motions fail before the merits are even heard — not because the argument is wrong, but because it wasn't stress-tested first.
            </h2>
          </FadeIn>
        </div>
      </section>

      {/* 3. How it works */}
      <section className="py-32 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="flex flex-col items-center text-center mb-24">
              <span className="text-secondary font-sans font-bold tracking-widest uppercase mb-4 text-sm">Process</span>
              <h2 className="text-4xl md:text-5xl font-serif">Rigorous. Precise. Immediate.</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-border z-0" />

            {[
              {
                step: "01",
                title: "Upload",
                desc: "Add transcripts, motions, police reports, and court orders.",
                icon: FileText,
              },
              {
                step: "02",
                title: "Analyze",
                desc: "CaseLight reads every page against 24 legal categories, extracting every finding with citations, precedents, and legal weight.",
                icon: Activity,
              },
              {
                step: "03",
                title: "Simulate",
                desc: "Run 4+ adversarial rounds against The State before a Skeptical Judge; see the ruling before you file the brief.",
                icon: Gavel,
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.2} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-background border border-border flex items-center justify-center mb-8 transition-colors duration-500 group-hover:border-secondary group-hover:bg-muted">
                  <span className="text-secondary font-serif text-2xl">{item.step}</span>
                </div>
                <item.icon className="w-8 h-8 text-foreground/50 mb-6" />
                <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
                <p className="text-muted-foreground font-sans leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Three Feature Pillars */}
      <section className="py-32 px-6 bg-muted border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                title: "The Finding Classifier",
                desc: "Turns thousands of pages into a prioritized dataset. Instantly maps the factual record to legal categories.",
                icon: BrainCircuit,
              },
              {
                title: "Cumulative Error Brief + Strategic Roadmap",
                desc: "The combined weight of trial errors often wins what individual errors can't. A strategic roadmap generated automatically.",
                icon: BarChart3,
              },
              {
                title: "The Court Simulator",
                desc: "Adversarial, standards-based, skeptic judge. 4 modes to pressure-test your arguments before a real judge ever sees them.",
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

      {/* 5. Integrity Statement */}
      <section className="bg-primary text-primary-foreground py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-secondary mb-8">
              <Scale className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif leading-[1.3] mb-8">
              "CaseLight is designed to say No. If the case lacks merit, the app tells you. That's what makes a win mean something."
            </h2>
          </FadeIn>
        </div>
      </section>

      {/* 6. Proof of Concept */}
      <section className="py-32 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Proof of Concept</h2>
              <p className="text-muted-foreground font-sans">Tested against real appellate records.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <FadeIn delay={0.1} className="border border-border p-8 bg-muted relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <span className="inline-block px-3 py-1 bg-border text-foreground text-xs font-sans uppercase tracking-widest">State Win</span>
              </div>
              <h3 className="text-xl font-serif mb-6 text-foreground">Test Case 1</h3>
              <p className="text-muted-foreground font-sans leading-relaxed mb-6">
                Demonstrated correct application of Escalona-Naranjo procedural bars; no merit found.
              </p>
              <div className="flex items-center text-sm font-sans text-foreground/70 group-hover:text-secondary transition-colors">
                <FileCheck className="w-4 h-4 mr-2" /> Verified Accurate
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="border border-border p-8 bg-muted relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <span className="inline-block px-3 py-1 bg-secondary text-primary text-xs font-sans uppercase tracking-widest font-bold">Defense Win</span>
              </div>
              <h3 className="text-xl font-serif mb-6 text-foreground">Test Case 2</h3>
              <p className="text-muted-foreground font-sans leading-relaxed mb-6">
                Surfaced Brady violations, Strickland deficiency, Bangert plea colloquy defects; judge ordered a Machner hearing.
              </p>
              <div className="flex items-center text-sm font-sans text-foreground/70 group-hover:text-secondary transition-colors">
                <FileCheck className="w-4 h-4 mr-2" /> Verified Accurate
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} className="text-center">
            <p className="text-xl font-serif text-muted-foreground italic">"The app doesn't pick sides. It reads the record."</p>
          </FadeIn>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-primary text-primary-foreground py-16 px-6 border-t border-primary-foreground/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="font-serif tracking-widest uppercase text-secondary text-xl font-bold mb-2">CaseLight</div>
            <p className="text-primary-foreground/60 font-sans text-sm tracking-wide">Privileged &amp; Confidential — Attorney Work-Product.</p>
          </div>

          <div className="text-center md:text-right max-w-sm">
            <p className="text-primary-foreground/40 text-xs font-sans leading-relaxed mb-6">
              CaseLight provides structural analysis of legal documents to assist in advocacy. It does not provide legal advice or establish attorney-client privilege. Review all citations and analysis independently.
            </p>
            <a
              href={APP_URL}
              className="inline-flex h-10 items-center justify-center border border-secondary text-secondary hover:bg-secondary hover:text-primary transition-colors px-6 font-sans text-sm uppercase tracking-wider"
            >
              Open App
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
