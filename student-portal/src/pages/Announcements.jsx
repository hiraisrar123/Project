import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getAnnouncements();
  }, []);

  const getAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setAnnouncements(data);
    setLoading(false);
  };

  if (loading) {
    return <h2>Loading Announcements...</h2>;
  }

  return (
    <div>
      <h1>Announcements</h1>

      {announcements.length === 0 ? (
        <p>No announcements available.</p>
      ) : (
        announcements.map((announcement) => (
          <div key={announcement.id}>
            <h2>{announcement.title}</h2>
            <p>{announcement.message}</p>
            <p>{announcement.created_at}</p>
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

export default Announcements;