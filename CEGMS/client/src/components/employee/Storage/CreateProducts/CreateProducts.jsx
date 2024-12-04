import React, { useEffect, useState } from "react";
import Sidebar from "../../SidebarComponents/Sidebar";
import styles from "../Storage.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateProducts = () => {
  const [newProduct, setNewProduct] = useState({
    product_Description: "",
    product_Category: "",
    product_Price: "",
    product_Current_Stock: "",
    product_Minimum_Stock_Level: "",
    product_Maximum_Stock_Level: "",
  });
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [action, setAction] = useState(""); // This will store the action type (add, edit, delete)
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      case "product_Description":
        const descriptionRegex = /^(?!\d+$)[A-Za-z\s]+$/;
        if (!descriptionRegex.test(value)) {
          setError("Description can only contain letters and spaces.");
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

    // Check if the product_Maximum_Stock_Level is less than the product_Minimum_Stock_Level
    if (
      name === "product_Maximum_Stock_Level" &&
      parseInt(value) < parseInt(newProduct.product_Minimum_Stock_Level)
    ) {
      setError("Maximum Stock Level cannot be less than Minimum Stock Level.");
      return;
    }

    // Update product data
    setNewProduct((prevProduct) => {
      let updatedProduct = { ...prevProduct, [name]: value };

      // If the 'product_Minimum_Stock_Level' field is updated, also set 'product_Maximum_Stock_Level'
      if (name === "product_Minimum_Stock_Level") {
        // Automatically set product_Maximum_Stock_Level based on the new minimum stock level
        updatedProduct.product_Maximum_Stock_Level = value; // You can add custom logic here if needed
      }

      return updatedProduct;
    });

    // Clear error if everything is valid
    setError("");
  };
  const handleAddProduct = () => {
    setIsSubmitted(true); // Mark form as submitted

    // Check if any required fields are empty
    for (const key in newProduct) {
      if (
        newProduct.product_Description === "" ||
        newProduct.product_Category === "" ||
        newProduct.product_Price === ""
      ) {
        setError("All fields are required!");
        return;
      }
    }

    // Convert the stock levels to integers before comparing
    const minStockLevel = parseInt(newProduct.product_Minimum_Stock_Level);
    const maxStockLevel = parseInt(newProduct.product_Maximum_Stock_Level);

    // Check if Minimum Stock Level is greater than or equal to Maximum Stock Level
    if (minStockLevel < maxStockLevel) {
      setError(
        "Minimum Stock Level must be greater than or equal to Maximum Stock Level."
      );
      return;
    }

    let productStatus;
    if (newProduct.product_Current_Stock < minStockLevel) {
      productStatus = "Low Stock";
    } else if (newProduct.product_Current_Stock > maxStockLevel) {
      productStatus = "Overstocked";
    } else {
      productStatus = "In Stock";
    }

    // Add the new product to the list
    setProductList((prevList) => [
      ...prevList,
      { ...newProduct, product_Status: productStatus },
    ]);

    resetForm();
    setError(""); // Clear any errors after adding the product

    // Reset isSubmitted to remove the validation borders
    setIsSubmitted(false);
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
        const { insertedIds } = response.data;

        const manualAdjustments = productList.map((product, index) => ({
          product_ID: insertedIds[index],
          adj_Description: product.product_Description,
          adj_Category: product.product_Category,
          adj_Quantity: product.product_Current_Stock,
          adj_Price: product.product_Price,
          adj_Adjustment_Type: "Added",
        }));

        const manualAdjustmentResponse = await axios.post(
          "http://localhost:3001/api/manualAdjustment",
          manualAdjustments
        );

        if (manualAdjustmentResponse.status === 201) {
          await createStockMovements(manualAdjustmentResponse.data);
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
    setAction("add"); // Update the action based on what was done (e.g., "add")
    setShowSuccessModal(true); // Show the success modal after saving
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
      product_Price: "",
      product_Current_Stock: "",
      product_Minimum_Stock_Level: "",
      product_Maximum_Stock_Level: "",
      product_Category: "",
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
                to="/employee/Storage"
                className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
              >
                Products
              </Link>
            </li>
            <li className="nav-item pe-3">
              <Link
                to="/employee/Storage/StockMovement"
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
              >
                Stock Movement
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/employee/Storage/Reports"
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
              ].map((field, index) => (
                <div key={index} className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      name={field.name}
                      className="form-control"
                      id={field.name}
                      value={newProduct[field.name]}
                      onChange={handleInputChange}
                      required
                      placeholder={field.placeholder}
                      style={{
                        border:
                          isSubmitted && !newProduct[field.name]
                            ? "1px solid red"
                            : "",
                      }}
                    />
                    <label
                      htmlFor={field.name}
                      className={newProduct[field.name] ? "active" : ""}
                    >
                      {field.placeholder}
                    </label>
                  </div>
                </div>
              ))}

              {/* Maximum Stock Level with Increment Button */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="number"
                    name="product_Maximum_Stock_Level"
                    className="form-control"
                    id="product_Maximum_Stock_Level"
                    value={newProduct.product_Maximum_Stock_Level}
                    onChange={handleInputChange}
                    required
                    placeholder="Maximum Stock Level"
                    style={{
                      border:
                        isSubmitted && !newProduct.product_Maximum_Stock_Level
                          ? "1px solid red"
                          : "",
                    }}
                  />
                  <label
                    htmlFor="product_Maximum_Stock_Level"
                    className={
                      newProduct.product_Maximum_Stock_Level ? "active" : ""
                    }
                  >
                    Maximum Stock Level
                  </label>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="col-md-6">
                <select
                  name="product_Category"
                  className="form-control"
                  value={newProduct.product_Category}
                  onChange={handleInputChange}
                  required
                  style={{
                    border:
                      isSubmitted && !newProduct.product_Category
                        ? "1px solid red"
                        : "",
                    height: "55px", // Increase the height here
                  }}
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

            {error && (
              <div className="text-danger mt-2">
                <i className="bi bi-exclamation-triangle"></i> {error}
              </div>
            )}

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
