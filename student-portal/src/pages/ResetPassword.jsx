import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

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

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully!");

    await supabase.auth.signOut();

    navigate("/");
  };

  return (
    <div>
      <h1>Reset Password</h1>

      {sessionReady && (
        <form onSubmit={handleUpdatePassword}>

          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <br />
          <br />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <br />
          <br />

          <button type="submit">
            Update Password
          </button>

        </form>
      )}
    </div>
  );
}

export default ResetPassword;