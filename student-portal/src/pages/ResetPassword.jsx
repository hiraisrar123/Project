import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleRecovery = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        alert(error.message);
        return;
      }

      if (data.session) {
        setSessionReady(true);
      } else {
        alert("Auth session missing. Please open the latest reset email.");
      }
    };

    handleRecovery();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Password updated successfully!");

    await supabase.auth.signOut();

    setLoading(false);

    navigate("/");
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
            🔑
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
            Secure Your Account
          </h2>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              opacity: 0.9,
              maxWidth: "400px",
            }}
          >
            Create a new password for your SupportFlow account.
            Choose a strong password that you can remember.
          </p>

          <div
            style={{
              marginTop: "30px",
              fontSize: "14px",
              opacity: 0.9,
              lineHeight: "2",
            }}
          >
            ✓ Secure password update
            <br />
            ✓ Protect your account
            <br />
            ✓ Continue using SupportFlow safely
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
              Reset Password 🔐
            </h2>

            <p
              style={{
                margin: "0 0 30px",
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              Enter your new password below to secure your account.
            </p>

            {sessionReady ? (
              <form onSubmit={handleUpdatePassword}>
                {/* New Password */}
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#374151",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px 15px",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "15px",
                    outline: "none",
                    marginBottom: "20px",
                  }}
                />

                {/* Confirm Password */}
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#374151",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Confirm New Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px 15px",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "15px",
                    outline: "none",
                    marginBottom: "25px",
                  }}
                />

                {/* Update Button */}
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
                  {loading
                    ? "Updating..."
                    : "Update Password"}
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
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 10px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "40px",
                    marginBottom: "12px",
                  }}
                >
                  ⏳
                </div>

                <h3
                  style={{
                    margin: "0 0 8px",
                    color: "#374151",
                  }}
                >
                  Checking your reset link...
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  Please wait while we verify your session.
                </p>
              </div>
            )}
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

export default ResetPassword;