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
import GeneratePO from "../../components/Modals/GeneratePO";
import CustomizedSnackbars from "../../components/SnackBar";

import purchaseOrderService from "../../services/purchaseOrderService";

import { generateCustomSupplierId } from "../../customize/customizeId";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const PurchaseOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showBy, setshowBy] = useState("");
  const [showBysetCatBy, setCatBy] = useState("");
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const handleOpen = (supplierProducts) => {
    setSelectedSupplierProducts(supplierProducts);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [lowStockSuppliers, setLowStockSuppliers] = useState([]);
  const [selectedSupplierProducts, setSelectedSupplierProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLowStockData();
  }, []);

  useEffect(() => {
    if (location.state?.showSnackbar) {
      setOpenSnackbar(true);
      setSnackbarMessage(location.state.snackbarMessage || "Success");
    }
  }, [location.state]);


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  const fetchLowStockData = async () => {
    try {
      const res = await purchaseOrderService.getAll();
      if (res.data.success) {
        setLowStockSuppliers(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch low stock data:", error);
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Purchase Order</h5>
        </div>

        <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2">
          <div className="col-md-12">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox
                color={["#1da256", "#48d483"]}
                title={"Number of supplier"}
                value={lowStockSuppliers.length}
              />
              <DashboardBox
                color={["#c012e2", "#eb64fe"]}
                title={"Total Generated Purchase Order"}
                value={12} 
              />
              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                title={"Total Archived Purchase Order"}
                value={1} 
              />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={
                location.pathname === "/low-stock-products"
                  ? 0
                  : location.pathname === "/generated-purchase-orders"
                  ? 1
                  : location.pathname === "/archived-purchase-orders"
                  ? 2
                  : false
              }
              onChange={(event, newValue) => {
                if (newValue === 0) {
                  navigate("/low-stock-products");
                } else if (newValue === 1) {
                  navigate("/generated-purchase-orders");
                } else if (newValue === 2) {
                  navigate("/archived-purchase-orders");
                }
              }}
              aria-label="Purchase Order Tabs"
            >
              <Tab label="Low Stock Products" />
              <Tab label="Purchase Orders" />
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
                  <th>SUPPLIER ID</th>
                  <th style={{ width: "300px" }}>NAME</th>
                  <th>CONTACT</th>
                  <th>ADDRESS</th>
                  <th>LOW STOCK ITEMS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
              {lowStockSuppliers.map((supplier, index) => (
                <tr key={supplier._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <span>{generateCustomSupplierId(supplier._id)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center productBox">
                      <div className="imgWrapper">
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>
                          {supplier.name?.charAt(0)}
                        </Avatar>
                      </div>
                      <div className="info pl-3">
                        <h6>{supplier.name}</h6>
                        <p>{supplier.contact.person_email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center productBox">
                    <div className="imgWrapper">
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>
                          {supplier.contact.person_name?.charAt(0)}
                        </Avatar>
                      </div>
                      <div className="info pl-3">
                        <h6>{supplier.contact.person_name}</h6>
                        <p>{supplier.contact.person_number}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {supplier.address.city}, {supplier.address.province},{" "}
                    {supplier.address.country}
                  </td>
                  <td>{supplier.total_low_stock}</td>
                  <td>
                    <Button onClick={() => handleOpen(supplier)} variant="contained">
                      GENERATE
                    </Button>
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
            </div>
            <GeneratePO open={open} handleClose={handleClose} selectedSupplierProducts={selectedSupplierProducts}/>
          </div>
        </div>
      </div>

      <CustomizedSnackbars
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
};

export default PurchaseOrder;
