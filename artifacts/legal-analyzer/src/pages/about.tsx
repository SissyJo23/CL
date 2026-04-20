import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Search, Scale, Layers, User, Heart, BookOpen, Users } from "lucide-react";

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
            <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground">Our Mission</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
              From CaseLight to Freedom
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              CaseLight exists for one reason: to make sure no one is left behind by the legal
              system simply because they didn't have the resources, the time, or the expertise
              to find every available argument.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              The facts in a case record don't change based on who's reading them.
              A constitutional violation buried on page 800 of a transcript is just as real
              whether it was found by a $500-an-hour appellate attorney or by CaseLight at
              two in the morning by a family that refuses to give up.
            </p>
          </div>
        </section>

        {/* Who CaseLight Is For */}
        <section className="py-16 px-4 border-b border-border/50 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <p className="text-center font-sans text-xs tracking-widest uppercase text-muted-foreground mb-10">Who This Is For</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm tracking-wide">The Incarcerated</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You have the records. You've read them until the words blur. CaseLight finds
                  what exhausted eyes miss — and tells you plainly what it found.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm tracking-wide">Families &amp; Advocates</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You've been told to accept the outcome. CaseLight gives you the specific
                  language — findings, precedents, procedural arguments — to stop being dismissed.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm tracking-wide">Defense Attorneys</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You carry the caseload. CaseLight carries the discovery pass — so your
                  hours go to strategy and advocacy, not page-by-page search.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm tracking-wide">Appellate Counsel</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AEDPA deadlines, procedural bars, federal exhaustion. CaseLight maps the
                  entire post-conviction roadmap — state by state — and flags which claims
                  are federal-ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Capabilities */}
        <section className="py-16 px-4 border-b border-border/50">
          <div className="max-w-5xl mx-auto">
            <p className="text-center font-sans text-xs tracking-widest uppercase text-muted-foreground mb-10">What CaseLight Does</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm tracking-wide">Reads the Whole Record</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  CaseLight reads every page — transcripts, police reports, motions, court
                  orders — against 24 legal categories. It flags procedural violations,
                  withheld evidence, and constitutional errors that human review might miss.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm tracking-wide">Builds the Argument</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Individual errors often fail. Combined, they can succeed. CaseLight synthesizes
                  every finding into a cumulative error brief and generates a state-by-state
                  roadmap of remaining relief options — from direct appeal to federal habeas.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm tracking-wide">Tests It Before Filing</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Before anything is filed, CaseLight simulates the argument in front of a
                  skeptical judge — with the State arguing back across multiple rounds.
                  You see every weakness before it counts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Won't Stop */}
        <section className="py-16 px-4 border-b border-border/50">
          <div className="max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
              CaseLight is honest. If the record shows no viable argument, it will tell you —
              clearly, without softening it. That honesty is what makes a real finding mean
              something. You don't have to wonder whether CaseLight would've said no just as
              easily as yes.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              But until every avenue has been exhausted — state court, federal court, clemency,
              actual innocence — CaseLight doesn't stop. The goal is not to file something.
              The goal is to find something that can win.
            </p>
          </div>
        </section>

        {/* Integrity Statement */}
        <section className="py-20 px-4 bg-foreground text-background">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
              CaseLight doesn't give false hope;
            </h2>
            <p className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight opacity-70">
              but CaseLight won't stop at "No."
            </p>
            <p className="text-base sm:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto pt-4">
              The justice system is built on procedure, precedent, and argument.
              CaseLight gives every person — regardless of their resources — access to
              the same quality of discovery, analysis, and strategic preparation that
              has historically only been available to those who could pay for it.
            </p>
            <p className="font-serif text-xl sm:text-2xl leading-snug pt-4">
              This is the justice we deserve.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 border-b border-border/50 bg-background">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="font-serif text-xl sm:text-2xl text-foreground">
              Your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={APP_URL}
                className="inline-flex h-11 items-center justify-center bg-foreground text-background px-8 font-sans font-medium text-sm tracking-wide hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                Begin Your Case
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
