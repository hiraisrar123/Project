import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function AdminTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchTicket();
    fetchMessages();

    const messageChannel = supabase
      .channel(`admin-ticket-messages-${id}`)
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
            const exists = currentMessages.some(
              (msg) => msg.id === payload.new.id
            );

            if (exists) return currentMessages;

            return [...currentMessages, payload.new];
          });
        }
      )
      .subscribe();

    const ticketChannel = supabase
      .channel(`admin-ticket-status-${id}`)
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

          setStatus(payload.new.status || "New");
          setPriority(payload.new.priority || "Medium");
          setResolutionNote(payload.new.resolution_note || "");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(ticketChannel);
    };
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setTicket(data);
    setStatus(data.status || "New");
    setPriority(data.priority || "Medium");
    setResolutionNote(data.resolution_note || "");

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

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      alert("Please write a message.");
      return;
    }

    setSendingMessage(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You are not logged in.");
      setSendingMessage(false);
      return;
    }

    const { error } = await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: id,
        sender_id: user.id,
        message: newMessage.trim(),
      });

    if (error) {
      alert(error.message);
      setSendingMessage(false);
      return;
    }

    setNewMessage("");
    setSendingMessage(false);
  };

  const updateTicket = async () => {
    if (status === "Resolved" && !resolutionNote.trim()) {
      alert("Resolution note is required before resolving the ticket.");
      return;
    }

    if (!["Low", "Medium", "High"].includes(priority)) {
      alert("Please select a valid priority.");
      return;
    }

    setSaving(true);

    const updatedTime = new Date().toISOString();

    const { error } = await supabase
      .from("tickets")
      .update({
        status,
        priority,
        resolution_note: resolutionNote.trim() || null,
        updated_at: updatedTime,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setTicket((currentTicket) => ({
      ...currentTicket,
      status,
      priority,
      resolution_note: resolutionNote.trim() || null,
      updated_at: updatedTime,
    }));

    alert("Ticket updated successfully.");
    setSaving(false);
  };

  const getStatusStyle = (value) => {
    if (value === "Resolved") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (value === "In Progress") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (value === "Assigned") {
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

  const getPriorityStyle = (value) => {
    if (value === "High") {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    if (value === "Low") {
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
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #eef2ff, #f5f3ff, #ecfeff)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px 50px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "42px", marginBottom: "10px" }}>
            🎫
          </div>

          <h2
            style={{
              margin: 0,
              color: "#4f46e5",
            }}
          >
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
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f7fb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "18px",
            textAlign: "center",
          }}
        >
          <h2>Ticket not found.</h2>

          <button
            onClick={() => navigate("/admin-tickets")}
            style={{
              background: "#4f46e5",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "9px",
              cursor: "pointer",
            }}
          >
            Back to Tickets
          </button>
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
      {/* NAVBAR */}
      <nav
        style={{
          background: "white",
          padding: "18px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
          gap: "15px",
          flexWrap: "wrap",
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

          <small style={{ color: "#6b7280" }}>
            Admin Support Panel
          </small>
        </div>

        <button
          onClick={() => navigate("/admin-tickets")}
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
          ← All Tickets
        </button>
      </nav>

      {/* MAIN */}
      <main
        style={{
          width: "90%",
          maxWidth: "1050px",
          margin: "0 auto",
          paddingTop: "35px",
        }}
      >
        {/* PAGE HEADER */}
        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              color: "#6366f1",
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "7px",
            }}
          >
            ADMIN / SUPPORT TICKET
          </div>

          <h1
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "32px",
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
            Review the customer's issue, communicate with them, and
            update the ticket.
          </p>
        </div>

        {/* TICKET INFORMATION */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            marginBottom: "22px",
          }}
        >
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
              <span
                style={{
                  display: "inline-block",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  padding: "7px 13px",
                  borderRadius: "20px",
                  fontSize: "13px",
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
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              {ticket.status}
            </span>
          </div>

          {/* META */}
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
                padding: "8px 13px",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              📁 {ticket.category || "Not Assigned"}
            </span>

            <span
              style={{
                ...getPriorityStyle(ticket.priority),
                padding: "8px 13px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              ⚡ {ticket.priority || "Medium"} Priority
            </span>
          </div>

          {/* DESCRIPTION */}
          <div
            style={{
              marginTop: "25px",
              background:
                "linear-gradient(135deg, #f8faff, #f5f3ff)",
              border: "1px solid #e0e7ff",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px",
                color: "#3730a3",
              }}
            >
              📝 Issue Description
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

          {/* SUMMARY */}
          <div
            style={{
              marginTop: "15px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "18px",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px",
                color: "#334155",
              }}
            >
              📌 Summary
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: "1.6",
              }}
            >
              {ticket.summary || "No summary available"}
            </p>
          </div>
        </div>

        {/* CONVERSATION */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            marginBottom: "22px",
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
                💬 Customer Conversation
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Communicate directly with the customer.
              </p>
            </div>

            <span
              style={{
                background: "#eef2ff",
                color: "#4f46e5",
                padding: "7px 13px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {messages.length} Message
              {messages.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* MESSAGES */}
          {messages.length === 0 ? (
            <div
              style={{
                background: "#f8fafc",
                border: "1px dashed #cbd5e1",
                padding: "40px 20px",
                borderRadius: "14px",
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              <div style={{ fontSize: "42px", marginBottom: "10px" }}>
                💬
              </div>

              <h3
                style={{
                  margin: "0 0 6px",
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
                Send the first reply to the customer.
              </p>
            </div>
          ) : (
            <div
              style={{
                maxHeight: "420px",
                overflowY: "auto",
                paddingRight: "5px",
                marginBottom: "25px",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc, #f5f3ff)",
                    border: "1px solid #e5e7eb",
                    padding: "16px",
                    marginBottom: "12px",
                    borderRadius: "13px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <strong
                      style={{
                        color: "#4f46e5",
                        fontSize: "14px",
                      }}
                    >
                      Support Message
                    </strong>

                    <small
                      style={{
                        color: "#9ca3af",
                      }}
                    >
                      {new Date(msg.created_at).toLocaleString()}
                    </small>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "#374151",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* REPLY */}
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontWeight: "bold",
              }}
            >
              ✉️ Reply to Customer
            </label>

            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write your reply to the customer..."
              rows="5"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "11px",
                resize: "vertical",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                outline: "none",
                background: "white",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={sendingMessage}
              style={{
                marginTop: "12px",
                width: "100%",
                background: sendingMessage
                  ? "#a5b4fc"
                  : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "10px",
                cursor: sendingMessage
                  ? "not-allowed"
                  : "pointer",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {sendingMessage
                ? "Sending..."
                : "📨 Send Reply"}
            </button>
          </div>
        </div>

        {/* UPDATE TICKET */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ marginBottom: "22px" }}>
            <h2
              style={{
                margin: 0,
                color: "#111827",
              }}
            >
              ⚙️ Update Ticket
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Change priority, status, and resolution information.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "20px",
            }}
          >
            {/* PRIORITY */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#374151",
                  fontWeight: "bold",
                }}
              >
                ⚡ Priority
              </label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  width: "100%",
                  padding: "13px",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  fontSize: "14px",
                  background: "white",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#374151",
                  fontWeight: "bold",
                }}
              >
                🔄 Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "13px",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  fontSize: "14px",
                  background: "white",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* RESOLUTION */}
          <div style={{ marginTop: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontWeight: "bold",
              }}
            >
              ✅ Resolution Note
            </label>

            <textarea
              value={resolutionNote}
              onChange={(e) =>
                setResolutionNote(e.target.value)
              }
              placeholder="Write a resolution note when resolving this ticket..."
              rows="5"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "11px",
                resize: "vertical",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                outline: "none",
              }}
            />
          </div>

          {/* SAVE */}
          <button
            onClick={updateTicket}
            disabled={saving}
            style={{
              marginTop: "20px",
              width: "100%",
              background: saving
                ? "#a5b4fc"
                : "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "white",
              border: "none",
              padding: "15px",
              borderRadius: "10px",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            {saving
              ? "Saving Changes..."
              : "💾 Save Ticket Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminTicketDetails;