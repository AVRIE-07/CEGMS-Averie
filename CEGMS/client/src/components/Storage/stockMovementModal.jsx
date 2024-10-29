import React from "react";
import { Modal, Table, Button } from "react-bootstrap";
import "./StockMovementModal.css"; // Ensure the path is correct

const StockMovementModal = ({ show, handleClose, stockMovements }) => {
  // Function to find the earliest and latest dates
  const getDateRange = () => {
    if (stockMovements.length === 0) return { earliest: "", latest: "" };

    const dates = stockMovements.map((movement) => new Date(movement.adj_Date));
    const earliest = new Date(Math.min(...dates));
    const latest = new Date(Math.max(...dates));

    return {
      earliest: earliest.toLocaleDateString(),
      latest: latest.toLocaleDateString(),
    };
  };
  const handlePrint = () => {
    const { earliest, latest } = getDateRange();
    const printContent = document.getElementById("printable-content");
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Stock Movements</title>
          <link 
            rel="stylesheet" 
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
            integrity="sha384-DyZvNqH2BzU0HqUEUeChzj7H04pZ2dWQy1B3i29e6H7SvD8sPvL49Rim55G8Dq4m"
            crossorigin="anonymous"
          />
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 20px;
              color: #333;
              background-color: #f4f4f4; /* Slight background color for contrast */
            }
            h1 {
              text-align: center;
              color: #007bff; /* Bootstrap primary color */
              margin-bottom: 20px;
            }
            p {
              font-size: 16px;
              margin: 10px 0;
            }
            .date-range {
              margin-bottom: 20px;
              text-align: center;
              font-weight: bold;
              color: #333;
              background-color: #e9ecef; /* Light grey background */
              padding: 10px;
              border-radius: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Stronger shadow */
              background-color: #fff; /* White background for the table */
            }
            th, td {
              border: 1px solid #007bff; /* Strong blue borders */
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: blue; /* Bootstrap primary color */
              color:whit; /* White text for contrast */
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa; /* Light grey for even rows */
            }
            tr:hover {
              background-color: #e2e6ea; /* Slightly darker hover color */
            }
            footer {
              margin-top: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <h1>Stock Movements</h1>
          <div class="date-range">
            <p>Start Date: <strong>${earliest}</strong></p>
            <p>End Date: <strong>${latest}</strong></p>
          </div>
          ${printContent.innerHTML}
          <footer>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </footer>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Stock Movements</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal">
        <div id="printable-content">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Movement ID</th>
                <th>Product ID</th>
                <th>Description</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Adjustment Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.map((movement) => (
                <tr key={movement.movement_ID}>
                  <td>{movement.movement_ID}</td>
                  <td>{movement.product_ID}</td>
                  <td>{movement.adj_Description}</td>
                  <td>{movement.adj_Category}</td>
                  <td>{movement.adj_Quantity}</td>
                  <td>{movement.adj_Price}</td>
                  <td>{movement.adj_Adjustment_Type}</td>
                  <td>{new Date(movement.adj_Date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePrint}>
          Print
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StockMovementModal;
