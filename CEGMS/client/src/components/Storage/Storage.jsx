import React, { useEffect, useState } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Storage.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Dropdown } from "react-bootstrap";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import AddCategoryModal from "./AddCategoryModal"; // Adjust the path as needed

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
  const [selectedProducts, setSelectedProducts] = useState([]); // State for Selected Products that will be deleted
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [overStockCount, setOverStockCount] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/category");
      setCategories(response.data);
    } catch (error) {
      setError("Could not fetch categories. Please try again later.");
    }
  };
  const handleShowCategoryModal = () => {
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
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
      if (isEditMode) {
        // Update product logic
        response = await axios.put(
          `http://localhost:3001/api/products/${currentProductId}`,
          newProduct
        );
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === currentProductId ? response.data : product
          )
        );
      } else {
        // Create a new product
        response = await axios.post(
          "http://localhost:3001/api/products",
          newProduct
        );
        const createdProduct = response.data;
        setProducts((prevProducts) => [...prevProducts, createdProduct]);

        // Add manual adjustment entry for new product
        await axios.post("http://localhost:3001/api/manualAdjustment", {
          product_ID: createdProduct.product_Id,
          adj_Description: "Initial stock entry",
          adj_Category: createdProduct.product_Category,
          adj_Quantity: createdProduct.product_Quantity,
          adj_Price: createdProduct.product_Price,
          adj_Adjustment_Type: "Add", // or other type based on context
        });
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
    const matchesDescription = (product.product_Description || "")
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

  const handleDeleteSelected = async () => {
    if (
      selectedProducts.length > 0 &&
      window.confirm("Are you sure you want to delete the selected products?")
    ) {
      try {
        for (let id of selectedProducts) {
          await axios.delete(`http://localhost:3001/api/products/${id}`);
        }
        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) => !selectedProducts.includes(product._id)
          )
        );
        setSelectedProducts([]); // Clear selection after deletion
        setSelectAll(false); // Reset select all checkbox
      } catch (error) {
        setError("Could not delete selected products. Please try again.");
      }
    }
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
          quantitySum += product.product_Quantity;
          priceSum += product.product_Quantity * product.product_Price;
          if (product.product_Quantity < product.product_Minimum_Stock_Level) {
            lowStock += 1;
          }
          if (product.product_Quantity > product.product_Maximum_Stock_Level) {
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

        <div className="card shadow-sm py-4 px-5 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-bar-chart-fill fs-3 text-primary"></i>
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
                  <Dropdown.Item onClick={() => handleModalShow()}>
                    Add Product
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleShowCategoryModal()}>
                    Add Category
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
            className="d-flex justify-content-between align-items-center"
            style={{ height: "50px" }}
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

            {/* Statistics */}
            <div className="d-flex align-items-center justify-content-between text-white p-3 rounded">
              <div className="me-4 px-3 py-2 bg-secondary rounded">
                <strong style={{ fontWeight: "normal" }}>
                  Total Quantity:
                </strong>{" "}
                {totalQuantity}
              </div>
              <div className="me-4 px-3 py-2 bg-secondary rounded">
                <strong style={{ fontWeight: "normal" }}>Total Price:</strong> $
                {totalPrice.toFixed(2)}
              </div>
              <div className="me-4 px-3 py-2 bg-secondary rounded">
                <strong style={{ fontWeight: "normal" }}>Low Stock:</strong>{" "}
                {lowStockCount}
              </div>
              <div className="px-3 py-2 bg-secondary rounded">
                <strong style={{ fontWeight: "normal" }}>Over Stock:</strong>{" "}
                {overStockCount}
              </div>
            </div>
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
        <AddCategoryModal
          show={showCategoryModal}
          handleClose={handleCloseCategoryModal}
          fetchCategories={fetchCategories}
        />
      </main>
    </div>
  );
};

export default Storage;
