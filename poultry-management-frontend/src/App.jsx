import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import CreateBatch from "./components/CreateBatch";
import BatchList from "./components/BatchList";
import DataEntryForm from "./components/DataEntryForm";
import About from "./components/About";
import BatchDetails from "./components/BatchDetails"; // ✅ Import new component

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-batch" element={<CreateBatch />} />
          <Route path="/batch-list" element={<BatchList />} />
          <Route path="/data-entry" element={<DataEntryForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/batch/:id" element={<BatchDetails />} /> {/* ✅ New Route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
