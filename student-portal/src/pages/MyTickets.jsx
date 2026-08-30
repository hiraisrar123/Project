import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("customer_id", user.id)
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
    switch (status) {
      case "Resolved":
        return {
          background: "#dcfce7",
          color: "#15803d",
          icon: "✓",
        };

      case "In Progress":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
          icon: "●",
        };

      case "Assigned":
        return {
          background: "#f3e8ff",
          color: "#7e22ce",
          icon: "●",
        };

      default:
        return {
          background: "#fef3c7",
          color: "#b45309",
          icon: "●",
        };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return {
          background: "#fee2e2",
          color: "#dc2626",
        };

      case "Low":
        return {
          background: "#dcfce7",
          color: "#15803d",
        };

      default:
        return {
          background: "#fef3c7",
          color: "#b45309",
        };
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #eef2ff, #f5f3ff, #ecfeff)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "35px 50px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "42px",
              marginBottom: "10px",
            }}
          >
            🎫
          </div>

          <h2
            style={{
              margin: 0,
              color: "#4f46e5",
            }}
          >
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
          background: "rgba(255,255,255,0.95)",
          padding: "18px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
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

          <small style={{ color: "#64748b" }}>
            Customer Support Portal
          </small>
        </div>

        <button
          onClick={() => navigate("/student-dashboard")}
          style={{
            background: "#eef2ff",
            color: "#4f46e5",
            border: "none",
            padding: "10px 18px",
            borderRadius: "10px",
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
          paddingTop: "45px",
        }}
      >
        {/* Page Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #4f46e5, #7c3aed)",
            color: "white",
            padding: "32px",
            borderRadius: "22px",
            marginBottom: "30px",
            boxShadow: "0 12px 30px rgba(79,70,229,0.25)",
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
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: "32px",
                }}
              >
                My Support Tickets
              </h1>

              <p
                style={{
                  margin: 0,
                  opacity: 0.9,
                  fontSize: "15px",
                }}
              >
                Track your requests and communicate with our
                support team.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                padding: "15px 20px",
                borderRadius: "15px",
                textAlign: "center",
                minWidth: "90px",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                }}
              >
                {tickets.length}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.9,
                }}
              >
                Total Tickets
              </div>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "25px",
          }}
        >
          <button
            onClick={() => navigate("/create-ticket")}
            style={{
              background:
                "linear-gradient(135deg, #06b6d4, #2563eb)",
              color: "white",
              border: "none",
              padding: "13px 22px",
              borderRadius: "11px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 6px 15px rgba(37,99,235,0.2)",
            }}
          >
            ＋ Create New Ticket
          </button>
        </div>

        {/* Empty State */}
        {tickets.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "60px 25px",
              borderRadius: "22px",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#eef2ff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 20px",
                fontSize: "38px",
              }}
            >
              🎫
            </div>

            <h2
              style={{
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              No Tickets Yet
            </h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "25px",
              }}
            >
              You haven't created any support tickets.
            </p>

            <button
              onClick={() => navigate("/create-ticket")}
              style={{
                background: "#4f46e5",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          /* Tickets Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "22px",
            }}
          >
            {tickets.map((ticket) => {
              const statusStyle = getStatusStyle(ticket.status);
              const priorityStyle = getPriorityStyle(
                ticket.priority
              );

              return (
                <div
                  key={ticket.id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "23px",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.07)",
                    border: "1px solid #e2e8f0",
                    transition: "transform 0.2s",
                  }}
                >
                  {/* Top Row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "18px",
                    }}
                  >
                    <span
                      style={{
                        color: "#4f46e5",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      {ticket.ticket_number}
                    </span>

                    <span
                      style={{
                        background: statusStyle.background,
                        color: statusStyle.color,
                        padding: "6px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {statusStyle.icon} {ticket.status}
                    </span>
                  </div>

                  {/* Subject */}
                  <h2
                    style={{
                      margin: "0 0 10px",
                      color: "#1e293b",
                      fontSize: "19px",
                      lineHeight: "1.4",
                    }}
                  >
                    {ticket.subject}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      minHeight: "42px",
                      marginBottom: "18px",
                    }}
                  >
                    {ticket.description.length > 90
                      ? ticket.description.substring(0, 90) +
                        "..."
                      : ticket.description}
                  </p>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginBottom: "20px",
                    }}
                  >
                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "#475569",
                        padding: "6px 10px",
                        borderRadius: "7px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      📁 {ticket.category || "General"}
                    </span>

                    <span
                      style={{
                        background: priorityStyle.background,
                        color: priorityStyle.color,
                        padding: "6px 10px",
                        borderRadius: "7px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      ⚡ {ticket.priority || "Medium"}
                    </span>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() =>
                      navigate(`/ticket/${ticket.id}`)
                    }
                    style={{
                      width: "100%",
                      background:
                        "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      color: "white",
                      border: "none",
                      padding: "12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "13px",
                    }}
                  >
                    View Ticket & Conversation →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyTickets;