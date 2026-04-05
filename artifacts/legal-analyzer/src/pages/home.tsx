import { Link } from "wouter";
import { useGetRecentCase } from "@workspace/api-client-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data, isLoading } = useGetRecentCase();

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground font-medium leading-tight">
            Just because you didn't get justice doesn't mean you don't deserve it.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A quiet, determined partner that shows up when no one else would. 
            We read every word, find every angle, and fight like it matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/cases/new" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full" data-testid="button-create-case">
                Create Case
              </Button>
            </Link>

            {!isLoading && data?.case && (
              <Link href={`/cases/${data.case.id}`} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full" data-testid="button-continue-case">
                  Continue Where You Left Off
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
