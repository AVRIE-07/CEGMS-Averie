import { FaUserCircle } from "react-icons/fa";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";

import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DashboardBox from "../Dashboard/components/dashboardBox";

import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import userService from "../../services/userService";
import UserAvatarLetter from "../../components/userAvatarLetter";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

import supplierService from "../../services/supplierService";
import { generateCustomSupplierId } from "../../customize/customizeId";

import EditSupplierModal from "../../components/Modals/EditSupplier";
import ConfirmationModal from "../../components/Modals/DeleteSupplier";
import CustomizedSnackbars from "../../components/SnackBar";

const ViewSupplier = () => {
  const [showBy, setshowBy] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [showBysetCatBy, setCatBy] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await supplierService.getAll();
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleUpdateSupplier = async (updatedData) => {
    if (selectedSupplier) {
      try {
        await supplierService.update(selectedSupplier._id, updatedData);
        console.log("Update successful!"); 
        setIsEditModalOpen(false);
        fetchSuppliers(); 
      } catch (error) {
        console.error("Failed to update supplier:", error.response?.data || error);
      }
    }
  };

  const handleDeleteClick = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSupplier) {
      try {
        await supplierService.delete(selectedSupplier._id);
        setIsDeleteModalOpen(false);
        setOpenSnackbar(true);
        setSuppliers(suppliers.filter(s => s._id !== selectedSupplier._id));
        setSelectedSupplier(null);
      } catch (error) {
        console.error("Failed to delete supplier:", error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Supplier List</h5>
          
        </div>

        <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2">
          <div className="col-md-12">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox
                color={["#1da256", "#48d483"]}
                icon={<FaUserCircle />}
                grow={true}
                title="Total Users"
              />
              <DashboardBox
                color={["#c012e2", "#eb64fe"]}
                icon={<FaUserCircle />}
                title="Pending Users"
              />

              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                icon={<FaUserCircle />}
                title="Banned Users"
              />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">Users</h3>
          <div className="row cardFilters mt-3">
            <div className="col-md-3">
              <h4>SHOW BY</h4>
              <FormControl size="small" className="w-100">
                <Select
                  value={showBy}
                  onChange={(e) => setshowBy(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  labelId="demo-select-small-label"
                  className="w-100"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="col-md-3">
              <h4>CATEGORY BY</h4>
              <FormControl size="small" className="w-100">
                <Select
                  value={showBysetCatBy}
                  onChange={(e) => setCatBy(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  labelId="demo-select-small-label"
                  className="w-100"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped v-align">
              <thead className="thead-dark">
                <tr>
                  <th>SUPPLIER ID</th>
                  <th style={{ width: "300px" }}>NAME</th>
                  <th>ADDRESS</th>
                  <th>CONTACT PERSON</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <Checkbox {...label} /> <span>{generateCustomSupplierId(supplier._id)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center productBox">
                        <div className="imgWrapper">
                          <UserAvatarLetter
                            first_name={supplier.company_name}
                          />
                        </div>
                        <div className="info pl-3">
                          <h6>
                            {supplier.company_name}
                          </h6>
                          <p>{supplier.company_email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{supplier.company_city} {supplier.company_province} {supplier.company_country}</td>
                    <td>
                      <div className="d-flex align-items-center productBox">
                          <div className="imgWrapper">
                            <UserAvatarLetter
                              first_name={supplier.person_name}
                            />
                          </div>
                          <div className="info pl-3">
                            <h6>
                              {supplier.person_name}
                            </h6>
                            <p>{supplier.person_number}</p>
                            <p>{supplier.person_email}</p>
                          </div>
                        </div>
                    </td>
                    <td>
                      <div className="actions d-flex align-items-center">
                        <Button className="success" color="success" onClick={() => handleEditClick(supplier)}>
                          <FaPencilAlt />
                        </Button>
                        <Button className="error" color="error" onClick={() => handleDeleteClick(supplier)}>
                          <MdDelete />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex tableFooter">
              <p>
                showing <b>12</b> of <b>60</b> results
              </p>
              <Pagination
                count={10}
                color="primary"
                className="pagination"
                showFirstButton
                showLastButton
              />

            <EditSupplierModal
              open={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              supplier={selectedSupplier}
              onUpdate={handleUpdateSupplier}
            />

            <ConfirmationModal
              open={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
              title="Delete Supplier"
              message="Are you sure you want to delete this supplier? This action cannot be undone."
            />

            <CustomizedSnackbars
              open={openSnackbar}
              handleClose={handleCloseSnackbar}
              message="Supplier deleted successfully!"
            />

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSupplier;
