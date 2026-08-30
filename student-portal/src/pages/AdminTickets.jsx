import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setTickets(data || []);
    setLoading(false);
  };

  const getStatusStyle = (status) => {
    if (status === "Resolved") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "In Progress") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (status === "Assigned") {
      return {
        background: "#dbeafe",
        color: "#1e40af",
      };
    }

    return {
      background: "#f3f4f6",
      color: "#374151",
    };
  };

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    if (priority === "Low") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    return {
      background: "#fef3c7",
      color: "#92400e",
    };
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #eef2ff, #f5f3ff, #ecfeff)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "35px 45px",
            borderRadius: "18px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>
            🎫
          </div>

          <h2 style={{ color: "#4f46e5", margin: 0 }}>
            Loading Tickets...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff, #f5f3ff, #ecfeff)",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "50px",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          background: "white",
          padding: "18px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#4f46e5",
              fontSize: "24px",
            }}
          >
            SupportFlow
          </h2>

          <small
            style={{
              color: "#64748b",
            }}
          >
            Admin Support Center
          </small>
        </div>

        <button
          onClick={() => navigate("/admin-dashboard")}
          style={{
            background: "#eef2ff",
            color: "#4338ca",
            border: "none",
            padding: "10px 18px",
            borderRadius: "9px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Dashboard
        </button>
      </nav>

      {/* Main */}
      <main
        style={{
          width: "90%",
          maxWidth: "1150px",
          margin: "0 auto",
          paddingTop: "40px",
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
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(79,70,229,0.20)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "38px",
                  marginBottom: "8px",
                }}
              >
                🎫
              </div>

              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: "30px",
                }}
              >
                Support Tickets
              </h1>

              <p
                style={{
                  margin: 0,
                  opacity: 0.9,
                  lineHeight: "1.6",
                }}
              >
                View and manage all customer support requests.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                padding: "18px 25px",
                borderRadius: "14px",
                textAlign: "center",
                minWidth: "100px",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                {tickets.length}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  opacity: 0.9,
                }}
              >
                Total Tickets
              </div>
            </div>
          </div>
        </div>

        {/* No Tickets */}
        {tickets.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "55px 25px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                fontSize: "55px",
                marginBottom: "15px",
              }}
            >
              📭
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                color: "#111827",
              }}
            >
              No Tickets Found
            </h2>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
              }}
            >
              There are currently no support tickets.
            </p>
          </div>
        ) : (
          /* Tickets Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "22px",
            }}
          >
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "24px",
                  boxShadow: "0 7px 22px rgba(0,0,0,0.07)",
                  border: "1px solid #e5e7eb",
                  transition: "0.2s",
                }}
              >
                {/* Ticket Top */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      background: "#eef2ff",
                      color: "#4f46e5",
                      padding: "6px 11px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {ticket.ticket_number}
                  </span>

                  <span
                    style={{
                      ...getStatusStyle(ticket.status),
                      padding: "6px 11px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>

                {/* Subject */}
                <h2
                  style={{
                    margin: "0 0 15px",
                    color: "#111827",
                    fontSize: "20px",
                    lineHeight: "1.4",
                  }}
                >
                  {ticket.subject}
                </h2>

                {/* Category + Priority */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "18px",
                  }}
                >
                  <span
                    style={{
                      background: "#f3f4f6",
                      color: "#374151",
                      padding: "7px 10px",
                      borderRadius: "7px",
                      fontSize: "12px",
                    }}
                  >
                    📁 {ticket.category || "Not Assigned"}
                  </span>

                  <span
                    style={{
                      ...getPriorityStyle(ticket.priority),
                      padding: "7px 10px",
                      borderRadius: "7px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    ⚡ {ticket.priority || "Medium"}
                  </span>
                </div>

                {/* Description */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #f8faff, #f5f3ff)",
                    borderRadius: "10px",
                    padding: "13px",
                    marginBottom: "20px",
                    border: "1px solid #e0e7ff",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#4b5563",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {ticket.description}
                  </p>
                </div>

                {/* Open Button */}
                <button
                  onClick={() =>
                    navigate(`/admin-ticket/${ticket.id}`)
                  }
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "white",
                    border: "none",
                    padding: "13px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  🔎 Open & Manage Ticket
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminTickets;