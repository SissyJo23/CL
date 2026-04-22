import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
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
      </main>

      <Disclaimer />
    </div>
  );
}
