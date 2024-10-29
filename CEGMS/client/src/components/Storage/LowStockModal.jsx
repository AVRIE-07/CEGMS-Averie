import React from "react";
import { Modal, Table, Button } from "react-bootstrap";

const LowStockModal = ({ show, handleClose, lowStockItems }) => {
  // Function to get date range (customize according to your data structure)
  const getStockLevelRange = () => {
    if (lowStockItems.length === 0) return { earliest: "", latest: "" };

    const stockLevels = lowStockItems.map((item) => item.product_Current_Stock);
    const earliest = Math.min(...stockLevels);
    const latest = Math.max(...stockLevels);

    return { earliest, latest };
  };

  // Function to handle printing
  const handlePrint = () => {
    const { earliest, latest } = getStockLevelRange();
    const printContent = document.getElementById("printable-content");
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Low Stock Products</title>
          <link 
            rel="stylesheet" 
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
            integrity="sha384-DyZvNqH2BzU0HqUEUeChzj7H04pZ2dWQy1B3i29e6H7SvD8sPvL49Rim55G8Dq4m"
            crossorigin="anonymous"
          />
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              padding: 10px;
              background-color: #f9f9f9;
            }
            h1 {
              text-align: center;
              color: #333;
            }
            p {
              font-size: 16px;
              margin: 5px 0;
              color: #555;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #007bff;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            tr:hover {
              background-color: #e2e2e2;
            }
          </style>
        </head>
        <body>
          <h1>Low Stock Products</h1>
          <p><strong>Lowest Stock Level:</strong> ${earliest}</p>
          <p><strong>Highest Stock Level:</strong> ${latest}</p>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Low Stock Products</Modal.Title>
      </Modal.Header>
      <Modal.Body id="printable-content">
        {" "}
        {/* Added an ID for printing */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Category</th>
              <th>Description</th>
              <th>Current Stock</th>
              <th>Minimum Stock Level</th>
            </tr>
          </thead>
          <tbody>
            {lowStockItems.map((item) => (
              <tr key={item.product_Id}>
                <td>{item.product_Id}</td>
                <td>{item.product_Category}</td>
                <td>{item.product_Description}</td>
                <td>{item.product_Current_Stock}</td>
                <td>{item.product_Minimum_Stock_Level}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handlePrint}>
          Print
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LowStockModal;
