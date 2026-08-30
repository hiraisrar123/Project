import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5175/reset-password",
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Password reset email sent! Please check your email.");
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 50%, #f5f3ff 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "950px",
          minHeight: "520px",
          display: "flex",
          background: "white",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(37, 99, 235, 0.15)",
        }}
      >
        {/* Left Side */}
        <div
          style={{
            flex: 1,
            padding: "55px 45px",
            background:
              "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "20px",
            }}
          >
            🔐
          </div>

          <h1
            style={{
              fontSize: "38px",
              margin: "0 0 15px",
            }}
          >
            SupportFlow
          </h1>

          <h2
            style={{
              fontSize: "24px",
              margin: "0 0 18px",
              fontWeight: "500",
            }}
          >
            Account Recovery
          </h2>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              opacity: 0.9,
              maxWidth: "400px",
            }}
          >
            Forgot your password? Don't worry. Enter your registered
            email address and we'll send you a secure password reset
            link.
          </p>

          <div
            style={{
              marginTop: "30px",
              fontSize: "14px",
              opacity: 0.9,
              lineHeight: "2",
            }}
          >
            ✓ Secure password recovery
            <br />
            ✓ Reset link sent to your email
            <br />
            ✓ Get back to your account quickly
          </div>
        </div>

        {/* Right Side */}
        <div
          style={{
            flex: 1,
            padding: "55px 45px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              maxWidth: "420px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                margin: "0 0 8px",
                color: "#111827",
                fontSize: "30px",
              }}
            >
              Forgot Password?
            </h2>

            <p
              style={{
                margin: "0 0 30px",
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              Enter your email address and we'll send you a link
              to reset your password.
            </p>

            <form onSubmit={handleReset}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#374151",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px 15px",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  fontSize: "15px",
                  outline: "none",
                  marginBottom: "22px",
                }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background:
                    "linear-gradient(135deg, #2563eb, #4f46e5)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow:
                    "0 8px 18px rgba(37, 99, 235, 0.25)",
                }}
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "13px",
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ← Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>
        {`
          @media (max-width: 700px) {
            div[style*="min-height: 520px"] {
              flex-direction: column !important;
              min-height: auto !important;
            }

            div[style*="min-height: 520px"] > div:first-child {
              padding: 35px 25px !important;
            }

            div[style*="min-height: 520px"] > div:last-child {
              padding: 35px 25px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default ForgotPassword;