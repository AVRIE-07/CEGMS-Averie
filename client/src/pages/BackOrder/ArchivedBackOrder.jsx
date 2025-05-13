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
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import deepPurple from "@mui/material/colors/deepPurple";
import Avatar from "@mui/material/Avatar";
import CustomizedSnackbars from "../../components/SnackBar";

import backorderService from "../../services/backorderService";
import { generateCustomGRNId, generateCustomPurchaseOrderId, generateCustomBackOrderId } from "../../customize/customizeId";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const ArchivedBackOrder = () => {
  const navigate = useNavigate();
  const [showBy, setshowBy] = useState("");
  const [showBysetCatBy, setCatBy] = useState("");
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [backorders, setBackorders] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllArchivedBackOrders();
  }, []);

  const getAllArchivedBackOrders = async () => {
    try {
      const res = await backorderService.getAllArchived();
      if (res.status === 200 && Array.isArray(res.data)) {
        setBackorders(res.data);
        console.log("Backorders: ", res.data)
      }
    } catch (error) {
      console.error("Failed to fetch backorders:", error);
    }
  };



  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Archived Backorder</h5>
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
                title={"Total Generated Backorder"}
                value={3} 
              />
              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                title={"Total Archived Backorder"}
                value={1} 
              />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={
                location.pathname === "/back-order"
                  ? 0
                  : location.pathname === "/archived-back-order"
                  ? 1
                  : false
              }
              onChange={(event, newValue) => {
                if (newValue === 0) {
                  navigate("/back-order");
                } else if (newValue === 1) {
                  navigate("/archived-back-order");
                } 
              }}
              aria-label="Backorder Tabs"
            >
              <Tab label="Generated Backorder" />
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
                  <th>BACKORDER ID</th>
                  <th>PO ID</th>
                  <th style={{ width: "300px" }}>SUPPLIER</th>
                  <th>TOTAL PRODUCTS</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
              {backorders.length > 0 ? (
                  backorders.map((backorder, index) => (
                <tr key={backorder._id}>
                  <td>
                    <div className="d-flex align-items-center">
                     <span>{generateCustomBackOrderId(backorder._id)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                     <span>{generateCustomPurchaseOrderId(backorder.po_id._id)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center productBox">
                      <div className="imgWrapper">
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>
                          {backorder.supplier_id.company_name?.charAt(0)}
                        </Avatar>
                      </div>
                      <div className="info pl-3">
                        <h6>{backorder.supplier_id.company_name}</h6>
                        <p>{backorder.supplier_id.company_email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{backorder.po_id.items.length}</td>
                  <td>{backorder.order_status}</td>
                </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No archived backorders found.
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
        </div>
      </div>
    </>
  );
};

export default ArchivedBackOrder;
