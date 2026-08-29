import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getResults();
  }, []);

  const getResults = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("results")
      .select("*")
      .eq("student_id", user.id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setResults(data);
    setLoading(false);
  };

  if (loading) {
    return <h2>Loading Results...</h2>;
  }

  return (
    <div>
      <h1>My Results</h1>

      {results.length === 0 ? (
        <p>No results available.</p>
      ) : (
        results.map((result) => (
          <div key={result.id}>
            <h2>{result.course}</h2>
            <p>Marks: {result.marks}</p>
            <p>Grade: {result.grade}</p>
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

export default Results;