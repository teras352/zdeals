"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchDeal();

    supabase.auth.getSession().then(({ data }) => {
      console.log("SESSION:", data.session);
    });
  }, []);

  const fetchDeal = async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*");

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

  const sendMagicLink = async () => {
    if (!email) return;

    try {
      setSending(true);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Έλεγξε το email σου για το Magic Link");
      setShowModal(false);

    } catch (err) {
      console.error(err);
      alert("Σφάλμα");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
        }}
      >
        Loading...
      </div>
    );
  }

  if (!deal) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
        }}
      >
        Δεν βρέθηκε deal
      </div>
    );
  }

  const progress =
    (deal.current_people / deal.target_people) * 100;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "white",
          padding: 30,
          borderRadius: 20,
        }}
      >
        <h1
          style={{
            color: "#16a34a",
            marginBottom: 20,
          }}
        >
          ZDeals
        </h1>

        <h2>{deal.title}</h2>

        <p>{deal.description}</p>

        <img
          src={deal.image}
          alt={deal.title}
          style={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 16,
            marginTop: 20,
          }}
        />

        <h3
          style={{
            marginTop: 25,
            fontSize: 32,
          }}
        >
          {deal.current_price}€ →{" "}
          <span style={{ color: "#16a34a" }}>
            {deal.next_price}€
          </span>
        </h3>

        <p
          style={{
            fontSize: 18,
            marginTop: 10,
          }}
        >
          {deal.current_people} / {deal.target_people} άτομα
        </p>

        <div
          style={{
            width: "100%",
            height: 14,
            background: "#ddd",
            borderRadius: 999,
            overflow: "hidden",
            marginTop: 15,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#16a34a",
            }}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            marginTop: 25,
            padding: "14px 24px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🔥 Μπαίνω στο Deal
        </button>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 20,
              width: 400,
              maxWidth: "90%",
            }}
          >
            <h2>Γίνε μέλος του Deal</h2>

            <p>
              Βάλε το email σου και θα σου στείλουμε
              Magic Link.
            </p>

            <input
              type="email"
              placeholder="Το email σου"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                marginTop: 20,
                border: "1px solid #ccc",
                borderRadius: 10,
              }}
            />

            <button
              onClick={sendMagicLink}
              disabled={sending}
              style={{
                width: "100%",
                marginTop: 20,
                padding: 14,
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {sending
                ? "Αποστολή..."
                : "Συνέχεια"}
            </button>

            <button
              onClick={() => setShowModal(false)}
              style={{
                width: "100%",
                marginTop: 10,
                padding: 12,
                background: "#eee",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Κλείσιμο
            </button>
          </div>
        </div>
      )}
    </main>
  );
}