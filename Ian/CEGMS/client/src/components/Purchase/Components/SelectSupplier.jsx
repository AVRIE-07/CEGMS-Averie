import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectSupplier() {
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    setSelectedSupplier(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const redirectDestination = localStorage.getItem("redirectDestination"); // Retrieve the stored link

    if (selectedSupplier && redirectDestination) {
      navigate(redirectDestination); // Redirect to the stored link
      setTimeout(() => {
        window.location.reload(); // Auto refresh the page
      }, 300);
    } else {
      alert("Please select a supplier."); // Alert if no supplier is selected
    }
  };

  return (
    <div
      className="modal fade"
      id="createDoc"
      tabIndex="-1"
      aria-labelledby="createDocLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-dark">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createDocLabel">
              Please Add/Select Supplier
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="fs-6 mb-0">Select Supplier</h1>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#addCompany"
              >
                + Add New Company
              </button>
            </div>
            <select
              className="form-select border-bottom border-2 border-dark rounded-0 border-top-0 border-end-0 border-start-0"
              aria-label="Default select example"
              value={selectedSupplier}
              onChange={handleSelectChange}
            >
              <option value="">Select Supplier</option>
              <option value="1">Company 1</option>
              <option value="2">Company 2</option>
              <option value="3">Company 3</option>
            </select>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Select and Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectSupplier;
