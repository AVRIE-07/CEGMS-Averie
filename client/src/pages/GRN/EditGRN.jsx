import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from "react";
import GeneratePO from "../../components/Modals/GeneratePO";
import { MdDelete } from "react-icons/md";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import purchaseOrderService from "../../services/purchaseOrderService";
import grnService from "../../services/grnService";
import backorderService from "../../services/backorderService";
import rmaService from "../../services/rmaService";

const EditGRN = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); 
  const { selectedGRN } = state || {};

  const [grn, setGRN] = useState(selectedGRN || {});


  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Selected GRN:", grn);
  }, []);

  const handleSave = async () => {
    try {
        const updatedData = {
            user_id: grn?.user_id?._id,
            supplier_id: grn?.supplier_id?._id,
            po_id: grn?.po_id?._id,
            delivered_date: grn.delivered_date,
            mop: "Cash", // upadate
            order_status: "Draft",
            items: grn?.items.map((item) => ({
              product_id: item.product_id._id,
              order_quantity: item.order_quantity, 
              received_quantity: item.received_quantity, 
              return_quantity: item.return_quantity,
            })),
          };
    
      const response = await grnService.update(grn._id, updatedData);
      navigate("/grn", {
        state: { showSnackbar: true, snackbarMessage: "GRN update successfully!" },
      });
    } catch (error) {
      console.error("Error updating GRN:", error);
    }
  };

  const handleSend = async () => {
    try {
          const grnData = {
            user_id: grn?.user_id?._id,
            supplier_id: grn?.supplier_id?._id,
            po_id: grn?.po_id?._id,
            delivered_date: grn.delivered_date,
            mop: "Cash",
            order_status: "Approved",
            items: grn?.items.map((item) => ({
              product_id: item.product_id._id,
              order_quantity: item.order_quantity, 
              received_quantity: item.received_quantity, 
              return_quantity: item.return_quantity,
            })),
          };

          await grnService.update(grn._id, grnData);

          const rmaData = {
            user_id: grn?.user_id?._id,
            supplier_id: grn?.supplier_id?._id,
            po_id: grn?.po_id?._id,
            grn_id: grn?._id,
            return_date: grn.delivered_date,
            return_status: "Draft",
            items: grn?.items
            .filter((item) => item.return_quantity > 0)
            .map((item) => ({
              product_id: item.product_id._id,
              return_quantity: item.return_quantity,
            })),
          };

          const processedItems = grn?.po_id.items.map((item) => {
            const currentBackorderQty = item.backorder_quantity;

            const matchedGRNItem = grn.items.find(
              (product) => product.product_id._id === item.product_id
            );
          
            const receivedQty = matchedGRNItem?.received_quantity || 0;

            let newBackorderQty = currentBackorderQty;
          
            if (currentBackorderQty > 0) {
              newBackorderQty = currentBackorderQty - receivedQty;
              if (newBackorderQty < 0) newBackorderQty = 0;
            }
          
            const status = newBackorderQty <= 0 ? "Complete" : "Pending";
          
            return {
              product_id: item.product_id._id,
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              backorder_quantity: newBackorderQty,
              status,
            };
          });
          
          const allItemsComplete = processedItems.every((item) => item.status === "Complete");
          
          const poData = {
            order_status: allItemsComplete ? "Complete" : "Approved",
            items: processedItems,
          };

      await purchaseOrderService.update(grn?.po_id?._id, poData)

      if (rmaData.items.length > 0) {
        await rmaService.create(rmaData);
      }
      navigate("/grn", {
        state: { showSnackbar: true, snackbarMessage: "RMA created successfully!" },
      });
    } catch (error) {
      console.error("Error create RMA:", error);
    }
  };



  return (
    <>
      <div className="right-content w-100">
        {/* First Card - Supplier Details */}
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Edit Goods Received Note</h5>
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
                      <input type="text" name="" value={grn?.po_id?.supplier?.company_name || ""} disabled />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>EMAIL</h6>
                      <input type="text" name="" value={grn?.supplier_id?.company_email || ""} disabled />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>PHONE NUMBER</h6>
                      <input type="text" name="" value={grn?.po_id?.supplier?.person_number || ""} disabled />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>SUPPLIER ADDRESS</h6>
                      <input type="text" name="" value={`${grn.po_id?.supplier?.company_city}, ${grn.po_id?.supplier?.company_province}, ${grn.po_id?.supplier?.company_country}, ${grn.po_id?.supplier?.company_zipCode}`} disabled />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>CREATED DATE</h6>
                      <input type="text" name="brand" value={new Date(grn.createdAt).toLocaleDateString("en-US", {year: "numeric",month: "long",day: "numeric",})}  disabled/>
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
                  <th>CURRENT STOCK</th>
                  <th>ORDERED QUANTITY</th>
                  <th>RECEIVE QUANTITY</th>
                  <th>RETURN QUANTITY</th>
                  <th>UNIT PRICE</th>
                </tr>
              </thead>

              <tbody>
                {grn?.items?.map((product, index) => {

                    const matchingPOItem = grn.po_id?.items?.find(
                        (item) => item.product_id === product.product_id._id
                    );
                    const unitPrice = product.product_id.product_Price || 0;
                    const receivedQty = product.received_quantity || 0;
                    const estimatedAmount = unitPrice * receivedQty;
                  
                  return (
                <tr key={product._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="actions d-flex align-items-center">
                        <Button
                          className="error"
                          color="error"
                          
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
                  <td>{product.product_id.product_Current_Stock}</td>
                  <td>
                    {
                        grn.items.find(
                        (item) => item.product_id
                        )?.order_quantity ?? 0
                    }
                    </td>
                  <td>
                    <TextField
                        fullWidth
                        type="number"
                        value={receivedQty}
                        onChange={(e) => {
                        const newQty = Number(e.target.value);
                        const updatedItems = [...grn.items];
                        updatedItems[index] = {
                            ...product,
                            received_quantity: newQty,
                        };
                        setGRN({ ...grn, items: updatedItems });
                        }}
                    /> 
                  </td>
                  <td>
                    <TextField
                        fullWidth
                        type="number"
                        value={product.return_quantity || 0}
                        onChange={(e) => {
                        const updatedItems = [...grn.items];
                        updatedItems[index] = {
                            ...product,
                            return_quantity: Number(e.target.value),
                        };
                        setGRN({ ...grn, items: updatedItems });
                        }}
                       
                    />
                    </td>

                  <td>Php {product.product_id.product_Price}</td>
                </tr>

                  );
                })}
              </tbody>
            </table>
              <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
                <Grid item>
                  <Button variant="outlined" color="secondary">
                    Cancel
                  </Button>
                </Grid>

                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSave()}
                      >
                        Save
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSend()}
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

export default EditGRN;
