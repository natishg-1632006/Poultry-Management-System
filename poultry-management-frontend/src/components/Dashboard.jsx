import React, { useEffect, useState } from "react";
import axios from "axios";
import BatchList from "./BatchList";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [batches, setBatches] = useState([]);
  const [dailyEntries, setDailyEntries] = useState([]);
  const [activeBatch, setActiveBatch] = useState(null);
  const [message, setMessage] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionData, setCompletionData] = useState({
    totalWeight: "",
    currentChicks: "",
    feedback: "",
  });

  // Fetch batches
  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/batches");
      setBatches(res.data);
      const active = res.data.find((b) => !b.completed);
      setActiveBatch(active || null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch batches");
    }
  };

  // Fetch daily entries
  const fetchDailyEntries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/daily-entries");
      setDailyEntries(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch daily entries");
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchDailyEntries();
  }, []);

  // Active batch calculations
  const batchEntries = dailyEntries.filter(
    (entry) => entry.batch?._id === activeBatch?._id
  );

  const totalChicks = Number(activeBatch?.totalChicks || 0);
  const deadChicks = batchEntries.reduce(
    (sum, e) => sum + Number(e.dead || 0),
    0
  );
  const currentChicks = totalChicks - deadChicks;
  const feedConsumed = batchEntries.reduce(
    (sum, e) => sum + Number(e.feedPacks || 0) * 75,
    0
  );
  const totalWeight = batchEntries.reduce(
    (sum, e) => sum + Number(e.weight || 0),
    0
  );
  const FCR =
    feedConsumed && totalWeight ? (feedConsumed / totalWeight).toFixed(2) : 0;
  const avgDailyWeight = batchEntries.length
    ? (totalWeight / batchEntries.length).toFixed(2)
    : 0;

  const feedBreakdown = {
    Starter: batchEntries
      .filter((e) => e.feedType === "Starter")
      .reduce((sum, e) => sum + Number(e.feedPacks || 0) * 75, 0),
    Grower: batchEntries
      .filter((e) => e.feedType === "Grower")
      .reduce((sum, e) => sum + Number(e.feedPacks || 0) * 75, 0),
    Finisher: batchEntries
      .filter((e) => e.feedType === "Finisher")
      .reduce((sum, e) => sum + Number(e.feedPacks || 0) * 75, 0),
  };

  // ✅ Daily Mortality Graph
  const dailyDeadGraph = batchEntries.map((e, index) => ({
    day: `Day ${index + 1}`,
    dead: Number(e.dead || 0),
  }));

  // ✅ FCR Data across completed batches
  const batchFcrData = batches
    .filter((b) => b.completed)
    .map((b) => {
      const entries = dailyEntries.filter((e) => e.batch?._id === b._id);
      const feed = entries.reduce(
        (sum, e) => sum + Number(e.feedPacks || 0) * 75,
        0
      );
      const weight = entries.reduce(
        (sum, e) => sum + Number(e.weight || 0),
        0
      );
      const fcrValue = feed && weight ? (feed / weight).toFixed(2) : 0;
      return { batch: b.name || `Batch ${b._id}`, fcr: fcrValue };
    });

  // Complete batch
  const handleCompleteBatch = () => {
    if (!activeBatch) return;
    setCompletionData({
      totalWeight: totalWeight || "",
      currentChicks: currentChicks || "",
      feedback: "",
    });
    setShowCompleteModal(true);
  };

  const handleSubmitCompletion = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/batches/${activeBatch._id}`, {
        completed: true,
        totalWeight: completionData.totalWeight,
        currentChicks: completionData.currentChicks,
        feedback: completionData.feedback,
      });
      setMessage("✅ Batch marked as completed");
      setShowCompleteModal(false);
      setActiveBatch(null);
      fetchBatches();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error completing batch");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary text-center">📊 Dashboard</h2>
      {message && <div className="alert alert-info text-center">{message}</div>}

      {/* Active Batch Stats */}
      {activeBatch ? (
        <>
          <div className="d-flex justify-content-end mb-2">
            <span
              className={`badge ${
                activeBatch.completed ? "bg-danger" : "bg-success"
              } p-2`}
            >
              {activeBatch.completed ? "Completed" : "Not Completed"}
            </span>
          </div>

          {/* Stats cards */}
          <div className="row g-3 mb-4">
            {[
              { label: "Total Chicks", value: totalChicks, color: "bg-light text-dark" },
              { label: "Current Chicks", value: currentChicks, color: "bg-success text-white" },
              { label: "Dead Chicks", value: deadChicks, color: "bg-danger text-white" },
              { label: "Feed Consumed (kg)", value: feedConsumed, color: "bg-warning text-dark" },
              { label: "FCR", value: FCR, color: "bg-info text-white" },
              { label: "Avg Daily Weight (g)", value: avgDailyWeight, color: "bg-primary text-white" },
            ].map((card, idx) => (
              <div className="col-md-2 col-sm-6" key={idx}>
                <div className={`card p-3 text-center shadow ${card.color}`}>
                  <h6>{card.label}</h6>
                  <h4>{card.value}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Feed breakdown */}
          <div className="row g-3 mb-4">
            {Object.entries(feedBreakdown).map(([type, value]) => (
              <div className="col-md-4 col-sm-12" key={type}>
                <div className="card p-3 text-center shadow bg-light">
                  <h6>{type} Feed (kg)</h6>
                  <h4>{value}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Daily Mortality Graph */}
          <div className="card p-3 shadow mb-4">
            <h5 className="mb-3 text-center">Daily Mortality (Dead Chicks)</h5>
            {dailyDeadGraph.length === 0 ? (
              <p className="text-center">No mortality data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dailyDeadGraph}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barCategoryGap="5%" 
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="dead"
                    fill="#ff0000"
                    name="Dead Chicks"
                    barSize={25}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Daily Entries Table */}
          <div className="card p-3 shadow mb-4">
            <h5 className="mb-3 text-center">Daily Entries</h5>
            {batchEntries.length === 0 ? (
              <p className="text-center">No daily entries yet.</p>
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
                    {batchEntries.map((e) => (
                      <tr key={e._id}>
                        <td>{e.date ? new Date(e.date).toLocaleDateString() : "N/A"}</td>
                        <td>{e.weight}</td>
                        <td>{e.dead}</td>
                        <td>{e.feedPacks}</td>
                        <td>{e.feedType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <div className="alert alert-warning text-center">
            No active batch. Add a new batch to start.
          </div>
          <div className="alert alert-primary text-center">
            <p className="text-center">No daily entries yet.</p>
          </div>
        </div>
      )}

      {/* Completed Batches */}
      <div className="card p-3 shadow mb-4">
        <h5 className="mb-3 text-center">All Batches</h5>
        <BatchList batches={batches} />
      </div>

      {/* ✅ Batch-wise FCR Graph */}
      <div className="card p-3 shadow mb-4">
        <h5 className="mb-3 text-center">FCR Comparison by Batch</h5>
        {batchFcrData.length === 0 ? (
          <p className="text-center">No completed batches yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={batchFcrData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="5%" // ✅ reduce gap between bars
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="batch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="fcr" fill="#8884d8" barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Completion Modal */}
      {showCompleteModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
          onClick={() => setShowCompleteModal(false)}
        >
          <div
            className="modal-content p-4 bg-light rounded"
            style={{ width: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-3">Complete Batch: {activeBatch?.name}</h5>
            <form onSubmit={handleSubmitCompletion}>
              <div className="mb-3">
                <label className="form-label">Total Weight (g)</label>
                <input
                  type="number"
                  className="form-control"
                  value={completionData.totalWeight}
                  onChange={(e) =>
                    setCompletionData({ ...completionData, totalWeight: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Current Chicks</label>
                <input
                  type="number"
                  className="form-control"
                  value={completionData.currentChicks}
                  onChange={(e) =>
                    setCompletionData({ ...completionData, currentChicks: e.target.value })
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
                    setCompletionData({ ...completionData, feedback: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
