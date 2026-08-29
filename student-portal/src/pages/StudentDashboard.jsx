import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <h1>Student Dashboard</h1>

      <h2>Welcome to Student Portal</h2>

      <p>Here you can manage your student information.</p>

      <button>My Profile</button>
      <button>Courses</button>
      <button>Results</button>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default StudentDashboard;