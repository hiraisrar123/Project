import { useState } from "react";
import { supabase } from "../supabaseClient";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5175/reset-password",
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset email sent! Please check your email.");
  };

  return (
    <div>
      <h1>Forgot Password</h1>

      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Send Reset Email
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;