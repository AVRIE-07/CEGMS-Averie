import React, { useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Purchase.module.css";
import CustomInput from "./Components/CustomInput";
import SelectAddress from "./Components/SelectAddress";
import AddItem2 from "./Components/AddItem2";
import Signature from "./Components/Signature";

function GRN() {
  // Form-level state
  const [values, setValues] = useState({
    documentNo: "",
    documentDate: "",
    deliveryDate: "",
    region: { code: "", name: "" },
    province: { code: "", name: "" },
    city: { code: "", name: "" },
    barangay: { code: "", name: "" },
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const [rows, setRows] = useState([
    {
      id: 1,
      itemID: "",
      description: "",
      orderQuantity: "",
      deliverQuantity: "",
      unitPrice: "",
      lineTotal: "",
    },
  ]);

  // Handle changes for form-level inputs
  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!values.documentNo.trim())
      validationErrors.documentNo = "Document Number is required";
    if (!values.documentDate.trim())
      validationErrors.documentDate = "Document Date is required";
    if (!values.deliveryDate.trim())
      validationErrors.deliveryDate = "Delivery Date is required";
    if (!values.region.code) validationErrors.region = "Region is required";
    if (!values.province.code)
      validationErrors.province = "Province is required";
    if (!values.city.code) validationErrors.city = "City is required";
    if (!values.barangay.code)
      validationErrors.barangay = "Barangay is required";

    rows.forEach((row, index) => {
      if (!row.itemID.trim())
        validationErrors[`itemID-${index}`] = "Item ID is required";
      if (!row.description.trim())
        validationErrors[`description-${index}`] = "Description is required";
      if (!row.orderQuantity.trim())
        validationErrors[`orderQuantity-${index}`] = "Quantity is required";
      if (!row.deliverQuantity.trim())
        validationErrors[`deliverQuantity-${index}`] = "Quantity is required";
      if (!row.unitPrice.trim())
        validationErrors[`unitPrice-${index}`] = "Unit Price is required";
      if (!row.lineTotal.trim())
        validationErrors[`lineTotal-${index}`] = "Line Total is required";
    });

    return validationErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const grandTotal = calculateGrandTotal();
      console.log("Form values:", values);
      console.log("Table rows:", rows);
      console.log("Grand Total:", grandTotal);
    }
  };

  const calculateGrandTotal = () => {
    return rows
      .reduce((total, row) => total + parseFloat(row.lineTotal || 0), 0)
      .toFixed(2);
  };
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <form onSubmit={handleSubmit}>
          <div className="card shadow-sm py-3 px-4 mb-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-file-earmark-text-fill fs-3"></i>
              <h5 className="fw-semibold ms-3 mb-0">
                Return Merchandise Authorization (RMA)
              </h5>
            </div>
          </div>
          {/* Primary Document Details */}
          <div className="card shadow-sm mb-3">
            <div className="bg-info rounded-top px-4 py-3">
              <div className="d-flex align-items-center">
                <h5 className="fw-semibold m-0">Primary Document Details</h5>
              </div>
            </div>
            <div className="card-body px-4 py-3">
              <div className="row">
                <div className="col-md-6">
                  <div className="col-md-12 mb-3">
                    <label className="mb-1 fw-semibold">Document Number</label>
                    <CustomInput
                      label="Document Number"
                      type="text"
                      placeholder="Document Number"
                      name="documentNo"
                      value={values.documentNo}
                      onChange={handleChanges}
                      error={errors.documentNo}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="mb-1 fw-semibold">Document Date</label>
                    <CustomInput
                      label="Document Date"
                      type="date"
                      placeholder="Document Date"
                      name="documentDate"
                      value={values.documentDate}
                      onChange={handleChanges}
                      error={errors.documentDate}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="mb-1 fw-semibold">Delivery Date</label>
                    <CustomInput
                      label="Delivery Date"
                      type="date"
                      placeholder="Delivery Date"
                      name="deliveryDate"
                      value={values.deliveryDate}
                      onChange={handleChanges}
                      error={errors.deliveryDate}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="mb-1 fw-semibold">Pincode</label>
                    <CustomInput
                      label="Pincode"
                      type="text"
                      placeholder="Pincode"
                      name="pincode"
                      value={values.pincode}
                      onChange={handleChanges}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <SelectAddress
                    values={values}
                    setValues={setValues}
                    errors={errors}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="card shadow-sm mb-3">
            <div className="bg-info rounded-top px-4 py-3">
              <div className="d-flex align-items-center">
                <h5 className="fw-semibold m-0">Item Details</h5>
              </div>
            </div>
            <div className="card-body px-4 py-3">
              <AddItem2 rows={rows} setRows={setRows} errors={errors} />
            </div>
          </div>
          <div>
            {Object.keys(errors).length > 0 && (
              <div className="alert alert-danger mt-3">
                <span className="text-danger">
                  Please fill in the required details for all fields.
                </span>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-md-8">
              <Signature></Signature>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm mb-3 border-primary">
                <div className="card-body px-4 py-5">
                  <div className="d-flex justify-content-end align-items-end">
                    <h5 className="fw-semibold m-0">
                      Grand Total: ₱ {calculateGrandTotal()}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-3" type="button">
              SAVE DRAFT
            </button>
            <button className="btn btn-primary" type="submit">
              SAVE AND SEND
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default GRN;
