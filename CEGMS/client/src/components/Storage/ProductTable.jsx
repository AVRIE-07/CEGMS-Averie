import React from "react";
import { Button } from "react-bootstrap";

const ProductTable = ({
  filteredProducts = [], // Default to an empty array
  loading,
  error,
  selectAll,
  handleSelectAll,
  handleSelectProduct,
  handleModalShow,
  selectedProducts,
}) => {
  return (
    <div className="table-responsive">
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : filteredProducts && filteredProducts.length > 0 ? ( // Check if filteredProducts is defined
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
                Category
              </th>
              <th scope="col" className="fw-semibold">
                Description
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
                Edit/Add
              </th>
            </tr>
          </thead>
          <tbody className="align-middle table-group-divider">
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => handleSelectProduct(product._id)}
                  />
                </td>
                <td className="text-primary">{product.product_Id}</td>
                <td className="text-primary">{product.product_Category}</td>
                <td className="text-primary">{product.product_Description}</td>
                <td className="text-primary">
                  {product.product_Current_Stock}
                </td>
                <td className="text-primary">${product.product_Price}</td>
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
                    <i class="bi bi-pencil-square"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductTable;
