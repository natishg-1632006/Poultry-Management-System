import React, { useState, useEffect } from "react";
import axios from "axios";

const DataEntryForm = () => {
  const [formData, setFormData] = useState({
    batchId: "",
    date: "",
    weight: "",
    dead: "",
    feedPacks: "",
    feedType: "Starter",
  });

  const [currentBatch, setCurrentBatch] = useState(null); // Only current batch
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState("");
  const [editEntry, setEditEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch current active batch
  const fetchCurrentBatch = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/batches/current");
      if (res.data) setCurrentBatch(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch current batch");
    }
  };

  // Fetch daily entries for current batch
  const fetchEntries = async () => {
    if (!currentBatch) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/daily-entries/batch/${currentBatch._id}`);
      setEntries(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch daily entries");
    }
  };

  useEffect(() => {
    fetchCurrentBatch();
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [currentBatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (entry) => {
    setEditEntry(entry);
    setFormData({
      batchId: entry.batch._id,
      date: entry.date?.slice(0, 10) || "",
      weight: entry.weight,
      dead: entry.dead,
      feedPacks: entry.feedPacks,
      feedType: entry.feedType,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentBatch) {
      setMessage("❌ No active batch to add entry");
      return;
    }

    const payload = {
      batch: currentBatch._id,
      date: formData.date,
      weight: formData.weight,
      dead: formData.dead,
      feedPacks: formData.feedPacks,
      feedType: formData.feedType,
    };

    try {
      let res;
      if (editEntry) {
        res = await axios.put(`http://localhost:5000/api/daily-entries/${editEntry._id}`, payload);
        setEntries(entries.map((entry) => (entry._id === editEntry._id ? res.data : entry)));
        setMessage("✅ Entry updated successfully");
      } else {
        res = await axios.post("http://localhost:5000/api/daily-entries", payload);
        setEntries([...entries, res.data]);
        setMessage("✅ Entry added successfully");
      }

      setFormData({ batchId: "", date: "", weight: "", dead: "", feedPacks: "", feedType: "Starter" });
      setEditEntry(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setMessage(editEntry ? "❌ Error updating entry" : "❌ Error adding entry");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/daily-entries/${id}`);
      setEntries(entries.filter((e) => e._id !== id));
      setMessage("✅ Entry deleted successfully");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting entry");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">📋 Daily Data Entry</h2>

      {message && <div className="alert alert-info">{message}</div>}

      {!currentBatch ? (
        <div className="alert alert-warning">No active batch. Please create a batch first.</div>
      ) : (
        <>
          <button
            className="btn btn-success mb-3"
            onClick={() => {
              setEditEntry(null);
              setFormData({ batchId: "", date: "", weight: "", dead: "", feedPacks: "", feedType: "Starter" });
              setShowModal(true);
            }}
          >
            ➕ Add Daily Entry for "{currentBatch.name}"
          </button>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Weight (g)</th>
                  <th>Dead</th>
                  <th>Feed Packs (75kg)</th>
                  <th>Feed Type</th>
                  <th>Actions</th>
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
                    <td>
                      <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleEditClick(entry)}>✏️ Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(entry._id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
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
              onClick={() => setShowModal(false)}
            >
              <div
                className="modal-content p-4 bg-light rounded"
                style={{ width: "450px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="mb-3">{editEntry ? "Edit Entry" : "Add Entry"}</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Weight (g)</label>
                    <input type="number" className="form-control" name="weight" value={formData.weight} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dead</label>
                    <input type="number" className="form-control" name="dead" value={formData.dead} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Feed Packs (75kg)</label>
                    <input type="number" className="form-control" name="feedPacks" value={formData.feedPacks} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Feed Type</label>
                    <select className="form-control" name="feedType" value={formData.feedType} onChange={handleChange} required>
                      <option value="Starter">Starter</option>
                      <option value="Grower">Grower</option>
                      <option value="Finisher">Finisher</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    {editEntry ? "Update Entry" : "Add Entry"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataEntryForm;
