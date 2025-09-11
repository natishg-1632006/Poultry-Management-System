import React, { useEffect, useState } from "react";
import axios from "axios";

const DailyHistory = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dailyEntries");
        setEntries(res.data);
      } catch (err) {
        console.error("Error fetching daily history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    try {
      if (typeof dateValue === "object" && dateValue.$date) {
        return new Date(dateValue.$date).toLocaleDateString();
      }
      return new Date(dateValue).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) return <p>Loading daily entries...</p>;

  return (
    <div className="mt-4">
      <h3 className="text-primary mb-3">📜 Daily Data History</h3>
      {entries.length === 0 ? (
        <p>No daily data found.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Batch</th>
              <th>Mortality</th>
              <th>Feed (kg)</th>
              <th>Avg Weight (g)</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td>{formatDate(entry.date)}</td>
                <td>{entry.batchName || "N/A"}</td>
                <td>{entry.mortality || 0}</td>
                <td>{entry.feedConsumption || 0}</td>
                <td>{entry.avgWeight || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DailyHistory;
