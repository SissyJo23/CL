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
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-6 py-16 flex-1">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-semibold text-[#0B1C2D] tracking-tight">
            Stop guessing how a judge will rule.
          </h1>
          <p className="text-[#3E4C59] mt-6 text-lg max-w-2xl mx-auto">
            Upload your transcripts. Surface every legal error. 
            Run your case through the gauntlet before you file.
          </p>

          <div className="mt-10">
            <Link href="/cases/new">
              <Button className="bg-[#0B1C2D] hover:bg-[#132B44] text-white px-10 py-6 rounded-full text-lg">
                Create Case
              </Button>
            </Link>
          </div>
        </div>

        {/* Continue Section */}
        {recentCase && (
          <div className="bg-white rounded-2xl shadow-md border border-[#E4DED2] p-8 mb-16">
            <h2 className="text-xl font-semibold text-[#0B1C2D] mb-4">
              Continue Where You Left Off
            </h2>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-lg font-medium text-[#0B1C2D]">
                  {recentCase.title}
                </p>
                <p className="text-[#5F6C7B] mt-1">
                  Resume analysis and drafting.
                </p>
              </div>

              <Button
                variant="outline"
                className="border-[#0B1C2D] text-[#0B1C2D] rounded-full px-6"
              >
                Open Case
              </Button>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#0B1C2D] mb-10">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div>
              <div className="text-[#0B1C2D] font-semibold mb-3">1</div>
              <h3 className="font-medium text-[#0B1C2D] mb-2">
                Upload
              </h3>
              <p className="text-[#5F6C7B]">
                Add transcripts, motions, orders, and reports to the record.
              </p>
            </div>

            <div>
              <div className="text-[#0B1C2D] font-semibold mb-3">2</div>
              <h3 className="font-medium text-[#0B1C2D] mb-2">
                Analyze
              </h3>
              <p className="text-[#5F6C7B]">
                CaseLight reads every page against legal categories.
              </p>
            </div>

            <div>
              <div className="text-[#0B1C2D] font-semibold mb-3">3</div>
              <h3 className="font-medium text-[#0B1C2D] mb-2">
                Simulate
              </h3>
              <p className="text-[#5F6C7B]">
                Run adversarial rounds before filing.
              </p>
            </div>

          </div>
        </div>

      </div>

      <Disclaimer />
    </div>
  );
}
