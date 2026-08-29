import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return;
    }

    setEmail(user.email);

    const { data, error } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", user.id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setProfile(data);
  };

  if (!profile) {
    return <h2>Loading Profile...</h2>;
  }

  return (
    <div>
      <h1>My Profile</h1>

      <p>
        <strong>Name:</strong> {profile.name}
      </p>

      <p>
        <strong>Email:</strong> {email}
      </p>

      <p>
        <strong>Role:</strong> {profile.role}
      </p>

      <button onClick={() => navigate("/student-dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Profile;