import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Scale, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-foreground leading-tight">
              CaseLight
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Analyze transcripts. Surface reversible error. Draft motions that withstand scrutiny.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/cases/new">
                <Button className="h-14 px-8 rounded-full text-base">
                  Create Case
                </Button>
              </Link>

              <Link href="/cases">
                <Button variant="outline" className="h-14 px-8 rounded-full text-base">
                  View Cases
                </Button>
              </Link>

              <Link href="/cases/new">
                <Button variant="ghost" className="h-14 px-8 rounded-full text-base">
                  Start Analysis
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Resume Strip */}
        <section className="bg-muted border-y border-border py-8">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Resume Your Work
              </p>
              <p className="font-medium text-foreground mt-0.5">
                Continue your most recent case.
              </p>
            </div>
            <Link href="/cases">
              <Button variant="secondary" className="rounded-full px-8">
                Resume
              </Button>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center font-serif text-2xl sm:text-3xl font-medium text-foreground mb-16">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-xl p-8 space-y-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">
                  Upload the Record
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add transcripts, rulings, and filings to build a complete picture of the case.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-8 space-y-3">
                <Scale className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">
                  Analyze the Law
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every error is identified, categorized, and evaluated against binding precedent.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-8 space-y-3">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">
                  Strengthen the Argument
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Simulate the State's opposition before you file. Know where your argument holds.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Disclaimer />
    </div>
  );
}
