import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DocumentsNomerit() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNomerit = async () => {
      try {
        const res = await fetch(`/api/nomerit/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const nomerit = await res.json();
        console.log("Nomerit:", nomerit);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchNomerit();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  return <div>Nomerit {id}</div>;
}
