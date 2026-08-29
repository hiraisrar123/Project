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

      <button onClick={() => navigate("/profile")}>
        My Profile
      </button>

      <button onClick={() => navigate("/courses")}>
        Courses
      </button>

      <button onClick={() => navigate("/results")}>
        Results
      </button>

      <button onClick={() => navigate("/announcements")}>
        Announcements
      </button>
      <button onClick={() => navigate("/attendance")}>
       Attendance
       </button>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default StudentDashboard;