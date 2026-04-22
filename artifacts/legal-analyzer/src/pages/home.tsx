import { Link } from "wouter";
import { useGetRecentCase } from "@workspace/api-client-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Scale, FileText } from "lucide-react";

export default function Home() {
  const { data, isLoading } = useGetRecentCase();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">

      {/* Confidential Banner */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-center gap-2 text-xs text-slate-200 font-medium tracking-wide">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <span>PRIVILEGED & CONFIDENTIAL — ATTORNEY WORK-PRODUCT — DO NOT DISCLOSE</span>
        <ShieldCheck className="w-3.5 h-3.5 text-slate-300 shrink-0" />
      </div>

      <Navbar />

      <main className="flex-1">

        {/* Hero Section */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">

            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-foreground leading-tight">
              CaseLight
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Analyze transcripts. Surface reversible error. Draft motions that withstand scrutiny.
            </p>

            {/* Three Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">

              <Link href="/cases/new">
                <Button className="h-14 px-8 rounded-full text-base">
                  Create Case
                </Button>
              </Link>

              {!isLoading && data?.case && (
                <Link href={`/cases/${data.case.id}`}>
                  <Button
                    variant="outline"
                    className="h-14 px-8 rounded-full text-base"
                  >
                    Continue Where You Left Off
                  </Button>
                </Link>
              )}

              <Link href="/demo">
                <Button
                  variant="ghost"
                  className="h-14 px-8 rounded-full text-base"
                >
                  Explore Sample Case
                </Button>
              </Link>

            </div>
          </div>
        </section>

        {/* Resume Strip */}
        {!isLoading && data?.case && (
          <section className="bg-muted border-y border-border py-6">
            <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Most Recent Case</p>
                <p className="font-medium text-foreground">{data.case.title}</p>
              </div>
              <Link href={`/cases/${data.case.id}`}>
                <Button variant="secondary" className="rounded-full px-6">
                  Resume Work
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">

            <h2 className="text-center font-serif text-2xl sm:text-3xl font-medium text-foreground mb-12">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              <div className="bg-card border border-border rounded-xl p-6">
                <FileText className="w-5 h-5 mb-3 text-muted-foreground" />
                <h3 className="font-semibold text-foreground mb-2">Upload the Record</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add transcripts, rulings, and filings. CaseLight reads every page.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <Scale className="w-5 h-5 mb-3 text-muted-foreground" />
                <h3 className="font-semibold text-foreground mb-2">Analyze the Law</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Errors are categorized and evaluated against procedural standards.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <ShieldCheck className="w-5 h-5 mb-3 text-muted-foreground" />
                <h3 className="font-semibold text-foreground mb-2">Strengthen the Argument</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Simulate opposition before filing. Reinforce weaknesses before court.
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
