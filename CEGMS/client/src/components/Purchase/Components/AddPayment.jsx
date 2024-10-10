import { useState } from "react";

function AddPayment() {
  const [values, setValues] = useState({
    documentNo: "",
    inwardNo: "",
    paymentDate: "",
    amountDue: "",
    mop: "",
    status: "",
  });

  const [errors, setErrors] = useState({});

  // Update form values
  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!values.documentNo.trim()) {
      validationErrors.documentNo = "Name is required";
    }

    if (!values.inwardNo.trim()) {
      validationErrors.inwardNo = "Email is required";
    }

    if (!values.paymentDate.trim()) {
      validationErrors.paymentDate = "Phone number is required";
    }

    if (!values.amountDue.trim()) {
      validationErrors.amountDue = "Region is required";
    }

    if (!values.mop.trim()) {
      validationErrors.mop = "City is required";
    }

    if (!values.status.trim()) {
      validationErrors.status = "Province is required";
    }

    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log(values); // Proceed with form submission
    }
  };
  return (
    <div
      className="modal fade"
      id="addPayment"
      tabIndex="-1"
      aria-labelledby="addPayment"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content text-dark">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createDocLabel">
              Add Payment
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4 pb-0">
            <form onSubmit={handleSubmit}>
              <div className="w-100">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.documentNo ? "is-invalid " : ""
                    }`}
                    placeholder="Document Number"
                    name="documentNo"
                    onChange={handleChanges}
                    value={values.documentNo}
                  />
                  <label for="floatingInput">Document Number</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.inwardNo ? "is-invalid " : ""
                    }`}
                    placeholder="Inward Number"
                    name="inwardNo"
                    onChange={handleChanges}
                    value={values.inwardNo}
                  />
                  <label for="floatingInput">Inward Number</label>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="date"
                      className={`form-control ${
                        errors.paymentDate ? "is-invalid " : ""
                      }`}
                      placeholder="Payment Date"
                      name="paymentDate"
                      onChange={handleChanges}
                      value={values.paymentDate}
                    />
                    <label for="floatingInput">Payment Date</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.amountDue ? "is-invalid " : ""
                      }`}
                      placeholder="Amount Due"
                      name="amountDue"
                      onChange={handleChanges}
                      value={values.amountDue}
                    />
                    <label for="floatingInput">Amount Due</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.mop ? "is-invalid " : ""
                      }`}
                      placeholder="Mode of Payment"
                      name="mop"
                      onChange={handleChanges}
                      value={values.mop}
                    />
                    <label for="floatingInput">Mode of Payment</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.status ? "is-invalid " : ""
                      }`}
                      placeholder="Status"
                      name="status"
                      onChange={handleChanges}
                      value={values.status}
                    />
                    <label for="floatingInput">Status</label>
                  </div>
                </div>
              </div>

              <div className="modal-footer px-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPayment;
