import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*");

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setCourses(data);
    setLoading(false);
  };

  if (loading) {
    return <h2>Loading Courses...</h2>;
  }

  return (
    <div>
      <h1>My Courses</h1>

      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        courses.map((course) => (
          <div key={course.id}>
            <h2>{course.name}</h2>
            <p>Code: {course.code}</p>
            <p>Teacher: {course.teacher}</p>
            <hr />
          </div>
        ))
      )}

      <button onClick={() => navigate("/student-dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Courses;