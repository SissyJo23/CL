import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

export default function CasesRelief() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelief = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/relief/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const relief = await res.json();
        console.log("Relief:", relief);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchRelief();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  return <div>Relief {id}</div>;
}
