import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetRecentCase } from "@workspace/api-client-react";

export default function Home() {
  const { data, isLoading, error } = useGetRecentCase();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <main className="flex-1 p-6 space-y-6">
        <p>Welcome to CaseLight.</p>

        {/* Loading state */}
        {isLoading && (
          <p className="text-muted-foreground">Loading your recent case...</p>
        )}

        {/* Error state (prevents blank screen) */}
        {error && (
          <p className="text-red-500">
            Could not load recent case. (This will not break the page.)
          </p>
        )}

        {/* Recent case */}
        {!isLoading && data?.case && (
          <Link href={`/cases/${data.case.id}`}>
            <Button size="lg" className="rounded-full px-8">
              Continue Where You Left Off
            </Button>
          </Link>
        )}

        {/* If no case exists */}
        {!isLoading && !data?.case && (
          <Link href="/cases/new">
            <Button size="lg" className="rounded-full px-8">
              Create Your First Case
            </Button>
          </Link>
        )}
      </main>

      <Disclaimer />
    </div>
  );
}
