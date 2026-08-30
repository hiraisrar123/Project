import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [totalTickets, setTotalTickets] = useState(0);
  const [newTickets, setNewTickets] = useState(0);
  const [inProgressTickets, setInProgressTickets] = useState(0);
  const [resolvedTickets, setResolvedTickets] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch ticket statistics
  const fetchTicketStats = async () => {
    const { data, error } = await supabase
      .from("tickets")
      .select("id, status");

    if (error) {
      console.log(error.message);
      setLoading(false);
      return;
    }

    const tickets = data || [];

    setTotalTickets(tickets.length);

    setNewTickets(
      tickets.filter((ticket) => ticket.status === "New").length
    );

    setInProgressTickets(
      tickets.filter((ticket) => ticket.status === "In Progress").length
    );

    setResolvedTickets(
      tickets.filter((ticket) => ticket.status === "Resolved").length
    );

    setLoading(false);
  };

  useEffect(() => {
    // First load
    fetchTicketStats();

    // Realtime ticket changes
    const channel = supabase
      .channel("admin-dashboard-ticket-stats")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tickets",
        },
        () => {
          fetchTicketStats();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tickets",
        },
        () => {
          fetchTicketStats();
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff, #f5f3ff, #ecfeff)",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #4f46e5, #7c3aed)",
            color: "white",
            padding: "30px",
            borderRadius: "20px",
            marginBottom: "25px",
            boxShadow: "0 10px 25px rgba(79,70,229,0.25)",
          }}
        >
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "32px",
            }}
          >
            Admin Dashboard
          </h1>

          <p
            style={{
              margin: 0,
              opacity: 0.9,
              fontSize: "16px",
            }}
          >
            Manage customer support tickets and monitor support activity.
          </p>
        </div>

        {/* Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >

          {/* Total */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              borderLeft: "6px solid #4f46e5",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "32px" }}>🎫</div>

            <h3 style={{ color: "#4f46e5" }}>
              Total Tickets
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {loading ? "..." : totalTickets}
            </p>
          </div>

          {/* New */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              borderLeft: "6px solid #f59e0b",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "32px" }}>🆕</div>

            <h3 style={{ color: "#d97706" }}>
              New Tickets
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {loading ? "..." : newTickets}
            </p>
          </div>

          {/* In Progress */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              borderLeft: "6px solid #06b6d4",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "32px" }}>🔵</div>

            <h3 style={{ color: "#0891b2" }}>
              In Progress
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {loading ? "..." : inProgressTickets}
            </p>
          </div>

          {/* Resolved */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              borderLeft: "6px solid #22c55e",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "32px" }}>✅</div>

            <h3 style={{ color: "#16a34a" }}>
              Resolved
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {loading ? "..." : resolvedTickets}
            </p>
          </div>
        </div>

        {/* Support Management */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#1e293b",
            }}
          >
            Support Management
          </h2>

          <p style={{ color: "#64748b" }}>
            View and manage customer support tickets.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => navigate("/admin-tickets")}
              style={{
                background:
                  "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
                border: "none",
                padding: "14px 22px",
                borderRadius: "10px",
                fontSize: "15px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🎫 View Support Tickets
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "14px 22px",
                borderRadius: "10px",
                fontSize: "15px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;