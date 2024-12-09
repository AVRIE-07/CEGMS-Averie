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
    product_Price: "",
    product_Current_Stock: "",
    product_Minimum_Stock_Level: "",
    product_Maximum_Stock_Level: "",
    product_Supplier: "", // Existing supplier field
    product_Shelf_Life: "", // New shelf life field
  });

  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [action, setAction] = useState(""); // This will store the action type (add, edit, delete)
  const [suppliers, setSuppliers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch suppliers data on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/supplier/");
        setSuppliers(response.data); // Populate suppliers state
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/category/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Allow empty value (for clearing inputs)
    if (value === "") {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
      setError(""); // Clear any existing errors
      return;
    }

    // Example regex for validating fields
    let validValue = value;
    switch (name) {
      case "product_Name":
        const nameRegex = /^[A-Za-z0-9\s]+$/;
        if (!nameRegex.test(value)) {
          setError(
            "Product Name can only contain letters, numbers, and spaces."
          );
          return;
        }
        break;

      case "product_Description":
        const descriptionRegex =
          /^[A-Za-z][A-Za-z0-9\s\-\_\#\$\%\&\!\+\=\(\)]*$/;

        if (!descriptionRegex.test(value)) {
          setError(
            "Description must start with a letter and may contain numbers and symbols."
          );
          return;
        }
        break;

      case "product_Price":
        const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        if (!priceRegex.test(value)) {
          setError(
            "Price must be a positive number with up to two decimal places."
          );
          return;
        }
        break;

      case "product_Current_Stock":
      case "product_Minimum_Stock_Level":
      case "product_Maximum_Stock_Level":
        const stockRegex = /^[0-9]+$/;
        if (!stockRegex.test(value)) {
          setError("Stock levels must be valid numbers.");
          return;
        }
        break;

      default:
        break;
    }

    // If validation passed, update the state
    setNewProduct((prev) => {
      const updatedProduct = { ...prev, [name]: validValue };

      // Automatically update Maximum Stock Level based on Minimum Stock Level
      if (name === "product_Minimum_Stock_Level") {
        updatedProduct.product_Maximum_Stock_Level = value;
      }

      // Prevent Maximum Stock Level from going below Minimum Stock Level
      if (name === "product_Maximum_Stock_Level") {
        const minimumStockLevel =
          parseInt(updatedProduct.product_Minimum_Stock_Level) || 0;
        const maximumStockLevel = parseInt(value) || 0;

        // Check if max stock level is less than min stock level
        if (maximumStockLevel < minimumStockLevel) {
          setError(
            "Maximum Stock Level cannot be less than Minimum Stock Level."
          );
          return prev; // Return previous state to prevent the update
        } else {
          updatedProduct.product_Maximum_Stock_Level = maximumStockLevel;
          setError(""); // Clear the error if the value is valid
        }
      }

      return updatedProduct;
    });
  };

  const handleAddProduct = () => {
    setIsSubmitted(true); // Mark form as submitted
    // Check if any required fields are empty
    for (const key in newProduct) {
      if (newProduct[key] === "" || newProduct[key] === undefined) {
        setError("All fields are required!");
        return;
      }
    }

    // Check if Minimum Stock Level is lower than Maximum Stock Level
    if (
      parseInt(newProduct.product_Minimum_Stock_Level) >=
      parseInt(newProduct.product_Maximum_Stock_Level)
    ) {
      setError("Minimum Stock Level must be lower than Maximum Stock Level.");
      return;
    }

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

    // Add the new product to the product list
    setProductList((prevList) => [
      ...prevList,
      { ...newProduct, product_Status: productStatus },
    ]);

    // Reset the form after adding the product
    resetForm();

    // Clear the selected supplier (reset the value in the product state)
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      product_Supplier: "", // Clear the selected supplier
    }));

    setError(""); // Clear the error if product is added
  };

  const handleRemoveProduct = (index) => {
    setProductList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleCreateProducts = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/products/bulk",
        productList
      );

      if (response.status === 201) {
        const { insertedOrUpdatedProducts } = response.data;

        const manualAdjustments = productList.map((product, index) => {
          const product_ID = insertedOrUpdatedProducts[index];
          return {
            product_ID,
            adj_Description: product.product_Description,
            adj_Category: product.product_Category,
            adj_Quantity: product.product_Current_Stock,
            adj_Price: product.product_Price,
            adj_Supplier: product.product_Supplier,
            adj_Shelf_Life: product.product_Shelf_Life, // Ensure shelf life is included
            adj_Adjustment_Type: insertedOrUpdatedProducts[index]
              ? "Updated"
              : "Added",
          };
        });

        const manualAdjustmentResponse = await axios.post(
          "http://localhost:3001/api/manualAdjustment",
          manualAdjustments
        );

        if (manualAdjustmentResponse.status === 201) {
          await createStockMovements(manualAdjustmentResponse.data);
          setProductList([]);
          setShowModal(false);
          setAction("add");
          setShowSuccessModal(true);
        }
      }
    } catch (error) {
      setError(
        "Could not create products or stock movements. Please try again."
      );
      console.error("Error details:", error.response?.data || error.message);
    }
  };

  const createStockMovements = async (manualAdjustments) => {
    try {
      const stockMovements = manualAdjustments.map((adjustment) => ({
        product_ID: adjustment.product_ID,
        movement_ID: adjustment.manualAdjust_ID,
        adj_Description: adjustment.adj_Description,
        adj_Category: adjustment.adj_Category,
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
      product_Price: "",
      product_Current_Stock: "",
      product_Minimum_Stock_Level: "",
      product_Maximum_Stock_Level: "",
      product_Supplier: "", // Existing supplier field
      product_Shelf_Life: "", // New shelf life field
    });
    setIsSubmitted(false); // Reset the submitted state
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="d-flex justify-content-start">
          <ul className="nav nav-underline fs-6 me-3">
            <li className="nav-item pe-3">
              <Link
                to="/Storage"
                className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
              >
                Products
              </Link>
            </li>
            <li className="nav-item pe-3">
              <Link
                to="/Storage/StockMovement"
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
              >
                Stock Movement
              </Link>
            </li>
            <li className="nav-item"></li>
          </ul>
        </div>

        <div className="card shadow-sm py-3 px-5 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-bar-chart-fill fs-3"></i>
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
          <h5 className="card-title">
            <i className="bi bi-plus-circle me-2"></i>Add New Products
          </h5>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="row g-3">
              {[
                { name: "product_Name", placeholder: "Product Name" },
                { name: "product_Description", placeholder: "Description" },
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
                <div key={index} className="col-md-6 position-relative">
                  <div className="form-floating">
                    <input
                      id={field.name}
                      type={
                        field.name === "product_Maximum_Stock_Level"
                          ? "number"
                          : "text"
                      }
                      name={field.name}
                      className="form-control"
                      value={newProduct[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      required
                    />
                    <label htmlFor={field.name}>
                      {field.placeholder}{" "}
                      <span style={{ color: "red" }}>*</span>
                      {isSubmitted && !newProduct[field.name] && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                  </div>
                </div>
              ))}

              {/* Supplier Field */}
              <div className="col-md-6 mb-3">
                <div className="form-floating">
                  <select
                    name="product_Supplier"
                    className="form-control"
                    value={newProduct.product_Supplier}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier._id} value={supplier.name}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="product_Supplier">
                    Select Supplier <span style={{ color: "red" }}>*</span>
                    {isSubmitted && !newProduct.product_Supplier && (
                      <span className="text-danger">*</span>
                    )}
                  </label>
                </div>
              </div>

              {/* Category Field */}
              <div className="col-md-6 mb-3">
                <div className="form-floating">
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
                  <label htmlFor="product_Category">
                    Select Category <span style={{ color: "red" }}>*</span>
                    {isSubmitted && !newProduct.product_Category && (
                      <span className="text-danger">*</span>
                    )}
                  </label>
                </div>
              </div>

              {/* Shelf Life Field */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    name="product_Shelf_Life"
                    className="form-control"
                    value={newProduct.product_Shelf_Life}
                    onChange={handleInputChange}
                    placeholder="Shelf Life (in days, months, etc.)"
                    required
                  />
                  <label htmlFor="product_Shelf_Life">
                    Shelf Life (in days) <span style={{ color: "red" }}>*</span>
                    {isSubmitted && newProduct.product_Shelf_Life === "" && (
                      <span className="text-danger">*</span>
                    )}
                  </label>
                </div>
              </div>

              {/* Display Error Message */}
              {error && (
                <div className="text-danger mt-2">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-primary me-2"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
              <button
                type="submit"
                className="btn btn-success"
                onClick={() => setShowModal(true)}
                disabled={productList.length === 0}
              >
                Save All Products
              </button>
            </div>
          </form>
        </div>

        {/* Success Confirmation Modal */}
        <Modal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
          centered
        >
          <Modal.Header>
            <Modal.Title className="text-success">
              <i className="bi bi-check-circle-fill me-2"></i> Success!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>
              The products have been successfully added to products and stock
              movement.
            </p>
            <div style={{ fontSize: "2em", color: "#28a745" }}>
              <i className="bi bi-check-circle-fill"></i>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button
              variant="success"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Confirm Product Creation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to create the selected products?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCreateProducts}>
              Confirm
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Product List Preview */}
        <div className="card shadow-sm p-4 mt-4">
          <h5 className="card-title">Products Preview</h5>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Category</th>
                <th>Price</th>
                <th>Current Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, index) => (
                <tr key={index}>
                  <td>{product.product_Category}</td>
                  <td>{product.product_Price}</td>
                  <td>{product.product_Current_Stock}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CreateProducts;
