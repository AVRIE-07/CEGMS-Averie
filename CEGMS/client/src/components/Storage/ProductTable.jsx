import React, { useState } from "react";
import { Button } from "react-bootstrap";

const ProductTable = ({
  filteredProducts = [],
  loading,
  error,
  selectAll,
  handleSelectAll,
  handleSelectProduct,
  handleModalShow,
  selectedProducts,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Calculate the products to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, "..."];
      } else if (currentPage >= totalPages - 2) {
        pages = [
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pages = ["...", currentPage - 1, currentPage, currentPage + 1, "..."];
      }
    }
    return pages.map((page, index) => (
      <li
        key={index}
        className={`page-item ${page === currentPage ? "active" : ""} ${
          page === "..." ? "disabled" : ""
        }`}
      >
        <button
          className="page-link"
          onClick={() => handlePageClick(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      </li>
    ));
  };

  return (
    <div className="table-responsive">
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <table className="table table-hover table-striped border-top">
            <thead className="table-info">
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th scope="col" className="fw-semibold">
                  Product ID
                </th>
                <th scope="col" className="fw-semibold">
                  Product Name & Description
                </th>
                <th scope="col" className="fw-semibold">
                  Category
                </th>
                <th scope="col" className="fw-semibold">
                  Current Stock Level
                </th>
                <th scope="col" className="fw-semibold">
                  Price
                </th>
                <th scope="col" className="fw-semibold">
                  Min Stock Level
                </th>
                <th scope="col" className="fw-semibold">
                  Max Stock Level
                </th>
                <th scope="col" className="fw-semibold">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="align-middle table-group-divider">
              {currentProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                    />
                  </td>
                  <td className="text-primary">{product.product_Id}</td>
                  <td className="text-primary">
                    <div style={{ display: "flex", gap: "10px" }}>
                      {/* Display Product Name and Description side by side */}
                      <div style={{ flex: "1", fontWeight: "bold" }}>
                        {product.product_Name}
                      </div>
                      <div style={{ flex: "2", fontStyle: "italic" }}>
                        {product.product_Description}
                      </div>
                    </div>
                  </td>
                  <td className="text-primary">{product.product_Category}</td>
                  <td className="text-primary">
                    {product.product_Current_Stock}
                  </td>
                  <td className="text-primary">₱ {product.product_Price}</td>
                  <td className="text-primary">
                    {product.product_Minimum_Stock_Level}
                  </td>
                  <td className="text-primary">
                    {product.product_Maximum_Stock_Level}
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      onClick={() => handleModalShow(product)}
                      className="me-2 rounded-pill"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {renderPageNumbers()}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductTable;
