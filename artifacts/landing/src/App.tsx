import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, ChevronRight, Scale, Shield, BarChart3, Gavel, BrainCircuit, Activity, Heart, User, Users, BookOpen } from "lucide-react";

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

      {/* 5. How it works */}
      <section className="py-32 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="flex flex-col items-center text-center mb-24">
              <span className="text-secondary font-sans font-bold tracking-widest uppercase mb-4 text-sm">The Process</span>
              <h2 className="text-4xl md:text-5xl font-serif">Three steps. Every avenue explored.</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-border z-0" />

            {[
              {
                step: "01",
                title: "Upload the Record",
                desc: "Add transcripts, motions, police reports, and court orders — in any format. CaseLight accepts PDFs, images, Word documents, and plain text.",
                icon: FileText,
              },
              {
                step: "02",
                title: "Surface Every Issue",
                desc: "CaseLight reads every page against 24 legal categories, extracting every finding with citations, relevant precedents, and legal weight — line by line.",
                icon: Activity,
              },
              {
                step: "03",
                title: "Test It Before You File",
                desc: "Run 4 adversarial rounds against the State before a skeptical judge. Know which arguments survive before they hit a real courtroom.",
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
