const ReportPage = ({ location }) => {
  const filteredProducts = location.state?.filteredProducts || [];

  return (
    <div>
      <h2>Product Report</h2>
      <table>
        <thead>
          <tr>
            <th>ProductID</th>
            <th>Description</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Current Stock</th>
            <th>Status</th>
            <th>Date Added</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.product_Id}</td>
              <td>{product.product_Description}</td>
              <td>{product.product_Category}</td>
              <td>{product.product_Quantity}</td>
              <td>{product.product_Price}</td>
              <td>{product.product_Current_Stock}</td>
              <td>{product.product_Status}</td>
              <td>{new Date(product.product_Date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
