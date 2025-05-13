import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import DashboardBox from "../Dashboard/components/dashboardBox";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import EditIcon from '@mui/icons-material/Edit';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import deepPurple from "@mui/material/colors/deepPurple";
import Avatar from "@mui/material/Avatar";
import GeneratePO from "../../components/Modals/GeneratePO";
import CustomizedSnackbars from "../../components/SnackBar";
import ConfirmationModal from "../../components/Modals/CustomizeConfirmation";

import grnService from "../../services/grnService";
import { generateCustomGRNId, generateCustomPurchaseOrderId } from "../../customize/customizeId";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const GRN = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showBy, setshowBy] = useState("");
  const [showBysetCatBy, setCatBy] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);
  const [selectedID, setSelectedID] = useState("");
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [grns, setGRNs] = useState([]);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllGRNS();
    const shouldShowSnackbar = localStorage.getItem("showSnackbar");
    const snackbarMsg = localStorage.getItem("snackbarMessage");

    if (shouldShowSnackbar === "true") {
      setMessage(snackbarMsg || "Success!");
      setOpenSnackbar(true);
      localStorage.removeItem("showSnackbar");
      localStorage.removeItem("snackbarMessage");
    }
  }, []);

  const getAllGRNS = async () => {
    try {
      const res = await grnService.getAll();
      if (res.status === 200 && Array.isArray(res.data)) {
        setGRNs(res.data);
        console.log("Grns: ", res.data)
      }
    } catch (error) {
      console.error("Failed to fetch GRN:", error);
    }
  };

  const handleEditGRN = (grn) => {
    navigate("/edit-generated-grn", {
      state: { selectedGRN: grn }
    });
  };

  const handleConfirmArchive = async (id) => {
    try {
      await grnService.archive(id);
      localStorage.setItem("snackbarMessage", "Purchase Order archived successfully!");
      localStorage.setItem("showSnackbar", "true");
      window.location.reload();
    } catch (error) {
      console.error("Archive failed:", error);
    }
  };
  
  const handleConfirmDelete = async (id) => {
    try {
      await grnService.delete(id);
      localStorage.setItem("snackbarMessage", "Purchase Order delete successfully!");
      localStorage.setItem("showSnackbar", "true");
      window.location.reload();
      setMessage("Purchase Order delete successfully!")
      setOpenSnackbar(true)
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenDelete = (id) => {
    setOpenDeleteModal(true);
    setSelectedID(id)
  };

  const handleOpenArchive = (id) => {
    setOpenArchiveModal(true);
    setSelectedID(id)
  };


  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Goods Received Note</h5>
        </div>

        <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2">
          <div className="col-md-12">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox
                color={["#1da256", "#48d483"]}
                title={"Number of supplier"}
                value={2}
              />
              <DashboardBox
                color={["#c012e2", "#eb64fe"]}
                title={"Total Generated GRN"}
                value={3} 
              />
              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                title={"Total Archived GRN"}
                value={1} 
              />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={
                location.pathname === "/grn"
                  ? 0
                  : location.pathname === "/archived-grn"
                  ? 1
                  : false
              }
              onChange={(event, newValue) => {
                if (newValue === 0) {
                  navigate("/grn");
                } else if (newValue === 1) {
                  navigate("/archived-grn");
                } 
              }}
              aria-label="GRN Tabs"
            >
              <Tab label="Generated GRN" />
              <Tab label="Archived" />
            </Tabs>
          </Box>
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
                  <th>GRN ID</th>
                  <th>PO ID</th>
                  <th style={{ width: "300px" }}>SUPPLIER</th>
                  <th>CONTACT</th>
                  <th>ADDRESS</th>
                  <th>ORDERED ITEMS</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
              {grns.length > 0 ? (
                  grns.map((grn, index) => (
                <tr key={grn._id}>
                  <td>
                    <div className="d-flex align-items-center">
                     <span>{generateCustomGRNId(grn._id)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                     <span>{generateCustomPurchaseOrderId(grn.po_id._id)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center productBox">
                      <div className="imgWrapper">
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>
                          {grn.supplier_id.company_name?.charAt(0)}
                        </Avatar>
                      </div>
                      <div className="info pl-3">
                        <h6>{grn.supplier_id.company_name}</h6>
                        <p>{grn.supplier_id.company_email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{grn.po_id.supplier.person_number}</td>
                  <td>{grn.po_id.supplier.company_city}, {grn.po_id.supplier.company_province}, {grn.po_id.supplier.company_country},</td>
                  <td>{grn.items.length}</td>
                  <td>{grn.order_status}</td>
                  <td>
                    <div className="align-items-center d-flex justify-content-between">
                      {grn.order_status === "Draft" ? (
                        <>
                          <Button variant="outlined" color="error" onClick={() => handleOpenDelete(grn._id)}>
                            DELETE
                          </Button>
                          <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => handleEditGRN(grn)}>
                            EDIT
                          </Button>
                        </>
                      ) : grn.order_status === "Approved" ? (
                        <Button variant="contained" color="secondary" onClick={() => handleOpenArchive(grn._id)}>
                          ARCHIVE
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No good received notes found.
                    </td>
                  </tr>
                )}
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
            </div>
          </div>
          <ConfirmationModal
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
              onConfirm={() => handleConfirmDelete(selectedID)}
              title="Delete Purchase Order"
              message="Are you sure you want to delete this purchase order? This action cannot be undone."
              nameButton="Delete"
            />

            <ConfirmationModal
              open={openArchiveModal}
              onClose={() => setOpenArchiveModal(false)}
              onConfirm={() => handleConfirmArchive(selectedID)}
              title="Archive Purchase Order"
              message="Are you sure you want to archive this purchase order?"
              nameButton="Archive"
            />

            <CustomizedSnackbars
              open={openSnackbar}
              handleClose={handleCloseSnackbar}
              message={message}
            />
        </div>
      </div>
    </>
  );
};

export default GRN;
