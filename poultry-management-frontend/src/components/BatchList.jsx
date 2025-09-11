import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeBatch, setCompleteBatch] = useState(null);
  const [completionData, setCompletionData] = useState({
    totalWeight: "",
    currentChicks: "",
    feedback: "",
  });

  const navigate = useNavigate();

  // Fetch batches
  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/batches");
      setBatches(res.data);
    } catch (err) {
      console.error("❌ Error fetching batches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Open complete modal
  const handleCompleteClick = (batch) => {
    setCompleteBatch(batch);
    setCompletionData({
      totalWeight: "",
      currentChicks: batch.totalChicks,
      feedback: "",
    });
    setShowCompleteModal(true);
  };

  // Submit completion
  const handleSubmitCompletion = async (e) => {
    e.preventDefault();
    if (!completeBatch) return;

    try {
      await axios.put(`http://localhost:5000/api/batches/${completeBatch._id}`, {
        completed: true,
        totalWeight: completionData.totalWeight,
        currentChicks: completionData.currentChicks,
        feedback: completionData.feedback,
      });

      // Update UI instantly
      setBatches((prev) =>
        prev.map((b) =>
          b._id === completeBatch._id
            ? { ...b, completed: true, ...completionData }
            : b
        )
      );

      setShowCompleteModal(false);
      setCompleteBatch(null);
      alert("✅ Batch marked as completed!");
    } catch (err) {
      console.error("❌ Error completing batch:", err);
      alert("Error completing batch");
    }
  };

  if (loading) return <p>Loading batches...</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">🐔 Batch List</h2>

      {batches.length === 0 ? (
        <p>No batches found.</p>
      ) : (
        <div className="row">
          {batches.map((batch) => (
            <div key={batch._id} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{batch.name}</h5>
                  <p className="card-text">
                    <b>Total Chicks:</b> {batch.totalChicks} <br />
                    <b>Start Date:</b>{" "}
                    {batch.startDate
                      ? new Date(batch.startDate).toLocaleDateString()
                      : "N/A"}{" "}
                    <br />
                    <b>Status:</b>{" "}
                    <span
                      className={`badge ${
                        batch.completed ? "bg-danger" : "bg-success"
                      }`}
                    >
                      {batch.completed ? "Completed" : "Active"}
                    </span>
                  </p>

                  {/* Buttons */}
                  {batch.completed ? (
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(`/batch/${batch._id}`)}
                      >
                        👁️ View
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleCompleteClick(batch)}
                      >
                        ✅ Complete Batch
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowCompleteModal(false)}
        >
          <div
            className="modal-content p-4 bg-light rounded"
            style={{ width: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-3">Complete Batch: {completeBatch?.name}</h4>
            <form onSubmit={handleSubmitCompletion}>
              <div className="mb-3">
                <label className="form-label">Total Weight (g)</label>
                <input
                  type="number"
                  className="form-control"
                  value={completionData.totalWeight}
                  onChange={(e) =>
                    setCompletionData({
                      ...completionData,
                      totalWeight: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Current Chicks</label>
                <input
                  type="number"
                  className="form-control"
                  onChange={(e) =>
                    setCompletionData({
                      ...completionData,
                      currentChicks: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Feedback / Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={completionData.feedback}
                  onChange={(e) =>
                    setCompletionData({
                      ...completionData,
                      feedback: e.target.value,
                    })
                  }
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                ✅ Confirm Complete
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchList;
