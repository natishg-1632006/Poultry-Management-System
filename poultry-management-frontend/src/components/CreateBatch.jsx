import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateBatch = () => {
  const [formData, setFormData] = useState({
    name: "",
    totalChicks: "",
    startDate: "",
    initialWeight: "",
    image: null,
  });
  const [batches, setBatches] = useState([]);
  const [message, setMessage] = useState("");
  const [editBatch, setEditBatch] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all batches
  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/batches");
      setBatches(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch batches");
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("totalChicks", Number(formData.totalChicks));
      data.append("startDate", formData.startDate);
      data.append("initialWeight", Number(formData.initialWeight || 0));
      if (formData.image) data.append("image", formData.image);

      let res;
      if (editBatch) {
        res = await axios.put(`http://localhost:5000/api/batches/${editBatch._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setBatches(batches.map((b) => (b._id === editBatch._id ? res.data : b)));
        setMessage("✅ Batch updated successfully");
      } else {
        res = await axios.post("http://localhost:5000/api/batches", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setBatches([...batches, res.data]);
        setMessage("✅ Batch created successfully!");
      }

      setFormData({ name: "", totalChicks: "", startDate: "", initialWeight: "", image: null });
      setEditBatch(null);
      setShowModal(false);
    } catch (err) {
      setMessage(editBatch ? "❌ Error updating batch" : "❌ Error creating batch");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/batches/${id}`);
      setBatches(batches.filter((b) => b._id !== id));
      setMessage("✅ Batch deleted successfully");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting batch");
    }
  };

  const handleEditClick = (batch) => {
    setEditBatch(batch);
    setFormData({
      name: batch.name,
      totalChicks: batch.totalChicks,
      startDate: batch.startDate?.slice(0, 10) || "",
      initialWeight: batch.initialWeight,
      image: null,
    });
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">📋 Batch List</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            setEditBatch(null);
            setFormData({ name: "", totalChicks: "", startDate: "", initialWeight: "", image: null });
            setShowModal(true);
          }}
        >
          ➕ Create Batch
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="table-responsive mb-4">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Total Chicks</th>
              <th>Start Date</th>
              <th>Initial Weight (g)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch._id}>
                <td>{batch.name}</td>
                <td>{batch.totalChicks}</td>
                <td>{batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "N/A"}</td>
                <td>{batch.initialWeight}</td>
                <td>
                  <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleEditClick(batch)}>✏️ Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(batch._id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            style={{ width: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-3">{editBatch ? "Edit Batch" : "Create Batch"}</h4>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Batch Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Total Chicks</label>
                <input type="number" className="form-control" name="totalChicks" value={formData.totalChicks} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Initial Weight (g)</label>
                <input type="number" className="form-control" name="initialWeight" value={formData.initialWeight} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload Image</label>
                <input type="file" className="form-control" name="image" accept="image/*" onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary w-100">{editBatch ? "Update Batch" : "Create Batch"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBatch;
