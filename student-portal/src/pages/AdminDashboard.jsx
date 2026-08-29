import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Welcome Admin</h2>

      <p>Manage your student portal from here.</p>

      <button onClick={() => navigate("/students")}>
        Students
      </button>

      <button>
        Courses
      </button>

      <button>
        Results
      </button>

      <button>
        Announcements
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;