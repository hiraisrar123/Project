import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          background: "#ffffff",
          padding: "18px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#2563eb",
            fontSize: "24px",
          }}
        >
          SupportFlow
        </h2>

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "50px 25px",
        }}
      >
        {/* Welcome */}
        <div style={{ marginBottom: "35px" }}>
          <h1
            style={{
              marginBottom: "10px",
              color: "#111827",
              fontSize: "32px",
            }}
          >
            Customer Support Dashboard
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            Create support tickets and communicate with our support team.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
          }}
        >
          {/* Create Ticket */}
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "14px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                background: "#dbeafe",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                marginBottom: "20px",
              }}
            >
              🎫
            </div>

            <h2 style={{ color: "#111827" }}>
              Create Support Ticket
            </h2>

            <p
              style={{
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              Have an issue? Submit a new support ticket to our team.
            </p>

            <button
              onClick={() => navigate("/create-ticket")}
              style={{
                width: "100%",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "13px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              Create Ticket
            </button>
          </div>

          {/* My Tickets */}
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "14px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                background: "#dcfce7",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                marginBottom: "20px",
              }}
            >
              📋
            </div>

            <h2 style={{ color: "#111827" }}>
              My Support Tickets
            </h2>

            <p
              style={{
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              View your submitted tickets, status, priority and
              conversations.
            </p>

            <button
              onClick={() => navigate("/my-tickets")}
              style={{
                width: "100%",
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "13px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              View My Tickets
            </button>
          </div>
        </div>

        {/* Info */}
        <div
          style={{
            marginTop: "35px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            padding: "20px",
            borderRadius: "12px",
            color: "#1e40af",
          }}
        >
          <strong>SupportFlow</strong>

          <p
            style={{
              margin: "8px 0 0",
              lineHeight: "1.6",
            }}
          >
            Submit your issue, track its status and communicate
            directly with the support team from one place.
          </p>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;