import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        // Fetch batch info
        const resBatch = await axios.get(`http://localhost:5000/api/batches/${id}`);
        setBatch(resBatch.data);

        // Fetch daily entries for this batch
        const resEntries = await axios.get(`http://localhost:5000/api/daily-entries/batch/${id}`);
        setEntries(resEntries.data);
      } catch (err) {
        console.error("❌ Error fetching batch details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatchDetails();
  }, [id]);

  if (loading) return <p>Loading batch details...</p>;
  if (!batch) return <p>Batch not found.</p>;

  // ---------- 📊 Stats Calculations ----------
  const totalFeedKg = entries.reduce((sum, e) => sum + ((e.feedPacks || 0) * 75), 0); // 75kg per pack
  const totalDead = entries.reduce((sum, e) => sum + (e.dead || 0), 0);
  const avgWeight = entries.length > 0
    ? (entries.reduce((sum, e) => sum + (e.weight || 0), 0) / entries.length).toFixed(2)
    : 0;

  const currentChicks = (batch.currentChicks || batch.totalChicks) - totalDead;
  const fcr = currentChicks > 0
    ? (totalFeedKg / (avgWeight * currentChicks)).toFixed(3)
    : "N/A";

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">🐔 Batch Dashboard: {batch.name}</h2>

      {/* Batch Info */}
      <div className="card shadow p-3 mb-4">
        <h4>{batch.name}</h4>
        <p>
          <b>Total Chicks:</b> {batch.totalChicks} <br />
          <b>Start Date:</b>{" "}
          {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "N/A"} <br />
          <b>Initial Weight:</b> {batch.initialWeight || 0} g <br />
          <b>Status:</b>{" "}
          <span className={`badge ${batch.completed ? "bg-danger" : "bg-success"}`}>
            {batch.completed ? "Completed" : "Active"}
          </span>
        </p>

        {batch.completed && (
          <>
            <h5 className="mt-3">✅ Completion Details</h5>
            <p>
              <b>Total Weight (g):</b> {batch.totalWeight || "N/A"} <br />
              <b>Current Chicks:</b> {batch.currentChicks || "N/A"} <br />
              <b>Feedback / Notes:</b> {batch.feedback || "N/A"}
            </p>
          </>
        )}
      </div>

      {/* Stats Summary */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h6>Total Feed</h6>
            <h4>{totalFeedKg} kg</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h6>Total Dead</h6>
            <h4>{totalDead}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h6>Avg Weight</h6>
            <h4>{avgWeight} g</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h6>FCR</h6>
            <h4>{fcr}</h4>
          </div>
        </div>
      </div>

      {/* Daily Entries */}
      <div className="card shadow p-3 mb-4">
        <h5 className="mb-3">📅 Daily Entries</h5>
        {entries.length === 0 ? (
          <p>No daily entries recorded for this batch.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Weight (g)</th>
                  <th>Dead</th>
                  <th>Feed Packs (75kg)</th>
                  <th>Feed Type</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}</td>
                    <td>{entry.weight}</td>
                    <td>{entry.dead}</td>
                    <td>{entry.feedPacks}</td>
                    <td>{entry.feedType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
    </div>
  );
};

export default BatchDetails;
