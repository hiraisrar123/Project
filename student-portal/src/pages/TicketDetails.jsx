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

            if (alreadyExists) {
              return currentMessages;
            }

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
            Loading Ticket...
          </h2>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>Ticket not found.</h2>
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
        paddingBottom: "40px",
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
        <h2
          style={{
            margin: 0,
            color: "#4f46e5",
            fontSize: "24px",
          }}
        >
          SupportFlow
        </h2>

        <button
          onClick={() => navigate("/my-tickets")}
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
          ← My Tickets
        </button>
      </nav>

      {/* Main */}
      <main
        style={{
          width: "90%",
          maxWidth: "950px",
          margin: "0 auto",
          paddingTop: "35px",
        }}
      >
        {/* Ticket Card */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            marginBottom: "22px",
          }}
        >
          {/* Ticket Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                {ticket.ticket_number}
              </div>

              <h1
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "28px",
                  lineHeight: "1.3",
                }}
              >
                {ticket.subject}
              </h1>
            </div>

            <span
              style={{
                ...getStatusStyle(ticket.status),
                padding: "8px 15px",
                borderRadius: "25px",
                fontWeight: "bold",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              {ticket.status}
            </span>
          </div>

          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "22px",
            }}
          >
            <span
              style={{
                background: "#f3f4f6",
                color: "#374151",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              📁 {ticket.category || "Not Assigned"}
            </span>

            <span
              style={{
                ...getPriorityStyle(ticket.priority),
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              ⚡ {ticket.priority || "Medium"} Priority
            </span>
          </div>

          {/* Description */}
          <div
            style={{
              marginTop: "25px",
              background:
                "linear-gradient(135deg, #f8faff, #f5f3ff)",
              borderRadius: "14px",
              padding: "20px",
              border: "1px solid #e0e7ff",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px",
                color: "#3730a3",
              }}
            >
              Issue Description
            </h3>

            <p
              style={{
                margin: 0,
                color: "#4b5563",
                lineHeight: "1.7",
                whiteSpace: "pre-wrap",
              }}
            >
              {ticket.description}
            </p>
          </div>

          {/* Resolution Note */}
          {ticket.resolution_note && (
            <div
              style={{
                marginTop: "15px",
                background: "#ecfdf5",
                border: "1px solid #bbf7d0",
                borderRadius: "14px",
                padding: "18px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#166534",
                }}
              >
                ✅ Resolution Note
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#365314",
                  lineHeight: "1.6",
                }}
              >
                {ticket.resolution_note}
              </p>
            </div>
          )}
        </div>

        {/* Conversation */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#111827",
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
                Communicate with the support team
              </p>
            </div>

            <span
              style={{
                background: "#eef2ff",
                color: "#4f46e5",
                padding: "7px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {messages.length} Message
              {messages.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Messages */}
          {messages.length === 0 ? (
            <div
              style={{
                background: "#f8fafc",
                border: "1px dashed #cbd5e1",
                padding: "35px 20px",
                borderRadius: "14px",
                textAlign: "center",
                color: "#64748b",
                marginBottom: "25px",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                💬
              </div>

              <h3 style={{ margin: "0 0 6px", color: "#374151" }}>
                No messages yet
              </h3>

              <p style={{ margin: 0 }}>
                Start the conversation with our support team below.
              </p>
            </div>
          ) : (
            <div
              style={{
                maxHeight: "450px",
                overflowY: "auto",
                paddingRight: "5px",
                marginBottom: "25px",
              }}
            >
              {messages.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc, #f5f3ff)",
                    border: "1px solid #e5e7eb",
                    padding: "16px",
                    marginBottom: "12px",
                    borderRadius: "13px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px",
                      color: "#374151",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item.message}
                  </p>

                  <small
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    🕐 {new Date(item.created_at).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}

          {/* Reply */}
          <form onSubmit={sendMessage}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontWeight: "bold",
              }}
            >
              Send a Message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message to the support team..."
              rows="5"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                resize: "vertical",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                outline: "none",
              }}
            />

            <button
              type="submit"
              disabled={sending}
              style={{
                marginTop: "12px",
                width: "100%",
                background: sending
                  ? "#a5b4fc"
                  : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "10px",
                cursor: sending ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {sending ? "Sending..." : "📨 Send Message"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default TicketDetails;