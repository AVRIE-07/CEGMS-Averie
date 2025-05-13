import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

import { generateCustomProductId } from "../../../customize/customizeId";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 3,
  width: "80%",
  maxWidth: "1000px",
};

export default function GeneratePO({
  open,
  handleClose,
  selectedSupplierProducts = {}, 
}) {
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const navigate = useNavigate();

  const lowStockProducts = selectedSupplierProducts?.low_stock_products || [];

  const isProductSelected = (id) =>
    selectedProducts.some((p) => p.product_id === id);

  const handleCheckboxChange = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.product_id === product.product_id);
      return exists
        ? prev.filter((p) => p.product_id !== product.product_id)
        : [...prev, product];
    });
  };

  const handleGenerate = () => {
    navigate("/generate-purchase-order", {
      state: { selectedSupplierProducts, selectedProducts },
    });
    handleClose();
  };

  React.useEffect(() => {
    if (open && lowStockProducts.length > 0) {
      setSelectedProducts(lowStockProducts);
    } else {
      setSelectedProducts([]);
    }
  }, [open, selectedSupplierProducts]);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" sx={{ mb: 2 }}>
          Low Stock Products
        </Typography>
        {lowStockProducts.length === 0 ? (
          <Typography>No low stock products available.</Typography>
        ) : (
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped v-align">
              <thead className="thead-dark">
                <tr>
                  <th>PRODUCT ID</th>
                  <th>PRODUCT NAME</th>
                  <th>CATEGORY</th>
                  <th>CURRENT STOCK</th>
                  <th>REORDER LEVEL</th>
                  <th>UNIT PRICE</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product, index) => {
                  const stockPercentage =
                    (product.current_stock / product.minimum_stock) * 100;

                  return (
                    <tr key={product.product_id || index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Checkbox
                            checked={isProductSelected(product.product_id)}
                            onChange={() => handleCheckboxChange(product)}
                          />
                          <span>
                            {generateCustomProductId(product.product_id)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center productBox">
                          <div className="info">
                            <h6>{product.name}</h6>
                            <p>{product.description || "No description"}</p>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {product.current_stock} / {product.minimum_stock}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={stockPercentage}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            bgcolor: "#f5f5f5",
                          }}
                        />
                      </td>
                      <td>{product.minimum_stock}</td>
                      <td>Php {product.price.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedProducts.length === 0}
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
}
