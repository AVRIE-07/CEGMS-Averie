import React, { useEffect, useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Dropdown } from "react-bootstrap";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";

const Storage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchCategory, setSearchCategory] = useState(""); // For Category search
  const [selectedProducts, setSelectedProducts] = useState([]); // State for Selected Products that will be deleted
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [overStockCount, setOverStockCount] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Unified search term
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");

  const openSuccessModal = (message) => {
    setSuccessModalMessage(message);
    setSuccessModalVisible(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter change
  const handleCategoryFilterChange = (category) => {
    setSearchCategory(category);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/category");
        setCategories(response.data);
      } catch (error) {
        setError("Could not fetch categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const [newProduct, setNewProduct] = useState({
    product_Category: "",
    product_Description: "",
    product_Current_Stock: "",
    product_Quantity: "",
    product_Price: "",
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
      let response;
      // Determine the status based on quantity levels
      let productStatus;
      if (
        newProduct.product_Current_Stock <
        newProduct.product_Minimum_Stock_Level
      ) {
        productStatus = "Low Stock";
      } else if (
        newProduct.product_Current_Stock >
        newProduct.product_Maximum_Stock_Level
      ) {
        productStatus = "Overstocked";
      } else {
        productStatus = "In Stock";
      }

      // Include the calculated status in the product object
      const productData = { ...newProduct, product_Status: productStatus };

      if (isEditMode) {
        // Fetch the current product details to get the existing current stock
        const existingProduct = products.find(
          (product) => product._id === currentProductId
        );

        // Add the new product quantity to the current stock
        const updatedProductData = {
          ...newProduct,
          product_Current_Stock:
            parseInt(existingProduct.product_Current_Stock) +
            parseInt(newProduct.product_Quantity),
        };

        // Update product logic
        response = await axios.put(
          `http://localhost:3001/api/products/${currentProductId}`,
          updatedProductData
        );

        // Update product in the state
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === currentProductId ? response.data : product
          )
        );

        // Add the stock movement entry for updating stock
        await axios.post("http://localhost:3001/api/stockMovement", {
          product_ID: existingProduct.product_Id,
          adj_Description: existingProduct.product_Description,
          adj_Category: existingProduct.product_Category,
          adj_Quantity: newProduct.product_Quantity,
          adj_Price: existingProduct.product_Price,
          adj_Adjustment_Type: "Added", // You can adjust this based on the operation
        });
      } else {
        // Create a new product
        response = await axios.post(
          "http://localhost:3001/api/products",
          productData
        );
        const createdProduct = response.data;
        setProducts((prevProducts) => [...prevProducts, createdProduct]);

        // Add manual adjustment entry for new product
        await axios.post("http://localhost:3001/api/manualAdjustment", {
          product_ID: createdProduct.product_Id,
          adj_Description: createdProduct.product_Description,
          adj_Category: createdProduct.product_Category,
          adj_Quantity: createdProduct.product_Current_Stock,
          adj_Price: createdProduct.product_Price,
          adj_Adjustment_Type: "Added",
        });

        // Add stock movement for new product
        await axios.post("http://localhost:3001/api/stockMovement", {
          product_ID: createdProduct.product_Id,
          adj_Description: createdProduct.product_Description,
          adj_Category: createdProduct.product_Category,
          adj_Quantity: createdProduct.product_Current_Stock,
          adj_Price: createdProduct.product_Price,
          adj_Adjustment_Type: "Added",
        });
      }
      openSuccessModal(
        isEditMode
          ? "Product successfully updated!"
          : "Product successfully added!"
      );
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
        product_Current_Stock: product.product_Current_Stock,
        product_Quantity: product.product_Quantity,
        product_Price: product.product_Price,
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
      product_Minimum_Stock_Level: "",
      product_Maximum_Stock_Level: "",
    });
    setCurrentProductId(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = searchCategory
      ? product.product_Category
          .toLowerCase()
          .includes(searchCategory.toLowerCase())
      : true;

    const matchesDescription = searchTerm
      ? product.product_Description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    const matchesId = searchTerm
      ? (product.product_Id || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    const matchesStatus = (statusFilter) => {
      switch (statusFilter) {
        case "Low Stock":
          return (
            product.product_Current_Stock < product.product_Minimum_Stock_Level
          );
        case "In Stock":
          return (
            product.product_Current_Stock >=
              product.product_Minimum_Stock_Level &&
            product.product_Current_Stock <= product.product_Maximum_Stock_Level
          );
        case "Overstocked":
          return (
            product.product_Current_Stock > product.product_Maximum_Stock_Level
          );
        default:
          return true; // No status filter applied
      }
    };

    return (
      matchesCategory &&
      (matchesId || matchesDescription) &&
      matchesStatus(statusFilter)
    );
  });

  const handleSelectProduct = (id) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.includes(id)
        ? prevSelectedProducts.filter((productId) => productId !== id)
        : [...prevSelectedProducts, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]); // Deselect all
    } else {
      setSelectedProducts(products.map((product) => product._id)); // Select all
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      setShowDeleteModal(true); // Show confirmation modal
    }
  };
  const confirmDelete = async () => {
    try {
      for (let id of selectedProducts) {
        await axios.delete(`http://localhost:3001/api/products/${id}`);
      }
      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => !selectedProducts.includes(product._id)
        )
      );
      setSelectedProducts([]);
      setSelectAll(false);
      openSuccessModal("Selected products deleted successfully.");
    } catch (error) {
      setError("Could not delete selected products. Please try again.");
    } finally {
      setShowDeleteModal(false); // Close modal after action
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Close modal without deleting
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        const fetchedProducts = response.data;

        // Calculate totals
        let quantitySum = 0;
        let priceSum = 0;
        let lowStock = 0;
        let overStock = 0;

        fetchedProducts.forEach((product) => {
          // Ensure product_Quantity is a valid number
          const quantity = parseInt(product.product_Quantity, 10);
          const price = parseFloat(product.product_Price);

          if (!isNaN(quantity)) {
            quantitySum += quantity; // Only add valid numbers
          }

          if (!isNaN(price) && !isNaN(quantity)) {
            priceSum += quantity * price; // Only calculate price if quantity is valid
          }

          if (
            product.product_Current_Stock < product.product_Minimum_Stock_Level
          ) {
            lowStock += 1;
          }
          if (
            product.product_Current_Stock > product.product_Maximum_Stock_Level
          ) {
            overStock += 1;
          }
        });

        // Update products and totals
        setProducts(fetchedProducts);
        setTotalQuantity(quantitySum);
        setTotalPrice(priceSum);
        setLowStockCount(lowStock);
        setOverStockCount(overStock);
      } catch (error) {
        setError("Could not fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="d-flex justify-content-start">
          <ul className="nav nav-underline fs-6 me-3">
            <li className="nav-item pe-3">
              <Link
                to="/employee/Storage" // Link to Products component
                className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
              >
                Products
              </Link>
            </li>
            <li className="nav-item pe-3">
              <Link
                to="/employee/Storage/StockMovement" // Link to Inventory Approvals component
                className="nav-link fw-semibold text-decoration-none"
                style={{ color: "#6a6d71" }}
              >
                Stock Movement
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/employee/Storage/Reports" // Link to Reports component
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
            <div className="d-flex align-items-center">
              <Button
                onClick={handleDeleteSelected}
                className="btn btn-danger me-2"
                disabled={selectedProducts.length === 0}
              >
                Delete Selected
              </Button>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  Actions
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to="/employee/Storage/CreateProducts"
                  >
                    {" "}
                    {/* Updated here */}
                    Add Product
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/employee/Storage/CreateCategory"
                  >
                    Category
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div
          className="card shadow-sm px-4 py-2"
          style={{ backgroundColor: "#50504D" }}
        >
          {/* Dropdown for filtering by status */}
          <div
            className="d-flex align-items-center" // Remove justify-content-between to avoid extra space
            style={{ height: "60px" }}
          >
            <input
              type="text"
              placeholder="Search by ID or Description"
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control me-2" // Add Bootstrap classes for styling
              style={{ borderRadius: 5, width: 300, marginRight: 0 }}
            />

            <Dropdown className="me-3">
              <Dropdown.Toggle
                id="dropdown-basic"
                style={{
                  backgroundColor: "#343a40", // Dark background for the toggle button
                  color: "#ffffff", // White text color
                  border: "none", // Remove border if needed
                }}
              >
                Filter by Category
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  backgroundColor: "#9df1fa", // Background for dropdown items
                  border: "none", // Optional: remove border
                }}
              >
                <Dropdown.Item onClick={() => handleCategoryFilterChange("")}>
                  All Categories
                </Dropdown.Item>
                {categories.map((category) => (
                  <Dropdown.Item
                    key={category._id}
                    onClick={() =>
                      handleCategoryFilterChange(category.product_Category)
                    }
                  >
                    {category.product_Category}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown onSelect={(e) => setStatusFilter(e)}>
              <Dropdown.Toggle
                id="dropdown-basic"
                style={{
                  backgroundColor: "#343a40", // Dark background for the toggle button
                  color: "#ffffff", // White text color
                  border: "none", // Remove border if needed
                }}
              >
                Filter by Status
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  backgroundColor: "#9df1fa ", // Background for dropdown items
                  border: "none", // Optional: remove border
                }}
              >
                <Dropdown.Item eventKey="">All</Dropdown.Item>
                <Dropdown.Item eventKey="Low Stock">Low Stock</Dropdown.Item>
                <Dropdown.Item eventKey="In Stock">In Stock</Dropdown.Item>
                <Dropdown.Item eventKey="Overstocked">
                  Overstocked
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Statistics */}
            <div className="d-flex align-items-center justify-content-between text-white p-3 rounded">
              <div className="me-4 px-3 py-2 bg-dark rounded">
                <strong style={{ fontWeight: "normal" }}>
                  <i class="bi bi-activity" style={{ marginRight: "10px" }}></i>
                  Total Quantity:
                </strong>{" "}
                {totalQuantity}
              </div>
              <div className="me-4 px-3 py-2 bg-danger rounded">
                <strong style={{ fontWeight: "normal", color: "black" }}>
                  <i
                    className="bi bi-box-fill"
                    style={{ marginRight: "10px" }}
                  />
                  Low Stock: {lowStockCount}
                </strong>{" "}
              </div>
              <div className="px-3 py-2 bg-warning rounded">
                <strong style={{ fontWeight: "normal", color: "black" }}>
                  <i
                    className="bi bi-box-fill"
                    style={{ marginRight: "10px" }}
                  />
                  Over Stock: {overStockCount}
                </strong>{" "}
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <Modal show={successModalVisible} onHide={closeSuccessModal} centered>
          <Modal.Header>
            <Modal.Title className="text-success">
              <i className="bi bi-check-circle-fill me-2"></i> Success!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>{successModalMessage}</p>
            <div style={{ fontSize: "2em", color: "#28a745" }}>
              <i className="bi bi-check-circle-fill"></i>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="success" onClick={closeSuccessModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="card shadow-sm px-4 py-3 mb-4">
          {/* Product Table */}
          <ProductTable
            filteredProducts={filteredProducts}
            loading={loading}
            error={error}
            selectAll={selectAll}
            handleSelectAll={handleSelectAll}
            handleSelectProduct={handleSelectProduct}
            handleModalShow={handleModalShow}
            selectedProducts={selectedProducts}
          />
        </div>

        {/* Product Modal */}
        <ProductModal
          showModal={showModal}
          handleModalClose={handleModalClose}
          isEditMode={isEditMode}
          newProduct={newProduct}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          categories={categories} // Pass categories here
        />
        <ConfirmationModal
          show={showDeleteModal}
          message="Are you sure you want to delete the selected products?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </main>
    </div>
  );
};

export default Storage;
