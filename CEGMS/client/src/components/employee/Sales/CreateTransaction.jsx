import React, { useState, useEffect } from 'react';
import Sidebar from '../SidebarComponents/Sidebar';
import styles from './Sales.module.css';
import { useNavigate } from 'react-router-dom';

const CreateTransaction = () => {
  const [items, setItems] = useState([{ code: 'SP01', description: 'School Products 1', quantity: '', unitPrice: '', totalPrice: '' }]);
  const [amountGiven, setAmountGiven] = useState(100);
  const [grandTotal, setGrandTotal] = useState(0);

  const navigate = useNavigate();

  const handleAddItem = () => {
    setItems([...items, { code: '', description: '', quantity: '', unitPrice: '', totalPrice: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].totalPrice = (quantity * unitPrice).toFixed(2);
    }

    setItems(updatedItems);
    calculateGrandTotal(updatedItems);
  };

  const calculateGrandTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (parseFloat(item.totalPrice) || 0), 0);
    setGrandTotal(total.toFixed(2));
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateGrandTotal(updatedItems);
  };

  const handleCancel = () => {
    navigate('/Sales');
  };

  useEffect(() => {
    calculateGrandTotal(items);
  }, [items]);

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="card shadow-sm py-3 px-4 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-bar-chart-fill fs-3"></i>
              <h5 className="fw-semibold ms-3 mb-0">Create Sales Transaction</h5>
            </div>
          </div>
        </div>

        <div className="card shadow-sm px-4 py-3">
          <h6 className="mb-3">Transaction Details</h6>
          <div className="d-flex align-items-start mb-3">
            <div className="d-flex flex-column me-3" style={{ flex: '1' }}>
              <label>Transaction ID</label>
              <input
                type="text"
                value="Auto-Generated"
                readOnly
                className="form-control"
              />
              <label className="mt-2">Cashier Name</label>
              <input
                type="text"
                value="Ssteven Allaga (Sample)"
                readOnly
                className="form-control"
              />
            </div>
            <div style={{ flex: '1' }}>
              <label>Transaction Date</label>
              <input
                type="text"
                value={new Date().toLocaleString()}
                readOnly
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="card shadow-sm px-4 py-3 mt-3">
          <table className="table mt-1">
            <thead>
              <tr>
                <th>Action</th>
                <th>Item Code</th>
                <th>Item Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="btn"
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: 'none',
                        fontSize: '1.5rem',
                        lineHeight: '1rem'
                      }}
                    >
                      &minus;
                    </button>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) => handleInputChange(index, 'code', e.target.value)}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleInputChange(index, 'unitPrice', e.target.value)}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.totalPrice}
                      readOnly
                      className="form-control"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleAddItem} className="btn btn-primary">+ Add Item</button>
        </div>

        <div className="card shadow-sm px-4 py-3 mt-3">
          <table className="table mt-4">
            <tbody>
              <tr>
                <td>Grand Total:</td>
                <td>P {grandTotal}</td>
              </tr>
              <tr>
                <td>Amount Given:</td>
                <td>
                  <input
                    type="number"
                    value={amountGiven}
                    onChange={(e) => setAmountGiven(e.target.value)}
                    className="form-control"
                  />
                </td>
              </tr>
              <tr>
                <td>Change:</td>
                <td>P 0.00</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 d-flex justify-content-end">
          <button className="btn btn-secondary me-2">View Receipt</button>
            <button onClick={handleCancel} className="btn btn-danger me-2">Cancel</button>
            <button className="btn btn-primary">Mark as Paid</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateTransaction;
