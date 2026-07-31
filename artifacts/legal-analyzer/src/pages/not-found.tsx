import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
            <FileQuestion className="w-8 h-8 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
              Page Not Found
            </h1>
            <p className="text-muted-foreground text-base">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/">
              <Button size="lg" className="rounded-full px-8" data-testid="button-home">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Disclaimer />
    </div>
  );
}
