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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Page Container */}
      <div className="max-w-5xl w-full mx-auto px-6 py-12 flex-1">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Manage and analyze your legal cases.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <h2 className="text-lg font-medium text-slate-800 mb-4">
            Start a New Case
          </h2>

          <Link href="/cases/new">
            <Button size="lg" className="rounded-xl px-8">
              Create Case
            </Button>
          </Link>
        </div>

        {/* Recent Case */}
        {recentCase && (
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-lg font-medium text-slate-800 mb-4">
              Continue Where You Left Off
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-slate-900">
                  {recentCase.title}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Resume analysis and drafting.
                </p>
              </div>

              <Button variant="outline" className="rounded-xl">
                Open Case
              </Button>
            </div>
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}
