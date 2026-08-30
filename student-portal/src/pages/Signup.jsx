import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    // Create account
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      alert("User account could not be created.");
      setLoading(false);
      return;
    }

    // Save profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        name: name,
        role: "student",
      });

    if (profileError) {
      alert(profileError.message);
      setLoading(false);
      return;
    }

    alert("Account created successfully!");

    setName("");
    setEmail("");
    setPassword("");

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
          minHeight: "560px",
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
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>
            🎫
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
            Join Our Support Portal
          </h2>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              opacity: 0.9,
              maxWidth: "400px",
            }}
          >
            Create your account and easily submit, track and manage
            your support requests.
          </p>

          <div
            style={{
              marginTop: "30px",
              fontSize: "14px",
              opacity: 0.9,
              lineHeight: "2",
            }}
          >
            ✓ Create support tickets
            <br />
            ✓ Communicate with support agents
            <br />
            ✓ Track ticket status
            <br />
            ✓ Get your issues resolved
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
              Create Account ✨
            </h2>

            <p
              style={{
                margin: "0 0 30px",
                color: "#6b7280",
              }}
            >
              Sign up to start using SupportFlow.
            </p>

            <form onSubmit={handleSignup}>
              {/* Name */}
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#374151",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

              {/* Email */}
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
                placeholder="Enter your email"
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
                  marginBottom: "20px",
                }}
              />

              {/* Password */}
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#374151",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
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
                  marginBottom: "25px",
                }}
              />

              {/* Signup Button */}
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
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Login */}
              <p
                style={{
                  textAlign: "center",
                  marginTop: "25px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>
        {`
          @media (max-width: 700px) {
            div[style*="min-height: 560px"] {
              flex-direction: column !important;
              min-height: auto !important;
            }

            div[style*="min-height: 560px"] > div:first-child {
              padding: 35px 25px !important;
            }

            div[style*="min-height: 560px"] > div:last-child {
              padding: 35px 25px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Signup;
