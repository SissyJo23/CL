import { useParams, Link } from "wouter";
import { useGetMotion, getGetMotionQueryKey } from "@workspace/api-client-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Printer, Download } from "lucide-react";

export default function MotionShow() {
  const params = useParams();
  const caseId = parseInt(params.caseId || "0", 10);
  const motionId = parseInt(params.id || "0", 10);
  
  const { data: motion, isLoading } = useGetMotion(motionId, { query: { enabled: !!motionId, queryKey: getGetMotionQueryKey(motionId) } });

  const handleDownload = () => {
    if (!motion) return;
    const blob = new Blob([motion.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${motion.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl print:p-0 print:max-w-none">
        <div className="print:hidden mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <Link href={`/cases/${caseId}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Case
            </Link>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <p className="font-serif text-xl italic text-primary">
              "This motion was built from everything the record gave us. It's yours."
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-[600px] w-full mt-8" />
          </div>
        ) : motion ? (
          <div className="bg-card print:bg-white print:shadow-none print:border-none border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-8 md:p-12 font-serif text-foreground/90 leading-relaxed whitespace-pre-wrap max-w-[8.5in] mx-auto text-[11pt] md:text-[12pt] print:text-[12pt]">
              {motion.content}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">Motion not found.</div>
        )}
      </main>
      
      <div className="print:hidden">
        <Disclaimer />
      </div>
    </div>
  );
}