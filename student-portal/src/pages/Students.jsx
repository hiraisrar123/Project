import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, role")
      .eq("role", "student");

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setStudents(data);
    setLoading(false);
  };

  if (loading) {
    return <h2>Loading Students...</h2>;
  }

  return (
    <div>
      <h1>Students</h1>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        students.map((student) => (
          <div key={student.id}>
            <h2>{student.name}</h2>
            <p>Role: {student.role}</p>
            <hr />
          </div>
        ))
      )}

      <button onClick={() => navigate("/admin-dashboard")}>
        Back to Admin Dashboard
      </button>
    </div>
  );
}

export default Students;