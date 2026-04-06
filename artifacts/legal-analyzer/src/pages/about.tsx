import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-border/50 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="text-xs tracking-widest uppercase font-medium">
              About CaseLight
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
              Stop guessing how a judge will rule.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              CaseLight is a precision legal analysis tool built for post-conviction defense
              attorneys, investigators, and advocates. It reads your case documents the way a
              trained appellate eye would — line by line, across 24 recognized legal categories —
              then stress-tests your arguments against an adversarial court before you ever file.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 border-b border-border/50">
          <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-center text-foreground">
              How It Works
            </h2>
            <ol className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Upload your documents",
                  description:
                    "Add transcripts, motions, police reports, orders — any case material you have. CaseLight accepts multiple files and keeps them organized by case.",
                },
                {
                  step: "2",
                  title: "Line-by-line analysis across 24 legal categories",
                  description:
                    "CaseLight audits every page of your documents, extracting and categorizing findings by legal weight — Brady violations, ineffective assistance of counsel, Fourth Amendment issues, and 21 more recognized post-conviction grounds.",
                },
                {
                  step: "3",
                  title: "Run the court simulator before you file",
                  description:
                    "Pressure-test your argument with 4+ adversarial simulation rounds. The State argues back. A skeptical judge evaluates. You discover weaknesses before they appear in a real courtroom.",
                },
              ].map(({ step, title, description }) => (
                <li key={step} className="flex gap-5">
                  <span className="font-serif text-3xl font-semibold text-primary leading-none shrink-0 w-8">
                    {step}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-medium text-foreground text-base">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16 px-4 border-b border-border/50 bg-muted/30">
          <div className="max-w-5xl mx-auto space-y-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-center text-foreground">
              Three Pillars
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <Badge variant="secondary" className="w-fit text-xs mb-2">
                    Pillar One
                  </Badge>
                  <CardTitle className="font-serif text-lg font-semibold leading-snug">
                    The Finding Classifier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Audits every page of your case documents, extracts findings, and categorizes
                    each one by legal weight — Brady, IAC, Fourth Amendment, and 21 more
                    recognized categories of post-conviction error.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <Badge variant="secondary" className="w-fit text-xs mb-2">
                    Pillar Two
                  </Badge>
                  <CardTitle className="font-serif text-lg font-semibold leading-snug">
                    Cumulative Error &amp; Strategic Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Individual errors lose. The cumulative effect often wins. CaseLight synthesizes
                    every finding into a cumulative error brief and a prioritized strategic roadmap
                    for your motion.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <Badge variant="secondary" className="w-fit text-xs mb-2">
                    Pillar Three
                  </Badge>
                  <CardTitle className="font-serif text-lg font-semibold leading-snug">
                    The Court Simulator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Four or more adversarial rounds with the State arguing back and a skeptical
                    judge evaluating. Supports four motion types: PC 974, Direct Appeal, Federal
                    Habeas, and Bangert motions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 border-b border-border/50 bg-foreground text-background">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="font-serif text-3xl sm:text-4xl font-semibold leading-snug">
              "Not a proofreader."
            </p>
            <p className="text-base sm:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              CaseLight doesn't fix grammar or polish language. It finds the moments when the
              legal system may have failed — procedural violations, withheld evidence, unchallenged
              constitutional errors, rights that were never enforced.
            </p>
            <p className="text-base sm:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              Whether those failures were intentional or accidental doesn't change what they are.
              What matters is that they belong in the record — and that the person affected has
              the ability to bring them to the court's attention.
            </p>
            <p className="font-serif text-xl italic opacity-60 pt-2">
              That is what CaseLight does.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 border-b border-border/50">
          <div className="max-w-3xl mx-auto">
            <blockquote className="relative rounded-xl border border-border/60 bg-slate-50 dark:bg-slate-900/40 p-8 sm:p-10">
              <div className="absolute top-6 left-7 font-serif text-5xl text-primary/20 leading-none select-none" aria-hidden="true">
                &ldquo;
              </div>
              <p className="font-serif text-lg sm:text-xl text-foreground leading-relaxed pl-6 italic">
                CaseLight isn't a win button — it's a precision instrument. If the case lacks
                merit for post-conviction relief, the app will say so. By providing a realistic,
                skeptical simulation, it saves time and resources by identifying which cases have
                a genuine path and which ones do not.
              </p>
              <footer className="mt-6 pl-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                The Integrity Statement
              </footer>
            </blockquote>
          </div>
        </section>
      </main>

      <Disclaimer />
    </div>
  );
}
