import { useLocation, Link } from "wouter";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLogin() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-2">
            <Scale className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            CaseLight
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your case workspaces
          </p>
        </div>

        <div className="rounded-lg border border-card-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-center text-sm leading-6 text-muted-foreground">
            Password access is not enabled in this version. Open the working demo workspace to explore the document analysis flow.
          </p>
          <Button className="mt-6 h-12 w-full shadow-sm" onClick={() => setLocation("/demo")}>
            Open the CaseLight Demo
          </Button>
          <div className="mt-5 text-center">
            <Link href="/about" className="text-sm font-medium text-primary underline underline-offset-4">
              Learn how CaseLight works
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          CaseLight provides forensic legal analysis to assist advocates.
          <br />
          Use of this system is subject to terms of service.
        </p>
      </div>
    </div>
  );
}
