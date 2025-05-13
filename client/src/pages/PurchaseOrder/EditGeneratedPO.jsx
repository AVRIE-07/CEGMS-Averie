import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import GeneratePO from "../../components/Modals/GeneratePO";
import { MdDelete } from "react-icons/md";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import purchaseOrderService from "../../services/purchaseOrderService";
import grnService from "../../services/grnService";
import backorderService from "../../services/backorderService";

const EditGeneratedPurchaseOrder = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); 
  const { selectedPurchaseOrder } = state || {};

  const [purchaseOrder, setPurchaseOrder] = useState(selectedPurchaseOrder || {});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editableItems, setEditableItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (purchaseOrder.items) {
      setEditableItems([...purchaseOrder.items]); 
    }
    console.log("Selected Purchase Order 2:", purchaseOrder);
  }, []);

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...editableItems];
    updatedItems[index].quantity = Number(value); 
    setEditableItems(updatedItems);
  };

  const handleDeleteProduct = (indexToDelete) => {
    const updatedItems = editableItems.filter((_, index) => index !== indexToDelete);
    setEditableItems(updatedItems);
  };

  const handleSave = async () => {
    try {
      const updatedPO = {
        order_status: "Draft",
        items: editableItems.map((item) => ({
          product_id: item.product_id._id || item.product_id, 
          quantity: item.quantity,
        })),
      };
  
      await purchaseOrderService.update(purchaseOrder._id, updatedPO);
      navigate("/generated-purchase-orders", {
        state: { showSnackbar: true, snackbarMessage: "Purchase order updated successfully!" },
      });
    } catch (error) {
      console.error("Error updating purchase order:", error);
      alert("Failed to update purchase order.");
    }
  };

  const handleSend = async () => {
    try {
      const backorderData = {
        user_id: purchaseOrder?.user_id?._id,
        supplier_id: purchaseOrder?.supplier?.supplier_id?._id,
        po_id: purchaseOrder?._id,
        order_status: "Draft",
        items: editableItems.map((item) => ({
          product_id: item.product_id._id,
          backorder_quantity: item.quantity, 
        })),
      }

      const grnData = {
        user_id: purchaseOrder?.user_id?._id,
        supplier_id: purchaseOrder?.supplier?.supplier_id?._id,
        po_id: purchaseOrder?._id,
        mop: "Cash",
        order_status: "Draft",
        items: editableItems.map((item) => ({
          product_id: item.product_id._id,
          order_quantity: item.quantity, 
          received_quantity: 0, 
          damaged_quantity: 0,
          return_quantity: 0,
          status: "Receive"
        })),
      };

      const updatedPO = {
        order_status: "Approved",
        items: editableItems.map((item) => ({
          product_id: item.product_id._id || item.product_id, 
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          backorder_quantity: item.quantity,
          status: "Pending"
        })),
      };
  
      await purchaseOrderService.update(purchaseOrder._id, updatedPO);
      await backorderService.create(backorderData);
      await grnService.create(grnData);
  
      navigate("/generated-purchase-orders", {
        state: { showSnackbar: true, snackbarMessage: "GRN created successfully!" },
      });
    } catch (error) {
      console.error("Error creating GRN:", error);
      alert("Failed to generate GRN.");
    }
  };

  const handleCancel = async () => {
    navigate("/generated-purchase-orders", {
      state: { showSnackbar: true, snackbarMessage: "Cancel updating Purchase Order!" },
    });
  };


  return (
    <>
      <div className="right-content w-100">
        {/* First Card - Supplier Details */}
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Edit Generate Purchase Order</h5>
        </div>

        <form className="form">
          <div className="row">
            <div className="col-md-12">
              <div className="card p-4 mt-0">
                <h5 className="mb-4">Primary Document Details</h5>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>SUPPLIER NAME</h6>
                      <input type="text" name="" value={purchaseOrder?.supplier?.company_name || ""} disabled />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>EMAIL</h6>
                      <input type="text" name="" value={purchaseOrder.supplier.supplier_id.company_email} disabled />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>PHONE NUMBER</h6>
                      <input type="text" name="" value={purchaseOrder.supplier.person_number} disabled/>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>SUPPLIER ADDRESS</h6>
                        <input type="text" name="" value={`${purchaseOrder.supplier.company_city}, ${purchaseOrder.supplier.company_province}, ${purchaseOrder.supplier.company_country}, ${purchaseOrder.supplier.company_zipCode}`} disabled/>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>DATE</h6>
                      <input type="text" name="brand" value={new Date(purchaseOrder.order_date).toLocaleDateString("en-US", {year: "numeric",month: "long",day: "numeric",})}  disabled/>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </form>

        {/* Second Card - Product Details */}
        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">Product Details</h3>

          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped v-align">
              <thead className="thead-dark">
                <tr>
                  <th>DELETE</th>
                  <th style={{ width: "300px" }}>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>CURRENT STOCK</th>
                  <th>MIN STOCK</th>
                  <th>QUANTITY</th>
                  <th>UNIT PRICE</th>
                  <th>ESTIMATED AMMOUNT</th>
                </tr>
              </thead>

              <tbody>
                {editableItems?.map((product, index) => {
                  const estimatedAmount = product.product_id.product_Price * product.quantity
                  return (
                <tr key={product.product_id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="actions d-flex align-items-center">
                        <Button
                          className="error"
                          color="error"
                          onClick={() => handleDeleteProduct(index)}
                        >
                          <MdDelete />
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center productBox">
                      <div className="info pl-3">
                        <h6>{product.product_id.product_Name}</h6>
                        <p>{product.product_id.product_Description}</p>
                      </div>
                    </div>
                  </td>
                  <td>{product.product_id.product_Category}</td>
                  <td>{product.product_id.product_Current_Stock}</td>
                  <td>{product.product_id.product_Minimum_Stock_Level}</td>
                  <td>
                    <TextField
                        fullWidth
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />  
                  </td>
                  <td>Php {product.product_id.product_Price}</td>
                  <td>Php {Number(estimatedAmount).toFixed(2)}</td>
                </tr>

                  );
                })}
              </tbody>
            </table>
              <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
                <Grid item>
                  <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Grid>

                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={editableItems.length === 0}
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={editableItems.length === 0}
                        onClick={handleSend} 
                      >
                        Send
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditGeneratedPurchaseOrder;
