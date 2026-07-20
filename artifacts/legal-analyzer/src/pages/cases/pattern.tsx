import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CasesPattern() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPattern = async () => {
      try {
        const res = await fetch(`/api/pattern/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const pattern = await res.json();
        console.log("Pattern:", pattern);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPattern();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  return <div>Pattern {id}</div>;
}
