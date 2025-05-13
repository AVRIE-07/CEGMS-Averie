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
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import GeneratePO from "../../components/Modals/GeneratePO";
import CustomizedSnackbars from "../../components/SnackBar";
import ConfirmationModal from "../../components/Modals/CustomizeConfirmation";

import purchaseOrderService from "../../services/purchaseOrderService";
import grnService from "../../services/grnService";

import { generateCustomPurchaseOrderId } from "../../customize/customizeId";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const GeneratedPO = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const location = useLocation();
  const [showBy, setshowBy] = useState("");
  const [showBysetCatBy, setCatBy] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);
  const [selectedID, setSelectedID] = useState("");
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllPurchaseOrders();
    const shouldShowSnackbar = localStorage.getItem("showSnackbar");
    const snackbarMsg = localStorage.getItem("snackbarMessage");

    if (shouldShowSnackbar === "true") {
      setMessage(snackbarMsg || "Success!");
      setOpenSnackbar(true);
      localStorage.removeItem("showSnackbar");
      localStorage.removeItem("snackbarMessage");
    }
  }, []);

  const fetchAllPurchaseOrders = async () => {
    try {
      const res = await purchaseOrderService.getAllPO();
      console.log("Fetched Purchase Orders:", res.data);
      if (res.status === 200 && Array.isArray(res.data)) {
        setPurchaseOrders(res.data);
        console.log("PURCHASE ORDER: ", purchaseOrders)
      }
    } catch (error) {
      console.error("Failed to fetch purchase orders:", error);
    }
  };

  const handleEdit = (purchaseOrder) => {
    navigate("/edit-generated-purchase-order", {
      state: { selectedPurchaseOrder: purchaseOrder }
    });
  };

  const handleConfirmArchive = async (id) => {
    try {
      await purchaseOrderService.archive(id);
      localStorage.setItem("snackbarMessage", "Purchase Order archived successfully!");
      localStorage.setItem("showSnackbar", "true");
      window.location.reload();
    } catch (error) {
      console.error("Archive failed:", error);
    }
  };
  
  const handleConfirmDelete = async (id) => {
    try {
      await purchaseOrderService.delete(id);
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

  const handleCreateGRN = async (po) => {
    try {

      console.log("Ito ay purchase order", po)

      const grnData = {
        user_id: po.user_id._id,
        supplier_id: po?.supplier.supplier_id?._id,
        po_id: po?._id,
        mop: "Cash",
        order_status: "Draft",
        items: po.items.map((item) => ({
          product_id: item._id,
          order_quantity: item.quantity, 
          received_quantity: 0, 
          damaged_quantity: 0,
          return_quantity: 0,
          status: "Receive"
        })),
      };


      await grnService.create(grnData);

      navigate("/grn");
  
    } catch (error) {
      console.error("Error creating GRN:", error);
      alert("Failed to generate GRN.");
    }
  };


  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Generated Purchase Order</h5>
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
                  <th>PO ID</th>
                  <th>SUPPLIER</th>
                  <th>ORDER DATE</th>
                  <th>STATUS</th>
                  <th>NUMBER OF PRODUCTS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {purchaseOrders.length > 0 ? (
                  purchaseOrders
                  .map((po, index) => (
                    <tr key={po._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span>{generateCustomPurchaseOrderId(po._id)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center productBox">
                          <div className="imgWrapper">
                            <Avatar sx={{ bgcolor: deepPurple[500] }}>
                              {po.supplier?.company_name?.charAt(0) || "S"}
                            </Avatar>
                          </div>
                          <div className="info pl-3">
                            <h6>{po.supplier?.company_name}</h6>
                            <p>{po.supplier?.person_email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td>{new Date(po.order_date).toLocaleDateString()}</td>
                      <td>{po.order_status}</td>
                      <td>{po.items?.length}</td>
                      <td>
                        <div className="d-flex justify-content-center align-items-center" style={{ gap: "1rem" }}>
                          {po.order_status === "Draft" ? (
                            <>
                              <Button variant="outlined" color="error" onClick={() => handleOpenDelete(po._id)}>
                                DELETE
                              </Button>
                              <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => handleEdit(po)}>
                                EDIT
                              </Button>
                            </>
                          ) : po.order_status === "Complete" ? (
                            <Button variant="contained" color="secondary" onClick={() => handleOpenArchive(po._id)}>
                              ARCHIVE
                            </Button>
                          ) : po.order_status === "Approved" ? (
                            <Button variant="contained" color="secondary" onClick={() => handleCreateGRN(po)}>
                              GENERATE GRN
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No purchase orders found.
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

export default GeneratedPO;
