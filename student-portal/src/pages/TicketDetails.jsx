import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTicket();
    fetchMessages();

    const messageChannel = supabase
      .channel(`ticket-messages-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ticket_messages",
          filter: `ticket_id=eq.${id}`,
        },
        (payload) => {
          setMessages((currentMessages) => {
            const alreadyExists = currentMessages.some(
              (msg) => msg.id === payload.new.id
            );

            if (alreadyExists) return currentMessages;

            return [...currentMessages, payload.new];
          });
        }
      )
      .subscribe();

    const ticketChannel = supabase
      .channel(`ticket-status-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tickets",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setTicket((currentTicket) => ({
            ...currentTicket,
            ...payload.new,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(ticketChannel);
    };
  }, [id]);

  const fetchTicket = async () => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      navigate("/my-tickets");
      return;
    }

    setTicket(data);
    setLoading(false);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setMessages(data || []);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setSending(false);
      return;
    }

    const { error } = await supabase
      .from("ticket_messages")
      .insert([
        {
          ticket_id: id,
          sender_id: user.id,
          message: message.trim(),
        },
      ]);

    if (error) {
      alert(error.message);
      setSending(false);
      return;
    }

    setMessage("");
    setSending(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return {
          background: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
        };

      case "In Progress":
        return {
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fde68a",
        };

      case "Assigned":
        return {
          background: "#dbeafe",
          color: "#1e40af",
          border: "1px solid #bfdbfe",
        };

      default:
        return {
          background: "#f3f4f6",
          color: "#374151",
          border: "1px solid #e5e7eb",
        };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return {
          background: "#fee2e2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
        };

      case "Low":
        return {
          background: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
        };

      default:
        return {
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fde68a",
        };
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "45px",
            borderRadius: "24px",
            textAlign: "center",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              width: "65px",
              height: "65px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              margin: "0 auto 18px",
            }}
          >
            🎫
          </div>

          <h2
            style={{
              margin: 0,
              color: "#111827",
            }}
          >
            Loading Ticket...
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginBottom: 0,
            }}
          >
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "50px" }}>😕</div>

          <h2>Ticket Not Found</h2>

          <button
            onClick={() => navigate("/my-tickets")}
            style={{
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "9px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff, #f8fafc, #f5f3ff)",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "50px",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: "18px 6%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "21px",
            }}
          >
            🎫
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "21px",
              }}
            >
              SupportFlow
            </h2>

            <span
              style={{
                fontSize: "11px",
                color: "#6b7280",
              }}
            >
              Customer Support
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/my-tickets")}
          style={{
            background: "#eef2ff",
            color: "#4338ca",
            border: "1px solid #c7d2fe",
            padding: "10px 17px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← My Tickets
        </button>
      </nav>

      {/* MAIN */}
      <main
        style={{
          width: "92%",
          maxWidth: "1000px",
          margin: "0 auto",
          paddingTop: "35px",
        }}
      >
        {/* PAGE TITLE */}
        <div style={{ marginBottom: "22px" }}>
          <p
            style={{
              margin: "0 0 7px",
              color: "#4f46e5",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            SUPPORT TICKET
          </p>

          <h1
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "30px",
            }}
          >
            Ticket Details
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "7px",
            }}
          >
            View your ticket information and communicate with support.
          </p>
        </div>

        {/* TICKET INFORMATION */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: "22px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
            border: "1px solid #e5e7eb",
            marginBottom: "22px",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{
                  display: "inline-block",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  padding: "7px 13px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                {ticket.ticket_number}
              </span>

              <h2
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "27px",
                  lineHeight: "1.35",
                }}
              >
                {ticket.subject}
              </h2>
            </div>

            <span
              style={{
                ...getStatusStyle(ticket.status),
                padding: "9px 16px",
                borderRadius: "25px",
                fontSize: "13px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              ● {ticket.status}
            </span>
          </div>

          {/* DETAILS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginTop: "25px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <small
                style={{
                  display: "block",
                  color: "#94a3b8",
                  marginBottom: "6px",
                  fontWeight: "bold",
                }}
              >
                CATEGORY
              </small>

              <strong style={{ color: "#374151" }}>
                📁 {ticket.category || "Not Assigned"}
              </strong>
            </div>

            <div
              style={{
                ...getPriorityStyle(ticket.priority),
                padding: "16px",
                borderRadius: "12px",
              }}
            >
              <small
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "bold",
                  opacity: 0.75,
                }}
              >
                PRIORITY
              </small>

              <strong>
                ⚡ {ticket.priority || "Medium"}
              </strong>
            </div>

            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <small
                style={{
                  display: "block",
                  color: "#94a3b8",
                  marginBottom: "6px",
                  fontWeight: "bold",
                }}
              >
                CREATED
              </small>

              <strong style={{ color: "#374151" }}>
                📅{" "}
                {ticket.created_at
                  ? new Date(ticket.created_at).toLocaleDateString()
                  : "N/A"}
              </strong>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div
            style={{
              marginTop: "22px",
              background: "linear-gradient(135deg, #f8faff, #f5f3ff)",
              border: "1px solid #e0e7ff",
              borderRadius: "15px",
              padding: "21px",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px",
                color: "#3730a3",
                fontSize: "17px",
              }}
            >
              📝 Issue Description
            </h3>

            <p
              style={{
                margin: 0,
                color: "#4b5563",
                lineHeight: "1.75",
                whiteSpace: "pre-wrap",
              }}
            >
              {ticket.description}
            </p>
          </div>

          {/* RESOLUTION */}
          {ticket.resolution_note && (
            <div
              style={{
                marginTop: "15px",
                background: "#ecfdf5",
                border: "1px solid #bbf7d0",
                borderRadius: "15px",
                padding: "21px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 9px",
                  color: "#166534",
                }}
              >
                ✅ Resolution Note
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#365314",
                  lineHeight: "1.7",
                }}
              >
                {ticket.resolution_note}
              </p>
            </div>
          )}
        </section>

        {/* CONVERSATION */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: "22px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* CONVERSATION HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
              paddingBottom: "20px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "23px",
                }}
              >
                💬 Conversation
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Chat with our support team
              </p>
            </div>

            <div
              style={{
                background: "#eef2ff",
                color: "#4338ca",
                padding: "8px 13px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {messages.length}{" "}
              {messages.length === 1 ? "Message" : "Messages"}
            </div>
          </div>

          {/* MESSAGES */}
          <div
            style={{
              marginTop: "20px",
              marginBottom: "25px",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "16px",
                  padding: "45px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "45px",
                    marginBottom: "10px",
                  }}
                >
                  💬
                </div>

                <h3
                  style={{
                    margin: "0 0 7px",
                    color: "#374151",
                  }}
                >
                  No messages yet
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                  }}
                >
                  Send a message below to contact the support team.
                </p>
              </div>
            ) : (
              <div
                style={{
                  maxHeight: "430px",
                  overflowY: "auto",
                  padding: "5px",
                }}
              >
                {messages.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "78%",
                        background:
                          "linear-gradient(135deg, #eef2ff, #f5f3ff)",
                        border: "1px solid #ddd6fe",
                        padding: "15px 17px",
                        borderRadius: "16px 16px 4px 16px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 9px",
                          color: "#374151",
                          lineHeight: "1.65",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {item.message}
                      </p>

                      <small
                        style={{
                          color: "#8b5cf6",
                          fontSize: "11px",
                        }}
                      >
                        🕐{" "}
                        {new Date(item.created_at).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEND MESSAGE */}
          <form onSubmit={sendMessage}>
            <label
              style={{
                display: "block",
                marginBottom: "9px",
                color: "#374151",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Write a message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="5"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px",
                border: "1px solid #d1d5db",
                borderRadius: "13px",
                resize: "vertical",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                outline: "none",
                background: "#fafafa",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "12px",
              }}
            >
              <button
                type="submit"
                disabled={sending}
                style={{
                  background: sending
                    ? "#a5b4fc"
                    : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "#ffffff",
                  border: "none",
                  padding: "13px 24px",
                  borderRadius: "10px",
                  cursor: sending ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                  boxShadow: "0 5px 15px rgba(79,70,229,0.25)",
                }}
              >
                {sending ? "Sending..." : "📨 Send Message"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default TicketDetails;