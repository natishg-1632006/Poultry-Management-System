import React from "react";

const About = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Side - Image */}
        <div className="col-md-6 mb-4 mb-md-0">
          <img
            src="https://img.freepik.com/free-vector/farm-animals-illustration_1284-20325.jpg"
            alt="Poultry Management"
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Right Side - Text */}
        <div className="col-md-6">
          <h2 className="text-primary mb-3">About Our System</h2>
          <p className="lead">
            The <strong>Poultry Management System</strong> is designed to make
            poultry farming smarter, more efficient, and data-driven. It helps
            farmers track and manage batches, daily records, feed, mortality,
            and growth statistics in one place.
          </p>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item">
              ✅ Easy batch creation and tracking
            </li>
            <li className="list-group-item">
              ✅ Daily data entry for mortality, feed, and weight
            </li>
            <li className="list-group-item">
              ✅ Automatic FCR calculation
            </li>
            <li className="list-group-item">
              ✅ Dashboard with insightful graphs and reports
            </li>
          </ul>
          <p>
            With this system, farmers can make better decisions, reduce manual
            errors, and maximize profitability while ensuring better bird
            health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
