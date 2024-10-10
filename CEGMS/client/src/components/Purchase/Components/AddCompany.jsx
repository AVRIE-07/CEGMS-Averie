import React, { useState, useEffect } from "react";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address/index";

function AddCompany() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    region: { code: "", name: "" },
    province: { code: "", name: "" },
    city: { code: "", name: "" },
    barangay: { code: "", name: "" },
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  // Update form values
  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!values.name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!values.email.trim()) {
      validationErrors.email = "Email is required";
    }

    if (!values.phone.trim()) {
      validationErrors.phone = "Phone number is required";
    }

    if (!values.region.code) {
      validationErrors.region = "Region is required";
    }

    if (!values.city.code) {
      validationErrors.city = "City is required";
    }

    if (!values.province.code) {
      validationErrors.province = "Province is required";
    }

    if (!values.barangay.code) {
      validationErrors.barangay = "Barangay is required";
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

  const [regionData, setRegion] = useState([]);
  const [provinceData, setProvince] = useState([]);
  const [cityData, setCity] = useState([]);
  const [barangayData, setBarangay] = useState([]);

  const fetchRegions = () => {
    regions().then((response) => {
      setRegion(response);
    });
  };

  const handleRegionChange = (e) => {
    const selectedRegionCode = e.target.value;
    const selectedRegionName = e.target.selectedOptions[0].text;

    setValues({
      ...values,
      region: { code: selectedRegionCode, name: selectedRegionName },
      province: { code: "", name: "" },
      city: { code: "", name: "" },
      barangay: { code: "", name: "" },
    });

    provinces(selectedRegionCode).then((response) => {
      setProvince(response);
      setCity([]);
      setBarangay([]);
    });
  };

  const handleProvinceChange = (e) => {
    const selectedProvinceCode = e.target.value;
    const selectedProvinceName = e.target.selectedOptions[0].text;

    setValues({
      ...values,
      province: { code: selectedProvinceCode, name: selectedProvinceName },
      city: { code: "", name: "" },
      barangay: { code: "", name: "" },
    });

    cities(selectedProvinceCode).then((response) => {
      setCity(response);
    });
  };

  const handleCityChange = (e) => {
    const selectedCityCode = e.target.value;
    const selectedCityName = e.target.selectedOptions[0].text;

    setValues({
      ...values,
      city: { code: selectedCityCode, name: selectedCityName },
      barangay: { code: "", name: "" },
    });

    barangays(selectedCityCode).then((response) => {
      setBarangay(response);
    });
  };

  const handleBarangayChange = (e) => {
    const selectedBarangayCode = e.target.value;
    const selectedBarangayName = e.target.selectedOptions[0].text;

    setValues({
      ...values,
      barangay: { code: selectedBarangayCode, name: selectedBarangayName },
    });
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return (
    <div
      className="modal fade"
      id="addCompany"
      tabIndex="-1"
      aria-labelledby="addCompany"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content text-dark">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createDocLabel">
              Add Company
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
              {/* Contact Person Details */}
              <div className="d-flex align-items-center mb-3">
                <h1 className="fs-6 mb-0 me-3">Contact Person Details</h1>
                <div className="flex-grow-1 border-bottom border-dark"></div>
              </div>

              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="mb-2 me-2 w-100">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid " : ""
                    }`}
                    placeholder="Name *"
                    name="name"
                    value={values.name}
                    onChange={handleChanges}
                  />
                </div>
                <div className="mb-2 me-2 w-100">
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email *"
                    name="email"
                    value={values.email}
                    onChange={handleChanges}
                  />
                </div>
                <div className="mb-2 w-100">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    placeholder="Phone No. *"
                    name="phone"
                    value={values.phone}
                    onChange={handleChanges}
                  />
                </div>
              </div>

              {/* Company Details */}
              <div className="d-flex align-items-center mb-3">
                <h1 className="fs-6 mb-0 me-3">Company Details</h1>
                <div className="flex-grow-1 border-bottom border-dark"></div>
              </div>

              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="mb-1 me-2" style={{ flex: "1" }}>
                  <div className="mb-3">
                    {/* Region Select */}
                    <select
                      onChange={handleRegionChange}
                      className={`form-select ${
                        errors.region ? "is-invalid" : ""
                      }`}
                      value={values.region.code}
                    >
                      <option value="" disabled>
                        Select Region
                      </option>
                      {regionData.map((item) => (
                        <option key={item.region_code} value={item.region_code}>
                          {item.region_name}
                        </option>
                      ))}
                    </select>
                    {/*
                    <div className="mt-1">
                      {errors.region && (
                        <span className="text-danger">{errors.region}</span>
                      )}
                    </div>*/}
                  </div>

                  {/* City Select */}
                  <div className="mb-3">
                    <select
                      onChange={handleCityChange}
                      className={`form-select ${
                        errors.city ? "is-invalid" : ""
                      }`}
                      value={values.city.code}
                      disabled={!values.province.code}
                    >
                      <option value="" disabled>
                        Select City
                      </option>
                      {cityData.map((item) => (
                        <option key={item.city_code} value={item.city_code}>
                          {item.city_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pincode"
                    name="pincode"
                    value={values.pincode}
                    onChange={handleChanges}
                  />
                </div>

                <div className="mb-1 ms-2" style={{ flex: "1" }}>
                  {/* Province Select */}
                  <div className="mb-3">
                    <select
                      onChange={handleProvinceChange}
                      className={`form-select ${
                        errors.province ? "is-invalid" : ""
                      }`}
                      value={values.province.code}
                      disabled={!values.region.code}
                    >
                      <option value="" disabled>
                        Select Province
                      </option>
                      {provinceData.map((item) => (
                        <option
                          key={item.province_code}
                          value={item.province_code}
                        >
                          {item.province_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Barangay Select */}
                  <div className="mb-3">
                    <select
                      onChange={handleBarangayChange}
                      className={`form-select ${
                        errors.barangay ? "is-invalid" : ""
                      }`}
                      value={values.barangay.code}
                      disabled={!values.city.code}
                    >
                      <option value="" disabled>
                        Select Barangay
                      </option>
                      {barangayData.map((item) => (
                        <option key={item.brgy_code} value={item.brgy_code}>
                          {item.brgy_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {(errors.name ||
                errors.email ||
                errors.phone ||
                errors.region ||
                errors.province ||
                errors.city ||
                errors.barangay) && (
                <div className="alert alert-danger">
                  <span className="text-danger">
                    Please fill in the required details
                  </span>
                </div>
              )}

              <div className="modal-footer px-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Company and Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCompany;
