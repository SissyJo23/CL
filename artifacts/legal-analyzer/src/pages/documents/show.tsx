import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

export default function DocumentsShow() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/documents/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const doc = await res.json();
        console.log("Document:", doc);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  return <div>Document {id}</div>;
}
