import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Search, Scale, Layers } from "lucide-react";

const APP_URL = "/";
const DEMO_URL = "/cases/1";

export default function About() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border/50 py-20 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
              About CaseLight
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              If you've ever spent hours combing through case files, you know the exhaustion
              and tunnel vision that can set in. Searching for critical details can feel like
              hunting for a needle in a haystack, leading to endless re-reading and
              second-guessing. Even when you find something important, the challenge of turning
              that discovery into a formal, court-recognized argument can stall your progress.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              CaseLight is designed to change that. By eliminating the risk of human fatigue,
              it provides a reliable foundation — allowing you or your attorney to start at
              the finish line of discovery, not the starting blocks.
            </p>
          </div>
        </section>

        {/* Three Feature Bullets */}
        <section className="py-16 px-4 border-b border-border/50 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm tracking-wide">Instant Illumination</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  CaseLight highlights the record immediately. Where a person might overlook a
                  conflicting statement buried deep in a transcript, CaseLight uncovers it.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm tracking-wide">Fact-Focused</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The facts — not the cost of uncovering them — are what matter. CaseLight
                  detects procedural violations, withheld evidence, and constitutional errors
                  across 24 legal categories.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm tracking-wide">Unified Arguments</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  While individual errors may not sway a case, their cumulative impact can.
                  CaseLight synthesizes findings into a prioritized roadmap, turning isolated
                  mistakes into a cohesive argument.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Court Simulator paragraph */}
        <section className="py-16 px-4 border-b border-border/50">
          <div className="max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Before you file, CaseLight simulates multiple adversarial rounds — where the
              State responds and a skeptical judge evaluates your case. This process reveals
              weaknesses in your argument before they surface in court. CaseLight isn't a
              shortcut to victory; it's a sophisticated analytical platform that clarifies
              which cases have genuine merit, helping you focus your resources where they
              matter most.
            </p>
          </div>
        </section>

        {/* Integrity Statement */}
        <section className="py-20 px-4 bg-foreground text-background">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
              Integrity Statement
            </h2>
            <p className="text-base sm:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              CaseLight uncovers moments when the legal system faltered — whether through
              procedural violations, withheld evidence, or unaddressed constitutional errors.
              The intent behind these failures is irrelevant; what matters is their presence
              in the record and the affected person's right to bring them before the court.
            </p>
            <p className="font-serif text-xl sm:text-2xl leading-snug pt-4">
              CaseLight shines a light on a system that has long been shrouded in darkness.
              This is the justice we deserve.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 border-b border-border/50 bg-background">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="font-serif text-xl sm:text-2xl text-foreground">
              Ready to see what CaseLight finds in your case?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={APP_URL}
                className="inline-flex h-11 items-center justify-center bg-foreground text-background px-8 font-sans font-medium text-sm tracking-wide hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                Open the App
              </a>
              <a
                href={DEMO_URL}
                className="inline-flex h-11 items-center justify-center border border-border bg-transparent px-8 font-sans font-medium text-sm text-foreground hover:bg-muted transition-colors w-full sm:w-auto"
              >
                Explore a Sample Case
              </a>
            </div>
          </div>
        </section>
      </main>

      <Disclaimer />
    </div>
  );
}
