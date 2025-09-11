import React, { useEffect, useState } from "react";
import axios from "axios";

const BatchHistory = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/batches");
        setBatches(res.data);
      } catch (err) {
        console.error("Error fetching batch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
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

  if (loading) return <p>Loading batch history...</p>;

  return (
    <div className="mt-4">
      <h3 className="text-success mb-3">📦 Batch History</h3>
      {batches.length === 0 ? (
        <p>No batch records found.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Batch Name</th>
              <th>Total Chicks</th>
              <th>Start Date</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch._id}>
                <td>{batch.name}</td>
                <td>{batch.totalChicks}</td>
                <td>{formatDate(batch.startDate)}</td>
                <td>
                  {batch.imageUrl ? (
                    <img
                      src={`http://localhost:5000/${batch.imageUrl}`}
                      alt="Chick"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BatchHistory;

