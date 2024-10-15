import React, { useEffect, useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Dropdown } from "react-bootstrap";

const Storage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchCategory, setSearchCategory] = useState(""); // For Category search
  const [searchDescription, setSearchDescription] = useState(""); // For Description search

  const [newProduct, setNewProduct] = useState({
    product_Category: "",
    product_Description: "",
    product_Quantity: "",
    product_Price: "",
    product_Cost: "",
    product_Minimum_Stock_Level: "",
    product_Maximum_Stock_Level: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        setProducts(response.data);
      } catch (error) {
        setError("Could not fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
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
        const response = await axios.post(
          "http://localhost:3001/api/products",
          newProduct
        );
        setProducts((prevProducts) => [...prevProducts, response.data]);
      }
      handleModalClose();
      resetForm();
    } catch (error) {
      setError("Could not save product. Please try again.");
    }
  };

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

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3001/api/products/${id}`);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
      } catch (error) {
        setError("Could not delete product. Please try again.");
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = product.product_Category
      .toLowerCase()
      .includes(searchCategory.toLowerCase());
    const matchesDescription = product.product_Description
      .toLowerCase()
      .includes(searchDescription.toLowerCase());

    if (statusFilter === "Low Stock") {
      return (
        matchesCategory &&
        matchesDescription &&
        product.product_Quantity < product.product_Minimum_Stock_Level
      );
    } else if (statusFilter === "In Stock") {
      return (
        matchesCategory &&
        matchesDescription &&
        product.product_Quantity >= product.product_Minimum_Stock_Level
      );
    } else if (statusFilter === "Overstocked") {
      return (
        matchesCategory &&
        matchesDescription &&
        product.product_Quantity > product.product_Maximum_Stock_Level
      );
    }

    return matchesCategory && matchesDescription; // Default return for "All" or if no filter is applied
  });

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

        <div
          className="card shadow-sm px-4 py-1"
          style={{ backgroundColor: "#50504D" }}
        >
          {/* Dropdown for filtering by status */}
          <div
            className="d-flex align-items-center"
            style={{ height: "50px" }} // Adjust this height as needed
          >
            <Dropdown onSelect={(e) => setStatusFilter(e)}>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Filter by Status
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="">All</Dropdown.Item>
                <Dropdown.Item eventKey="Low Stock">Low Stock</Dropdown.Item>
                <Dropdown.Item eventKey="In Stock">In Stock</Dropdown.Item>
                <Dropdown.Item eventKey="Overstocked">
                  Overstocked
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="card shadow-sm px-4 py-3 mb-4">
          {/* Search Inputs */}
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="searchCategory">Search by Category</label>
              <input
                type="text"
                id="searchCategory"
                className="form-control"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              />
            </div>
            <div className="col">
              <label htmlFor="searchDescription">Search by Description</label>
              <input
                type="text"
                id="searchDescription"
                className="form-control"
                value={searchDescription}
                onChange={(e) => setSearchDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Product Table */}
          <div className="table-responsive">
            {loading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : filteredProducts.length > 0 ? (
              <table className="table no-border">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Cost</th>
                    <th>Minimum Stock Level</th>
                    <th>Maximum Stock Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td style={{ color: "blue" }}>
                        {product.product_Category}
                      </td>
                      <td style={{ color: "blue" }}>
                        {product.product_Description}
                      </td>
                      <td style={{ color: "blue" }}>
                        {product.product_Quantity}
                      </td>
                      <td style={{ color: "blue" }}>{product.product_Price}</td>
                      <td style={{ color: "blue" }}>{product.product_Cost}</td>
                      <td style={{ color: "blue" }}>
                        {product.product_Minimum_Stock_Level}
                      </td>
                      <td style={{ color: "blue" }}>
                        {product.product_Maximum_Stock_Level}
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleModalShow(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>

        {/* Modal for adding/editing products */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditMode ? "Edit Product" : "Add Product"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              {/* Form Fields for Product Details */}
              <div className="mb-3">
                <label htmlFor="product_Category" className="form-label">
                  Category
                </label>
                <input
                  type="text"
                  id="product_Category"
                  name="product_Category"
                  className="form-control"
                  value={newProduct.product_Category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="product_Description" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  id="product_Description"
                  name="product_Description"
                  className="form-control"
                  value={newProduct.product_Description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="product_Quantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="number"
                  id="product_Quantity"
                  name="product_Quantity"
                  className="form-control"
                  value={newProduct.product_Quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="product_Price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  id="product_Price"
                  name="product_Price"
                  className="form-control"
                  value={newProduct.product_Price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="product_Cost" className="form-label">
                  Cost
                </label>
                <input
                  type="number"
                  id="product_Cost"
                  name="product_Cost"
                  className="form-control"
                  value={newProduct.product_Cost}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="product_Minimum_Stock_Level"
                  className="form-label"
                >
                  Minimum Stock Level
                </label>
                <input
                  type="number"
                  id="product_Minimum_Stock_Level"
                  name="product_Minimum_Stock_Level"
                  className="form-control"
                  value={newProduct.product_Minimum_Stock_Level}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="product_Maximum_Stock_Level"
                  className="form-label"
                >
                  Maximum Stock Level
                </label>
                <input
                  type="number"
                  id="product_Maximum_Stock_Level"
                  name="product_Maximum_Stock_Level"
                  className="form-control"
                  value={newProduct.product_Maximum_Stock_Level}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  {isEditMode ? "Update Product" : "Add Product"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
      </main>
    </div>
  );
};

export default Storage;
