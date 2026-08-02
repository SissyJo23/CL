import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Scale, FileText, Clock, Plus } from "lucide-react";
import { useListCases } from "@workspace/api-client-react";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
}

export default function Home() {
  const { data: cases, isLoading } = useListCases();
  // Show max 4 recent cases
  const recentCases = cases?.slice(0, 4) || [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">

        {/* Navy Hero Panel */}
        <section className="bg-foreground text-background rounded-sm overflow-hidden shadow-sm relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent"></div>
          <div className="relative z-10 px-8 py-12 md:px-12 md:py-16 flex flex-col items-start max-w-3xl">
            <div className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
                <Scale className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-medium tracking-wide text-background/90 uppercase">
                CaseLight Workspace
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal leading-[1.15] mb-5">
              Every case deserves<br />a second look
            </h1>
            <p className="text-base sm:text-lg text-background/80 font-serif max-w-2xl leading-relaxed mb-8">
              Analyze transcripts, surface reversible error, and draft motions that withstand scrutiny. Build your appellate strategy structurally.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/cases/new">
                <Button size="lg" className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm shadow-none font-medium" data-testid="button-create-case">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Case
                </Button>
              </Link>
              <Link href="/cases">
                <Button variant="outline" size="lg" className="h-12 px-8 border-background/30 text-background hover:bg-background/10 rounded-sm shadow-none font-medium" data-testid="button-view-cases">
                  View All Cases
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* RECENT Strip */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h2 className="font-serif text-lg font-medium text-foreground tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Recent Workspaces
            </h2>
            <Link href="/cases" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-36 bg-card border border-border/50 rounded-sm animate-pulse"></div>
              ))}
            </div>
          ) : recentCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentCases.map((c) => (
                <Link key={c.id} href={`/cases/${c.id}`}>
                  <div className="group h-full bg-card border border-border/80 p-5 rounded-sm shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[9rem]">
                    <div>
                      <h3 className="font-serif font-medium text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 font-serif">
                        {c.notes || "No case notes yet."}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
                      <span className="uppercase tracking-wider font-medium">{c.jurisdiction || "No jurisdiction"}</span>
                      <span>{formatDate(c.updatedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border border-dashed p-8 rounded-sm text-center">
              <p className="text-muted-foreground font-serif">No cases found. Create a new case to get started.</p>
            </div>
          )}
        </section>

        {/* Restrained How It Works */}
        <section className="bg-card border border-border shadow-sm rounded-sm p-8 sm:p-10 mb-8 mt-4">
          <div className="mb-8 border-b border-border/80 pb-4">
            <h2 className="font-serif text-xl font-medium text-foreground">
              Methodology
            </h2>
            <p className="text-muted-foreground text-sm font-serif mt-1">
              CaseLight structures your work so nothing gets lost in the record.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Index the Record
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-serif">
                Upload transcripts and rulings. Each document is indexed so you can trace every claim directly back to the source text.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                <Scale className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Surface Error
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-serif">
                Identify procedural missteps and constitutional issues. Every error is categorized and evaluated against precedent.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Build Strategy
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-serif">
                Simulate the State's response. Know where your argument holds and where it needs reinforcement before you file.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Disclaimer />
    </div>
  );
}
