import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getAttendance();
  }, []);

  const getAttendance = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", user.id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setAttendance(data);
    setLoading(false);
  };

  if (loading) {
    return <h2>Loading Attendance...</h2>;
  }

  return (
    <div>
      <h1>My Attendance</h1>

      {attendance.length === 0 ? (
        <p>No attendance available.</p>
      ) : (
        attendance.map((item) => {
          const percentage =
            (item.present / item.total_classes) * 100;

          return (
            <div key={item.id}>
              <h2>{item.course}</h2>

              <p>Total Classes: {item.total_classes}</p>

              <p>Present: {item.present}</p>

              <p>Absent: {item.absent}</p>

              <p>
                Attendance: {percentage.toFixed(0)}%
              </p>

              <hr />
            </div>
          );
        })
      )}

      <button onClick={() => navigate("/student-dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Attendance;