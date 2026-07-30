import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CourtRun() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const res = await fetch(`/api/court/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const court = await res.json();
        console.log("Court:", court);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchCourt();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  return <div>Court {id}</div>;
}
