import React, { useEffect, useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Form, Button, Dropdown, ModalFooter } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

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
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false); // Category modal state
  const [isCategoryEditMode, setIsCategoryEditMode] = useState(false); // Track edit mode for category
  const [currentCategoryId, setCurrentCategoryId] = useState(null); // To track editing category ID
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    categoryDescription: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteModal1, setShowDeleteModal1] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [reason, setReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [editingIndex, setEditingIndex] = useState(null); // For tracking which category is being edited
  // Sample categories data for preview
  const categories = [
    { name: "Electronics", description: "Mouse" },
    { name: "School Supplies", description: "School Supplies" },
  ];

  // Assuming you're using the same show/hide mechanism for the stock transfer modal
  const [showStockTransferModal, setShowStockTransferModal] = useState(false);

  // Function to handle opening the stock transfer modal
  const handleStockTransferModalShow = () => setShowStockTransferModal(true);
  const handleStockTransferModalClose = () => setShowStockTransferModal(false);
  const handleCloseDeleteModal1 = () => {
    setShowDeleteModal1(false);
  };
  const [newProduct, setNewProduct] = useState({
    product_Category: "",
    product_Description: "",
    product_Current_Stock: "",
    product_Price: "",
    product_Cost: "",
    product_Minimum_Stock_Level: "",
    product_Maximum_Stock_Level: "",
  });

  const [newProductTransfer, setNewProductTransfer] = useState({
    productId: "",
    productName: "Laptop",
    movementType: "",
    movementDate: "",
    username: "Melchizedek",
  });
  // Sample product data (this would typically come from your API or database)
  const productsData = [
    { id: "P001", name: "Laptop" },
    { id: "P002", name: "Monitor" },
    { id: "P003", name: "Keyboard" },
  ];
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
        // Update existing product
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
      handleModalClose();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error.response?.data || error);
      setError("Could not save product. Please try again.");
    }
  };
  const handleModalShow = (product = null) => {
    fetchCategories(); // Ensure categories are fetched before showing the product modal
    if (product) {
      setIsEditMode(true);
      setCurrentProductId(product._id);
      setNewProduct({
        product_Category: product.product_Category,
        product_Description: product.product_Description,
        product_Current_Stock: product.product_Current_Stock,
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
      product_Current_Stock: "",
      product_Quantity: "",
      product_Price: "",
      product_Cost: "",
      product_Minimum_Stock_Level: "",
      product_Maximum_Stock_Level: "",
    });
    setError("");
  };

  const handleSelectProduct = (id) => {
    setSelectedProductIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((productId) => productId !== id)
        : [...prevSelected, id]
    );
  };

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(
      (product) => product._id === selectedProductId
    );
    setNewProductTransfer((prev) => ({
      ...prev,
      productId: selectedProductId,
      productName: selectedProduct ? selectedProduct.product_Description : "", // Populate product name
    }));
  };

  const handleProductCategory = () => {
    setShowCategoryModal(true);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories"); // Adjust API URL accordingly
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChangeTransfer = (e) => {
    const { name, value } = e.target;
    setNewProductTransfer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = () => {
    // Placeholder function to handle adding a category
    console.log("Add category clicked:", newCategory);
    // Reset the newCategory state after adding
    setNewCategory({ categoryName: "", categoryDescription: "" });
  };

  const handleCategoryModalClose = () => {
    setShowCategoryModal(false);
    setEditingIndex(null); // Reset editing index when modal is closed
  };

  const handleStockTransfer = () => {
    // Add your stock transfer logic here
    console.log("Stock transfer initiated");
  };

  const handleDeleteBulk = async () => {
    if (!selectedProductId) {
      alert("Please select a product to delete.");
      return;
    }

    if (reason.trim() === "") {
      alert("Please provide a reason for deletion.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete the product: ${selectedProductName}?`
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:3001/api/products/${selectedProductId}`
        );

        // Update the product list and clear selection
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== selectedProductId)
        );
        setSelectedProductId("");
        setSelectedProductName("");
        setReason("");
        setShowDeleteModal(false); // Close the modal after deletion
      } catch (error) {
        setError("Could not delete the product. Please try again.");
      }
    }
  };

  // Function to handle when a product ID is selected from the dropdown
  const handleProductIdChange = (e) => {
    const productId = e.target.value;
    setSelectedProductId(productId);

    // Find the selected product's name based on the product ID
    const selectedProduct = products.find(
      (product) => product._id === productId
    );
    if (selectedProduct) {
      setSelectedProductName(selectedProduct.name);
    }
  };

  const handleEditBulk = () => {
    if (selectedProductIds.length === 0) {
      alert("Please select at least one product to edit.");
      return;
    }

    // Get the first selected product for editing
    const productToEdit = products.find(
      (product) => product._id === selectedProductIds[0]
    );
    handleModalShow(productToEdit); // Pass the selected product to the modal
  };

  const handleQuantityChange = (delta) => {
    setNewProductTransfer((prev) => ({
      ...prev,
      quantity: Math.max(0, prev.quantity + delta), // Prevents negative quantity
    }));
  };

  // Function to handle opening the Edit Modal
  const handleEditCategory = (index) => {
    const categoryToEdit = categories[index];
    setSelectedCategory(categoryToEdit);
    setShowEditModal(true);
  };

  // Function to close the Edit Modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Function to handle updating the category
  const handleUpdateCategory = () => {
    console.log("Category updated:", selectedCategory);
    handleCloseEditModal();
  };

  // Function to handle opening the Delete Modal
  const handleDeleteCategory = (index) => {
    const categoryToDelete = categories[index];
    setSelectedCategory(categoryToDelete);
    setShowDeleteModal1(true);
  };

  // Function to close the Delete Modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Function to handle category deletion
  const handleConfirmDelete = () => {
    console.log("Category deleted:", selectedCategory, "Reason:", deleteReason);
    handleCloseDeleteModal();
  };

  // Filter products based on search and stock status
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
            <div className="d-flex">
              {/* Action Dropdown Button */}
              <Dropdown className="me-2">
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-action-button"
                >
                  <i className="bi bi-gear-fill me-2"></i>
                  Actions
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleProductCategory}>
                    <i className="bi bi-tags-fill me-2"></i>
                    Product Category (Add/Edit)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleStockTransferModalShow}>
                    <i className="bi bi-arrow-left-right me-2"></i>
                    Stock Transfer
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleEditBulk}>
                    <i className="bi bi-pencil-fill me-2"></i>
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={setShowDeleteModal}>
                    <i className="bi bi-trash-fill me-2"></i>
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Add Product Button */}
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
            <div className="col" style={{ maxWidth: "300px" }}>
              <label htmlFor="searchCategory" style={{ fontSize: 13 }}>
                Search by Category
              </label>
              <input
                type="text"
                id="searchCategory"
                className="form-control"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                style={{ borderColor: "blue", borderRadius: 50 }}
                placeholder="Enter Category.."
              />
            </div>
            <div className="col" style={{ maxWidth: "300px" }}>
              <label htmlFor="searchDescription" style={{ fontSize: 13 }}>
                Search by Description
              </label>
              <input
                type="text"
                id="searchDescription"
                className="form-control"
                value={searchDescription}
                onChange={(e) => setSearchDescription(e.target.value)}
                style={{ borderColor: "blue", borderRadius: 50 }}
                placeholder="Enter Description.."
              />
            </div>
          </div>

          {/* Product Table */}
          <div className="table-responsive" style={{ marginTop: "20px" }}>
            {loading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : filteredProducts.length > 0 ? (
              <table className="table table-hover border-top">
                <thead className="table-info">
                  <tr>
                    <th scope="col" className="fw-semibold">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds(
                              filteredProducts.map((product) => product._id)
                            );
                          } else {
                            setSelectedProductIds([]);
                          }
                        }}
                      />
                    </th>
                    <th scope="col" className="fw-semibold">
                      Category
                    </th>
                    <th scope="col" className="fw-semibold">
                      Description
                    </th>
                    <th scope="col" className="fw-semibold">
                      Current Stock
                    </th>
                    <th scope="col" className="fw-semibold">
                      Price
                    </th>
                    <th scope="col" className="fw-semibold">
                      Cost
                    </th>
                    <th scope="col" className="fw-semibold">
                      Minimum Stock Level
                    </th>
                    <th scope="col" className="fw-semibold">
                      Maximum Stock Level
                    </th>
                  </tr>
                </thead>
                <tbody className="fs-6 align-middle table-group-divider">
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(product._id)}
                          onChange={() => handleSelectProduct(product._id)}
                        />
                      </td>
                      <th scope="row" className="text-primary">
                        {product.product_Category}
                      </th>
                      <td className="text-primary">
                        {product.product_Description}
                      </td>
                      <td className="text-primary">
                        {product.product_Current_Stock}
                      </td>
                      <td className="text-primary">{product.product_Price}</td>
                      <td className="text-primary">{product.product_Cost}</td>
                      <td className="text-primary">
                        {product.product_Minimum_Stock_Level}
                      </td>
                      <td className="text-primary">
                        {product.product_Maximum_Stock_Level}
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
        <Modal show={showCategoryModal} onHide={handleCategoryModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Product Categories</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <table className="table table-hover border-top">
                <thead className="table-info">
                  <tr>
                    <th>Category Name</th>
                    <th>Category Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={index}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <div className="d-flex justify-content-start">
                          {" "}
                          {/* Flex container */}
                          <Button
                            variant="link" // Change to 'link' for no background
                            onClick={() => handleEditCategory(index)}
                            className="me-2" // Add margin to the right
                          >
                            <i className="bi bi-pencil-fill"></i>{" "}
                            {/* Edit Icon */}
                          </Button>
                          <Button
                            variant="link" // Change to 'link' for no background
                            onClick={() => handleDeleteCategory(index)}
                          >
                            <i className="bi bi-trash-fill"></i>{" "}
                            {/* Delete Icon */}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Category */}
            <div className="mt-4">
              <h6>Add New Category</h6>
              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label">
                  Category Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="categoryName"
                  value={newCategory.categoryName || ""}
                  placeholder="Enter category name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="categoryDescription" className="form-label">
                  Category Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="categoryDescription"
                  value={newCategory.categoryDescription || ""}
                  placeholder="Enter category description"
                />
              </div>
              <ModalFooter>
                <Button
                  onClick={handleAddCategory}
                  className="btn btn-primary"
                  disabled
                >
                  Add Category
                </Button>
              </ModalFooter>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={showStockTransferModal}
          onHide={handleStockTransferModalClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Stock Update Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="productId" className="form-label">
                  Product ID
                </label>
                <select
                  className="form-select"
                  id="productId"
                  value={newProductTransfer.productId}
                  onChange={handleProductChange}
                >
                  <option value="">Select Product ID</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product._id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="productName" className="form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  value={newProductTransfer.productName}
                  readOnly // Make it read-only since it will auto-populate
                />
              </div>
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <div className="input-group">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleQuantityChange(-1)} // Function to decrease quantity
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    id="quantity"
                    name="quantity"
                    value={newProductTransfer.quantity}
                    onChange={handleInputChangeTransfer} // Call the new function here
                    placeholder="Enter Quantity"
                    min="0" // Prevent negative values
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleQuantityChange(1)} // Function to increase quantity
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="movementType" className="form-label">
                  Movement Type
                </label>
                <select
                  className="form-select"
                  id="movementType"
                  name="movementType" // Make sure to add name attribute
                  value={newProductTransfer.movementType}
                  onChange={handleInputChangeTransfer} // Call the new function here
                >
                  <option value="">Select Movement Type</option>
                  <option value="Product Sold">Product Sold</option>
                  <option value="Product Add">Product Add</option>
                  <option value="Product Removed">Product Removed</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="movementDate" className="form-label">
                  Movement Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="movementDate"
                  name="movementDate" // Make sure to add name attribute
                  value={newProductTransfer.movementDate}
                  onChange={handleInputChangeTransfer} // Call the new function here
                />
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username" // Keep the name attribute
                  value={newProductTransfer.username} // This will show "JohnDoe" by default
                  onChange={handleInputChangeTransfer} // This can remain, but will not be used
                  placeholder="Enter Username"
                  readOnly // Prevents editing
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                // Handle stock transfer logic here
                console.log("Stock transfer details:", newProductTransfer);
                handleStockTransferModalClose(); // Close the modal after saving
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal for adding/editing products */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header>
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
                <select
                  id="product_Category"
                  name="product_Category"
                  className="form-control"
                  value={newProduct.product_Category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                <label htmlFor="product_Current_Stock" className="form-label">
                  Current Stock
                </label>
                <input
                  type="text"
                  id="product_Current_Stock"
                  name="product_Current_Stock"
                  className="form-control"
                  value={newProduct.product_Current_Stock}
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
        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Product ID Dropdown */}
              <Form.Group>
                <Form.Label>Product ID</Form.Label>
                <Form.Select
                  value={selectedProductId}
                  onChange={handleProductIdChange}
                >
                  <option value="">Select a product</option>
                  {selectedProductIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Product Name (Read-Only) */}
              <Form.Group>
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProductName}
                  readOnly
                />
              </Form.Group>

              {/* Reason for Deletion */}
              <Form.Group>
                <Form.Label>Reason</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for deleting the product"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteBulk}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showEditModal} onHide={handleCloseEditModal} size="md">
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="editCategoryId" className="form-label">
                Category ID
              </label>
              <select
                className="form-select"
                id="editCategoryId"
                value={selectedCategory.id || ""}
                onChange={(e) =>
                  setSelectedCategory((prev) => ({
                    ...prev,
                    id: e.target.value,
                  }))
                }
              >
                <option value="">Select Category ID</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="editCategoryName" className="form-label">
                Category Name
              </label>
              <input
                type="text"
                className="form-control"
                id="editCategoryName"
                value={selectedCategory.name || ""}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editCategoryDescription" className="form-label">
                Category Description
              </label>
              <input
                type="text"
                className="form-control"
                id="editCategoryDescription"
                value={selectedCategory.description || ""}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleUpdateCategory}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showDeleteModal1}
          onHide={handleCloseDeleteModal1}
          size="md"
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this category?</p>
            <div className="mb-3">
              <label htmlFor="deleteProductId" className="form-label">
                Product ID
              </label>
              <select
                className="form-select"
                id="deleteProductId"
                value={selectedCategory.id || ""}
              >
                <option value={selectedCategory.id}>
                  Select Product ID
                  {selectedCategory.id}
                </option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="deleteProductName" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="deleteProductName"
                value={selectedCategory.name || ""}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="deleteReason" className="form-label">
                Reason
              </label>
              <textarea
                className="form-control"
                id="deleteReason"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Enter reason for deleting this category..."
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete Category
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default Storage;
