import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import GeneratePO from "../../components/Modals/GeneratePO";
import { MdDelete } from "react-icons/md";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import purchaseOrderService from "../../services/purchaseOrderService";
import backorderService from "../../services/backorderService";

const PurchaseOrder = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const { state } = useLocation(); 
  const { selectedProducts, selectedSupplierProducts } = state || {};
  const [products, setProducts] = useState(selectedProducts || []);


  const [quantities, setQuantities] = useState(() => {
    const initialQuantities = {};
    selectedProducts?.forEach(product => {
      initialQuantities[product._id] = Math.max(product.minimum_stock - product.current_stock, 0);
    });
    return initialQuantities;
  });

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({
      ...prev,
      [id]: value
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedProducts) {
      setProducts(selectedProducts);
  
      const initialQuantities = {};
      selectedProducts.forEach(product => {
        const quantity = Math.max(product.minimum_stock - product.current_stock, 0);
        initialQuantities[product.product_id] = quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [selectedProducts]);

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(product => product.product_id !== id));
    setQuantities(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const poData = {
      user_id: "6794f6686df4447fe8209938",
      supplier: {
        supplier_id: selectedSupplierProducts._id,
        person_name: selectedSupplierProducts.contact.person_name,
        person_number: selectedSupplierProducts.contact.person_number,
        person_email: selectedSupplierProducts.contact.person_email,
        company_name: selectedSupplierProducts.name,
        company_country: selectedSupplierProducts.address.country,
        company_province: selectedSupplierProducts.address.province,
        company_city: selectedSupplierProducts.address.city,
        company_zipCode: selectedSupplierProducts.address.zipCode,
      },
      order_status: "Draft",
      items: products.map((product) => ({
        product_id: product.product_id,
        name: product.name,
        description: product.description,
        quantity: Number(quantities[product.product_id] || 0),
        backorder_quantity: Number(quantities[product.product_id] || 0),
        status: "Pending",
      })),
    };

  try {
      const response = await purchaseOrderService.create(poData);
      console.log("Purchase order created:", response.data);
      navigate("/generated-purchase-orders", {
        state: { showSnackbar: true, snackbarMessage: "Purchase order created successfully!" },
      });
    } catch (error) {
      console.error("Error creating purchase order:", error);
    }
  };


  return (
    <>
      <div className="right-content w-100">
        {/* First Card - Supplier Details */}
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Generate Purchase Order</h5>
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
                      <input type="text" name="" value={selectedSupplierProducts.name} disabled />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>EMAIL</h6>
                      <input type="text" name="" value={selectedSupplierProducts.contact.person_email} disabled />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>PHONE NUMBER</h6>
                      <input type="text" name="" value={selectedSupplierProducts.contact.person_number} disabled/>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>Supplier Address</h6>
                        <input type="text" name="" value={`${selectedSupplierProducts.address.city}, ${selectedSupplierProducts.address.province}, ${selectedSupplierProducts.address.country}, ${selectedSupplierProducts.address.zipCode}`} disabled/>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <h6>DATE</h6>
                      <input type="text" name="brand" value={new Date().toLocaleDateString("en-US", {year: "numeric",month: "long",day: "numeric",})} disabled/>
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
                {products?.map((product, index) => {
                  const estimatedAmount = product.price * (quantities[product.product_id] || 0);
                  return (
                <tr key={product.product_id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="actions d-flex align-items-center">
                        <Button
                          className="error"
                          color="error"
                          onClick={() => handleDelete(product.product_id)}
                        >
                          <MdDelete />
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center productBox">
                      <div className="info pl-3">
                        <h6>{product.name}</h6>
                        <p>{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.current_stock}</td>
                  <td>{product.minimum_stock}</td>
                  <td>
                    <TextField
                      fullWidth
                      type="number"
                      value={quantities[product.product_id] || 0}
                      onChange={(e) => {
                        const value = Math.max(Number(e.target.value), 0);
                        handleQuantityChange(product.product_id, value);
                      }}
                    />
                  </td>
                  <td>Php {Number(product.price).toFixed(2)}</td>
                  <td>Php {Number(estimatedAmount).toFixed(2)}</td>
                </tr>

                  );
                })}
              </tbody>
            </table>
              <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
                <Button variant="outlined" color="secondary" >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={selectedProducts.length === 0}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </Grid>
          </div>
        </div>
      </div>

      <GeneratePO open={open} handleClose={handleClose} />
    </>
  );
};

export default PurchaseOrder;
