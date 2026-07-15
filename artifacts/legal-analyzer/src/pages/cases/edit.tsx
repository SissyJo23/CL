import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface CaseData {
  title: string;
  defendantName: string | null;
  caseNumber: string | null;
  jurisdiction: string | null;
  notes: string | null;
}

const API_BASE_URL = "https://caselight-api.onrender.com";

export default function CasesEdit() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CaseData>({
    title: "",
    defendantName: "",
    caseNumber: "",
    jurisdiction: "",
    notes: "",
  });

  // Get current auth token helper
  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  // 1. Load the existing case
  useEffect(() => {
    async function fetchCase() {
      try {
        const res = await fetch(`${API_BASE_URL}/cases/${id}`, {
          headers: {
            ...getAuthHeader(),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch case details");
        const data = await res.json();
        setFormData({
          title: data.title || "",
          defendantName: data.defendantName || "",
          caseNumber: data.caseNumber || "",
          jurisdiction: data.jurisdiction || "",
          notes: data.notes || "",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not load case details.",
          variant: "destructive",
        });
        setLocation(`/cases/${id}`);
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [id, setLocation, toast]);

  // 2. Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Submit updates to the API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/cases/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update case");

      toast({
        title: "Success",
        description: "Case updated successfully.",
      });
      setLocation(`/cases/${id}`);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-muted-foreground animate-pulse">Loading case details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Case Details</h1>
        <Button variant="ghost" onClick={() => setLocation(`/cases/${id}`)}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium">Case Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-background"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Defendant Name</label>
            <input
              type="text"
              name="defendantName"
              value={formData.defendantName || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Case Number</label>
            <input
              type="text"
              name="caseNumber"
              value={formData.caseNumber || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Jurisdiction</label>
          <input
            type="text"
            name="jurisdiction"
            value={formData.jurisdiction || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <textarea
            name="notes"
            rows={4}
            value={formData.notes || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-background"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => setLocation(`/cases/${id}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
