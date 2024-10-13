import React, { useEffect, useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button components

const Storage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // State to determine if editing
  const [currentProductId, setCurrentProductId] = useState(null); // Current product ID for editing
  const [newProduct, setNewProduct] = useState({
    product_Category: "",
    product_Description: "",
    product_Quantity: "",
    product_Price: "",
    product_Cost: "",
    product_Minimum_Stock_Level: "",
    product_Maximum_Stock_Level: "",
  });

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        console.log("API Response:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Could not fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle input changes for the product form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle form submission for adding or editing a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update product
        const response = await axios.put(
          `http://localhost:3001/api/products/${currentProductId}`,
          newProduct
        );
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === currentProductId ? response.data : product
          )
        );
      } else {
        // Add new product
        const response = await axios.post(
          "http://localhost:3001/api/products",
          newProduct
        );
        setProducts((prevProducts) => [...prevProducts, response.data]);
      }
      handleModalClose(); // Close the modal after submission
      resetForm(); // Reset the form
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Could not save product. Please try again.");
    }
  };

  // Function to open and close the modal
  const handleModalShow = (product = null) => {
    if (product) {
      setIsEditMode(true);
      setCurrentProductId(product._id);
      setNewProduct({
        product_Category: product.product_Category,
        product_Description: product.product_Description,
        product_Quantity: product.product_Quantity,
        product_Price: product.product_Price,
        product_Cost: product.product_Cost,
        product_Minimum_Stock_Level: product.product_Minimum_Stock_Level,
        product_Maximum_Stock_Level: product.product_Maximum_Stock_Level,
      });
    } else {
      setIsEditMode(false);
      resetForm();
    }
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  // Reset the form fields
  const resetForm = () => {
    setNewProduct({
      product_Category: "",
      product_Description: "",
      product_Quantity: "",
      product_Price: "",
      product_Cost: "",
      product_Minimum_Stock_Level: "",
      product_Maximum_Stock_Level: "",
    });
    setCurrentProductId(null);
  };

  // Handle delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3001/api/products/${id}`);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Could not delete product. Please try again.");
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="card shadow-sm py-3 px-4 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-bar-chart-fill fs-3"></i>
              <h5 className="fw-semibold ms-3 mb-0">Storage</h5>
            </div>
            <div>
              <Button
                onClick={() => handleModalShow()}
                className="btn btn-primary"
              >
                + Add Product
              </Button>
            </div>
          </div>
        </div>
        <div className="card shadow-sm px-4 py-3">
          <div className="d-flex justify-content-end">
            <ul className="nav nav-underline fs-6 text-end me-3">
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
                  to="/Storage/InventoryApprovals" // Link to Inventory Approvals component
                  className="nav-link fw-semibold text-decoration-none"
                  style={{ color: "#6a6d71" }}
                >
                  Inventory Approvals
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
        </div>

        {/* Add/Edit Product Modal */}
        <Modal show={showModal} onHide={handleModalClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditMode ? "Edit Product" : "Add New Product"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Category</label>
                <input
                  type="text"
                  name="product_Category"
                  value={newProduct.product_Category}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Description</label>
                <input
                  type="text"
                  name="product_Description"
                  value={newProduct.product_Description}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Quantity</label>
                <input
                  type="number"
                  name="product_Quantity"
                  value={newProduct.product_Quantity}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Price</label>
                <input
                  type="number"
                  name="product_Price"
                  value={newProduct.product_Price}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Cost</label>
                <input
                  type="number"
                  name="product_Cost"
                  value={newProduct.product_Cost}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Min Stock Level</label>
                <input
                  type="number"
                  name="product_Minimum_Stock_Level"
                  value={newProduct.product_Minimum_Stock_Level}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Max Stock Level</label>
                <input
                  type="number"
                  name="product_Maximum_Stock_Level"
                  value={newProduct.product_Maximum_Stock_Level}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <Button type="submit" className="btn btn-success">
                {isEditMode ? "Update Product" : "Add Product"}
              </Button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Table to display products */}
        <div className="card shadow-sm px-4 py-3">
          <div className="table-responsive mt-4">
            {loading ? (
              <div>Loading products...</div>
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Cost</th>
                    <th>Min Stock</th>
                    <th>Max Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.product_Category}</td>
                      <td>{product.product_Description}</td>
                      <td>{product.product_Quantity}</td>
                      <td>{product.product_Price}</td>
                      <td>{product.product_Cost}</td>
                      <td>{product.product_Minimum_Stock_Level}</td>
                      <td>{product.product_Maximum_Stock_Level}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleModalShow(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Storage;
