import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const BatchCompare = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [compareData, setCompareData] = useState(null);

  // Fetch all batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/batches");
        setBatches(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBatches();
  }, []);

  // Fetch comparison data for selected batches
  const fetchComparison = async () => {
    if (selectedBatches.length < 2) {
      alert("Select at least 2 batches to compare!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/batches/compare", {
        batchIds: selectedBatches,
      });
      setCompareData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle select
  const handleSelect = (e) => {
    const value = e.target.value;
    setSelectedBatches(
      Array.from(e.target.selectedOptions, (option) => option.value)
    );
  };

  return (
    <div className="container">
      <h2 className="mb-4 text-info">📊 Batch Comparison</h2>

      {/* Select Batches */}
      <div className="mb-3">
        <label className="form-label">Select Batches to Compare</label>
        <select
          multiple
          className="form-select"
          value={selectedBatches}
          onChange={handleSelect}
        >
          {batches.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {batch.name}
            </option>
          ))}
        </select>
        <button
          className="btn btn-info mt-3"
          onClick={fetchComparison}
        >
          Compare
        </button>
      </div>

      {/* Results */}
      {compareData && (
        <div className="mt-4">
          <div className="card shadow p-3 mb-4">
            <h5 className="text-center">Mortality Comparison</h5>
            <Line data={compareData.mortalityChart} />
          </div>
          <div className="card shadow p-3 mb-4">
            <h5 className="text-center">Feed Consumption Comparison</h5>
            <Line data={compareData.feedChart} />
          </div>
          <div className="card shadow p-3 mb-4">
            <h5 className="text-center">Weight Growth Comparison</h5>
            <Line data={compareData.weightChart} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchCompare;
