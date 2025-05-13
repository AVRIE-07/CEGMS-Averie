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
import Checkbox from "@mui/material/Checkbox";
import EditIcon from '@mui/icons-material/Edit';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import deepPurple from "@mui/material/colors/deepPurple";
import Avatar from "@mui/material/Avatar";
import GeneratePO from "../../components/Modals/GeneratePO";
import CustomizedSnackbars from "../../components/SnackBar";
import ConfirmationModal from "../../components/Modals/CustomizeConfirmation";

import rmaService from "../../services/rmaService";
import { generateCustomGRNId, generateCustomPurchaseOrderId, generateCustomRMAId } from "../../customize/customizeId";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const ArchivedRMA = () => {
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
  const [rmas, setRMAs] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getAllArchivedRMAs();
    window.scrollTo(0, 0);
  }, []);

  const getAllArchivedRMAs = async () => {
    try {
      const res = await rmaService.getAllArchived();
      if (res.status === 200 && Array.isArray(res.data)) {
        setRMAs(res.data);
        console.log("Rmas: ", res.data)
      }
    } catch (error) {
      console.error("Failed to fetch rmas:", error);
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Archived Return Merchandise Authorization</h5>
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
                title={"Total Generated RMA"}
                value={3} 
              />
              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                title={"Total Archived RMA"}
                value={1} 
              />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={
                location.pathname === "/rma"
                  ? 0
                  : location.pathname === "/archived-rma"
                  ? 1
                  : false
              }
              onChange={(event, newValue) => {
                if (newValue === 0) {
                  navigate("/rma");
                } else if (newValue === 1) {
                  navigate("/archived-rma");
                } 
              }}
              aria-label="RMA Tabs"
            >
              <Tab label="Generated RMA" />
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
                  <th>RMA ID</th>
                  <th>GRN ID</th>
                  <th style={{ width: "300px" }}>SUPPLIER</th>
                  <th>CONTACT</th>
                  <th>ADDRESS</th>
                  <th>TOTAL RETURN PRODUCTS</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
              {rmas.length > 0 ? (
                  rmas.map((rma, index) => (
                <tr key={rma._id}>
                  <td>
                    <div className="d-flex align-items-center">
                     <span>{generateCustomRMAId(rma._id)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                     <span>{generateCustomGRNId(rma.grn_id._id)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center productBox">
                      <div className="imgWrapper">
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>
                          {rma.supplier_id.company_name?.charAt(0)}
                        </Avatar>
                      </div>
                      <div className="info pl-3">
                        <h6>{rma.supplier_id.company_name}</h6>
                        <p>{rma.supplier_id.company_email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{rma.po_id.supplier.person_number}</td>
                  <td>{rma.po_id.supplier.company_city}, {rma.po_id.supplier.company_province}, {rma.po_id.supplier.company_country},</td>
                  <td>{rma.items.length}</td>
                  <td>{rma.return_status}</td>
                </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No return merchandise authorization found.
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
            <GeneratePO open={open} handleClose={handleClose} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArchivedRMA;
