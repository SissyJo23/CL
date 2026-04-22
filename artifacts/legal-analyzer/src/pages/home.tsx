import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const [recentCase, setRecentCase] = useState<any>(null);

  useEffect(() => {
    fetch("https://caselight-api.onrender.com/cases/recent")
      .then((res) => res.json())
      .then((data) => {
        setRecentCase(data.case);
      })
      .catch((err) => {
        console.error("Failed to load recent case:", err);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <main className="flex-1 p-6 space-y-6">
        <p>Welcome to CaseLight.</p>

        <Link href="/cases/new">
          <Button size="lg" className="rounded-full px-8">
            Create Case
          </Button>
        </Link>

        {recentCase && (
          <div className="p-4 border rounded-lg bg-muted">
            <h2 className="font-semibold">Continue Where You Left Off</h2>
            <p className="mt-2">{recentCase.title}</p>
          </div>
        )}
      </main>

      <Disclaimer />
    </div>
  );
}
