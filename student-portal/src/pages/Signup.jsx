import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // 1. Account create karo
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // 2. User ID lo
    const user = data.user;

    if (!user) {
      alert("User account create nahi hua.");
      return;
    }

    // 3. Name profiles table mein save karo
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        name: name,
        role: "student",
      });

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("Account created successfully!");

    // 4. Fields clear karo
    setName("");
    setEmail("");
    setPassword("");

    // 5. Login page par jao
    navigate("/");
  };

  return (
    <div>
      <h1>Student Signup</h1>

      <form onSubmit={handleSignup}>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Signup
        </button>

      </form>
    </div>
  );
}

export default Signup;