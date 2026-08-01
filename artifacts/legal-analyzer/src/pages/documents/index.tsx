import { useState, useEffect } from "react";
import { Upload, FileText, Trash2, Eye, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "../../components/layout/Navbar";

interface Document {
  id: string;
  title: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  fileSize?: string;
}

export default function DocumentsIndex() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_URL = "https://onrender.com";

  // Fetch your uploaded document files registry list from the database
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch(`${API_URL}/api/documents`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        if (!response.ok) throw new Error("Failed to load document records.");
        const data = await response.json();
        setDocuments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setErrorMessage(err.message || "Could not retrieve documents registry.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  // Handle local file selection and process the multi-part upload stream
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/documents/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Upload processing pipeline failed.");
      }

      const newDoc = await response.json();
      setDocuments((prev) => [newDoc, ...prev]);
    } catch (err: any) {
      setErrorMessage(err.message || "File upload transaction failed.");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete a document from the system files database registry
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this legal file?")) return;
    try {
      const response = await fetch(`${API_URL}/api/documents/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      if (!response.ok) throw new Error("Failed to clear document record.");
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Header Title Section */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight">
            Document Repository
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload legal transcripts, motions, and discovery evidence bundles for automated analysis.
          </p>
        </div>

        {/* Error Alert Display Module */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Core Drag & Drop Upload Zone Component */}
        <div className="mb-10">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl bg-card/40 hover:bg-card/80 hover:border-primary/40 transition-all cursor-pointer group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              {isUploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                  <p className="text-sm font-medium text-foreground">Uploading files...</p>
                  <p className="text-xs text-muted-foreground mt-1">Streaming multi-part chunks into analysis nodes...</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Click to browse files or drag transcripts here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Supports PDF, DOCX, TXT, or CSV (Max size: 50MB)
                  </p>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.docx,.txt,.csv" 
              onChange={handleFileUpload} 
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Document Registry Table Layout Section */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border bg-card/60">
            <h2 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Uploaded Records Registry
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Reading cloud document entries...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-muted-foreground/40 mb-1" />
              <p className="text-sm font-medium">No document records found.</p>
              <p className="text-xs max-w-xs mx-auto">Upload a new case legal file transcript block using the dropzone dashboard above to begin.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate max-w-md">
                        {doc.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        {doc.fileSize && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span>{doc.fileSize}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium inline-block mr-2 border ${
                      doc.status === "completed" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                      doc.status === "processing" ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 animate-pulse" :
                      doc.status === "failed" ? "bg-destructive/10 border-destructive/20 text-destructive" :
                      "bg-muted border-border text-muted-foreground"
                    }`}>
                      {doc.status}
                    </span>
                    <a 
                      href={`/documents/${doc.id}`}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all"
                      title="Open Analysis View"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                      title="Delete File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
