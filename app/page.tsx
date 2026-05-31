"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeal();
  }, []);

  const fetchDeal = async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error) {
        console.error("SUPABASE ERROR:", error);
        return;
      }

      if (data && data.length > 0) {
        setDeal(data[0]);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!deal) {
    return <h1>Δεν βρέθηκε deal</h1>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>ZDeals</h1>

      <h2>{deal.title}</h2>

      <p>{deal.description}</p>

      <img
        src={deal.image}
        alt={deal.title}
        style={{
          width: 400,
          borderRadius: 10
        }}
      />

      <h3>
        {deal.current_price}€ → {deal.next_price}€
      </h3>

      <p>
        {deal.current_people} / {deal.target_people}
      </p>
    </div>
  );
}
