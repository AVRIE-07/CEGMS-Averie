import React, { useState, useEffect } from "react";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address/index";
import CustomSelect from "./CustomSelect";

function SelectAddress({ values, setValues, errors }) {
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
    <div>
      <div className="col-md-12 mb-3">
        <label className="mb-1 fw-semibold">Region</label>
        <CustomSelect
          label="Region"
          name="region"
          value={values.region.code}
          handleChange={handleRegionChange}
          options={regionData.map((item) => ({
            code: item.region_code,
            name: item.region_name,
          }))}
          error={errors.region}
          placeholder="Select Region"
        />
      </div>

      <div className="col-md-12 mb-3">
        <label className="mb-1 fw-semibold">Province</label>
        <CustomSelect
          label="Province"
          name="province"
          value={values.province.code}
          handleChange={handleProvinceChange}
          options={provinceData.map((item) => ({
            code: item.province_code,
            name: item.province_name,
          }))}
          error={errors.province}
          placeholder="Select Province"
          disabled={!values.region.code}
        />
      </div>

      <div className="col-md-12 mb-3">
        <label className="mb-1 fw-semibold">City</label>
        <CustomSelect
          label="City / Municipality"
          name="city"
          value={values.city.code}
          handleChange={handleCityChange}
          options={cityData.map((item) => ({
            code: item.city_code,
            name: item.city_name,
          }))}
          error={errors.city}
          placeholder="Select City"
          disabled={!values.province.code}
        />
      </div>

      <div className="col-md-12 mb-3">
        <label className="mb-1 fw-semibold">Barangay</label>
        <CustomSelect
          label="Barangay"
          name="barangay"
          value={values.barangay.code}
          handleChange={handleBarangayChange}
          options={barangayData.map((item) => ({
            code: item.brgy_code,
            name: item.brgy_name,
          }))}
          error={errors.barangay}
          placeholder="Select Barangay"
          disabled={!values.city.code}
        />
      </div>
    </div>
  );
}

export default SelectAddress;
