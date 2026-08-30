import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function TicketCreate() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createTicket = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !description.trim()) {
      alert("Please enter subject and description.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setLoading(false);
      return;
    }

    const ticketNumber = `SUP-${Date.now()}`;

    const { error } = await supabase.from("tickets").insert([
      {
        ticket_number: ticketNumber,
        customer_id: user.id,
        subject: subject.trim(),
        description: description.trim(),
        category: category || null,
        priority: "Medium",
        status: "New",
      },
    ]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Ticket created successfully!");

    setSubject("");
    setDescription("");
    setCategory("");

    navigate("/my-tickets");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #ecfeff 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: "16px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "21px",
            }}
          >
            🎫
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#4f46e5",
                fontSize: "21px",
              }}
            >
              SupportFlow
            </h2>

            <small style={{ color: "#64748b" }}>
              Customer Support
            </small>
          </div>
        </div>

        <button
          onClick={() => navigate("/my-tickets")}
          style={{
            background: "#eef2ff",
            color: "#4338ca",
            border: "none",
            padding: "10px 17px",
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
          maxWidth: "850px",
          margin: "0 auto",
          padding: "45px 0",
        }}
      >
        {/* Heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              width: "65px",
              height: "65px",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #4f46e5, #9333ea)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              boxShadow:
                "0 10px 25px rgba(79,70,229,0.25)",
            }}
          >
            🎫
          </div>

          <h1
            style={{
              margin: "18px 0 8px",
              color: "#111827",
              fontSize: "32px",
            }}
          >
            Create Support Ticket
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Tell us about your problem and our support team
            will help you.
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "35px",
            boxShadow:
              "0 15px 40px rgba(79,70,229,0.12)",
            border: "1px solid #e5e7eb",
          }}
        >
          <form onSubmit={createTicket}>
            {/* Subject */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontWeight: "bold",
                  color: "#1f2937",
                }}
              >
                Subject
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What do you need help with?"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "11px",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontWeight: "bold",
                  color: "#1f2937",
                }}
              >
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "11px",
                  fontSize: "15px",
                  background: "white",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="">Select a category</option>
                <option value="Billing">💳 Billing</option>
                <option value="Technical">💻 Technical</option>
                <option value="Account">👤 Account</option>
                <option value="General">📋 General</option>
              </select>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontWeight: "bold",
                  color: "#1f2937",
                }}
              >
                Describe Your Issue
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please explain your problem in detail..."
                rows="7"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "11px",
                  fontSize: "15px",
                  resize: "vertical",
                  fontFamily: "Arial, sans-serif",
                  outline: "none",
                  lineHeight: "1.6",
                }}
              />
            </div>

            {/* Information */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, #eef2ff, #f5f3ff)",
                border: "1px solid #c7d2fe",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "28px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: "20px" }}>💡</span>

              <div>
                <strong style={{ color: "#3730a3" }}>
                  Before submitting
                </strong>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#6366f1",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  Your ticket will start with{" "}
                  <strong>New</strong> status and{" "}
                  <strong>Medium</strong> priority. Our
                  support team will review it shortly.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "14px 20px",
                  border: "none",
                  borderRadius: "11px",
                  background: loading
                    ? "#a5b4fc"
                    : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  boxShadow:
                    "0 7px 18px rgba(79,70,229,0.25)",
                }}
              >
                {loading
                  ? "Creating Ticket..."
                  : "🎫 Submit Ticket"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/my-tickets")}
                style={{
                  flex: 1,
                  minWidth: "150px",
                  padding: "14px 20px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "11px",
                  background: "#f8fafc",
                  color: "#374151",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          SupportFlow • We're here to help 🤝
        </p>
      </main>
    </div>
  );
}

export default TicketCreate;