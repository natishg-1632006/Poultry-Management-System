import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <div className="text-center p-5 bg-light rounded shadow">
        <h1 className="display-4 fw-bold text-success">
          🐔 Poultry Management System
        </h1>
        <p className="lead text-muted">
          Manage your poultry batches efficiently with daily records, mortality
          tracking, feed usage, and FCR calculation.
        </p>
        <div className="mt-4">
          <Link to="/create-batch" className="btn btn-success btn-lg me-3">
            ➕ Create New Batch
          </Link>
          <Link to="/dashboard" className="btn btn-outline-primary btn-lg">
            📊 View Dashboard
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <h4 className="card-title">🐣 Batch Management</h4>
              <p className="card-text">
                Add, edit, or remove poultry batches. Upload chick images and
                track them until the selling stage.
              </p>
              <Link to="/batch-list" className="btn btn-sm btn-outline-success">
                Manage Batches
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mt-4 mt-md-0">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <h4 className="card-title">📅 Daily Data Entry</h4>
              <p className="card-text">
                Record mortality, feed consumption, and average bird weight on a
                daily basis for accurate tracking.
              </p>
              <Link to="/data-entry" className="btn btn-sm btn-outline-primary">
                Enter Data
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mt-4 mt-md-0">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <h4 className="card-title">📊 Dashboard & Reports</h4>
              <p className="card-text">
                Monitor batch performance, view graphs, calculate FCR, and
                compare current and past batches.
              </p>
              <Link to="/dashboard" className="btn btn-sm btn-outline-dark">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
