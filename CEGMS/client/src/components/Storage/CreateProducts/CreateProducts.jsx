import React, { useEffect, useState } from "react";
import Sidebar from "../../SidebarComponents/Sidebar";
import styles from "../Storage.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateProducts = () => {
  const [newProduct, setNewProduct] = useState({
    product_Name: "",
    product_Description: "",
    product_Category: "",
    product_Quantity: "",
    product_Price: "",
    product_Current_Stock: "",
    product_Minimum_Stock_Level: "",
    product_Maximum_Stock_Level: "",
  });
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch categories from the backend on component mount
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/category/"); // Adjust endpoint if needed
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    let productStatus;
    if (
      newProduct.product_Current_Stock < newProduct.product_Minimum_Stock_Level
    ) {
      productStatus = "Low Stock";
    } else if (
      newProduct.product_Current_Stock > newProduct.product_Maximum_Stock_Level
    ) {
      productStatus = "Overstocked";
    } else {
      productStatus = "In Stock";
    }

    setProductList((prevList) => [
      ...prevList,
      { ...newProduct, product_Status: productStatus },
    ]);

    resetForm();
  };

  const handleCreateProducts = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/products/bulk",
        productList
      );

      if (response.status === 201) {
        alert("Products created successfully!");
        const { insertedIds } = response.data;

        const manualAdjustments = productList.map((product, index) => ({
          product_ID: insertedIds[index],
          adj_Description: product.product_Description,
          adj_Category: product.product_Category,
          adj_Quantity: product.product_Quantity,
          adj_Price: product.product_Price,
          adj_Adjustment_Type: "Added",
        }));

        const manualAdjustmentResponse = await axios.post(
          "http://localhost:3001/api/manualAdjustment",
          manualAdjustments
        );

        if (manualAdjustmentResponse.status === 201) {
          await createStockMovements(manualAdjustmentResponse.data);
          alert("Stock movements created successfully!");
          setProductList([]);
        }
      }
    } catch (error) {
      setError(
        "Could not create products or stock movements. Please try again."
      );
      console.error("Error details:", error.response?.data || error.message);
    }
    setShowModal(false);
  };

  const createStockMovements = async (manualAdjustments) => {
    try {
      const stockMovements = manualAdjustments.map((adjustment) => ({
        product_ID: adjustment.product_ID,
        movement_ID: adjustment.manualAdjust_ID,
        adj_Description: adjustment.adj_Quantity,
        adj_Category: adjustment.adj_Price,
        adj_Quantity: adjustment.adj_Quantity,
        adj_Price: adjustment.adj_Price,
        adj_Adjustment_Type: "Added",
      }));

      await axios.post(
        "http://localhost:3001/api/stockMovement/bulk",
        stockMovements
      );
    } catch (error) {
      console.error("Error creating stock movements:", error);
    }
  };

  const resetForm = () => {
    setNewProduct({
      product_Name: "",
      product_Description: "",
      product_Category: "",
      product_Quantity: "",
      product_Price: "",
      product_Current_Stock: "",
      product_Minimum_Stock_Level: "",
      product_Maximum_Stock_Level: "",
    });
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="d-flex justify-content-start">
          <ul className="nav nav-underline fs-6 me-3">
            <li className="nav-item pe-3">
              <Link
                to="/Storage" // Link to Products component
                className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
              >
                Products
              </Link>
            </li>
            <li className="nav-item pe-3">
              <Link
                to="/Storage/StockMovement" // Link to Inventory Approvals component
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
              >
                Stock Movement
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/Storage/Reports" // Link to Reports component
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
              >
                Reports
              </Link>
            </li>
          </ul>
        </div>

        <div className="card shadow-sm py-3 px-5 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-bar-chart-fill fs-3 text-primary"></i>
              <h5 className="fw-semibold ms-3 mb-0">Storage</h5>
            </div>
            <button
              className="btn btn-secondary ms-auto"
              onClick={() => window.history.back()}
              style={{ whiteSpace: "nowrap" }}
            >
              Go Back
            </button>
          </div>
        </div>

        <div className="card shadow-sm p-4 mb-4">
          <h5 className="card-title">Add New Products</h5>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="row g-3">
              {[
                { name: "product_Name", placeholder: "Product Name" },
                { name: "product_Description", placeholder: "Description" },
                { name: "product_Quantity", placeholder: "Quantity" },
                { name: "product_Price", placeholder: "Price" },
                { name: "product_Current_Stock", placeholder: "Current Stock" },
                {
                  name: "product_Minimum_Stock_Level",
                  placeholder: "Minimum Stock Level",
                },
                {
                  name: "product_Maximum_Stock_Level",
                  placeholder: "Maximum Stock Level",
                },
              ].map((field, index) => (
                <div key={index} className="col-md-6">
                  <input
                    type="text"
                    name={field.name}
                    className="form-control"
                    value={newProduct[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required={[
                      "product_Name",
                      "product_Quantity",
                      "product_Price",
                    ].includes(field.name)}
                  />
                </div>
              ))}

              {/* Dropdown for product_Category */}
              <div className="col-md-6">
                <select
                  name="product_Category"
                  className="form-control"
                  value={newProduct.product_Category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category.product_Category}
                    >
                      {category.product_Category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Create All Products
              </button>
            </div>
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
        </div>

        <div className="card shadow-sm p-4">
          <h5 className="card-title">Products to be Added</h5>
          <ul className="list-group list-group-flush">
            {productList.map((product, index) => (
              <li key={index} className="list-group-item">
                <strong>{product.product_Name}</strong> -{" "}
                {product.product_Quantity} units @ ${product.product_Price}{" "}
                each, Status: {product.product_Status}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Product Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to create all products and record stock
          movements?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateProducts}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateProducts;
