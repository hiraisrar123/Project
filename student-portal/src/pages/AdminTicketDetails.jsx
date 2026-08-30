import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

function AdminTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  // Messages
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchTicket();
    fetchMessages();

    // REALTIME: New messages
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

    // REALTIME: Ticket update
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

  // Fetch ticket
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

  // Fetch messages
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

  // Send message
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

  // Update ticket
  const updateTicket = async () => {
    if (status === "Resolved" && !resolutionNote.trim()) {
      alert("Resolution note is required before resolving the ticket.");
      return;
    }

    // Make sure priority is valid
    if (!["Low", "Medium", "High"].includes(priority)) {
      alert("Please select a valid priority.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("tickets")
      .update({
        status: status,
        priority: priority,
        resolution_note: resolutionNote.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    // Update local screen
    setTicket((currentTicket) => ({
      ...currentTicket,
      status: status,
      priority: priority,
      resolution_note: resolutionNote.trim() || null,
      updated_at: new Date().toISOString(),
    }));

    alert("Ticket updated successfully.");

    setSaving(false);
  };

  if (loading) {
    return <h2>Loading ticket...</h2>;
  }

  if (!ticket) {
    return <h2>Ticket not found.</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ticket Details</h1>

      <button onClick={() => navigate("/admin-tickets")}>
        Back to Tickets
      </button>

      <br />
      <br />

      {/* Ticket Information */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "800px",
        }}
      >
        <h2>{ticket.ticket_number}</h2>

        <p>
          <strong>Subject:</strong> {ticket.subject}
        </p>

        <p>
          <strong>Description:</strong>
          <br />
          {ticket.description}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {ticket.category || "Not Assigned"}
        </p>

        <p>
          <strong>Priority:</strong>{" "}
          {ticket.priority || "Medium"}
        </p>

        <p>
          <strong>Summary:</strong>{" "}
          {ticket.summary || "No summary available"}
        </p>

        <hr />

        {/* Conversation */}
        <h3>💬 Conversation</h3>

        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                <p>
                  <strong>Message:</strong>
                </p>

                <p>{msg.message}</p>

                <small>
                  {new Date(msg.created_at).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}

        <br />

        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a reply to the customer..."
          rows="4"
          style={{
            width: "100%",
            maxWidth: "700px",
            padding: "10px",
          }}
        />

        <br />
        <br />

        <button
          onClick={sendMessage}
          disabled={sendingMessage}
        >
          {sendingMessage ? "Sending..." : "Send Reply"}
        </button>

        <hr />

        {/* Update Ticket */}
        <h3>Update Ticket</h3>

        {/* Priority */}
        <label>
          <strong>Priority:</strong>
        </label>

        <br />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <br />
        <br />

        {/* Status */}
        <label>
          <strong>Status:</strong>
        </label>

        <br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <br />
        <br />

        {/* Resolution Note */}
        <label>
          <strong>Resolution / Reply Note:</strong>
        </label>

        <br />

        <textarea
          value={resolutionNote}
          onChange={(e) => setResolutionNote(e.target.value)}
          placeholder="Write resolution note when resolving the ticket..."
          rows="5"
          style={{
            width: "100%",
            maxWidth: "700px",
            padding: "10px",
          }}
        />

        <br />
        <br />

        <button onClick={updateTicket} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default AdminTicketDetails;