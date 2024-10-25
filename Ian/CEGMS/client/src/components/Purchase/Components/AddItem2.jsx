import React, { useState } from "react";
import CustomInput from "./CustomInput";

function AddItem({ rows, setRows, errors }) {
  const handleAddRow = (e) => {
    e.preventDefault();
    const newRow = {
      id: rows.length + 1,
      itemID: "",
      description: "",
      orderQuantity: "",
      deliverQuantity: "",
      unitPrice: "",
      lineTotal: "",
    };
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  // Handle input changes within rows
  const handleRowInputChange = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };

        // Auto-calculate line total when quantity or unit price changes
        if (field === "quantity" || field === "unitPrice") {
          const deliverQuantity = parseFloat(updatedRow.deliverQuantity) || 0;
          const unitPrice = parseFloat(updatedRow.unitPrice) || 0;
          updatedRow.lineTotal = (deliverQuantity * unitPrice).toFixed(2);
        }

        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-info">
            <tr>
              <th className="fw-semibold">Remove</th>
              <th className="fw-semibold">#</th>
              <th className="fw-semibold">Item ID</th>
              <th className="fw-semibold">Description</th>
              <th className="fw-semibold">Order Quantity</th>
              <th className="fw-semibold">Quantity Delivered</th>
              <th className="fw-semibold">Unit Price</th>
              <th className="fw-semibold">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>
                  {rows.length > 1 && (
                    <div className="align-items-center d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveRow(row.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  )}
                </td>
                <td className="fw-bold text-center">{index + 1}</td>
                <td>
                  <CustomInput
                    type="text"
                    placeholder="Item ID"
                    name={`itemID-${index}`}
                    value={row.itemID}
                    onChange={(e) =>
                      handleRowInputChange(row.id, "itemID", e.target.value)
                    }
                    error={errors[`itemID-${index}`]}
                  />
                </td>
                <td>
                  <CustomInput
                    type="text"
                    placeholder="Description"
                    name={`description-${index}`}
                    value={row.description}
                    onChange={(e) =>
                      handleRowInputChange(
                        row.id,
                        "description",
                        e.target.value
                      )
                    }
                    error={errors[`description-${index}`]}
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    placeholder="Order Quantity"
                    name={`orderQuantity-${index}`}
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowInputChange(
                        row.id,
                        "orderQuantity",
                        e.target.value
                      )
                    }
                    error={errors[`orderQuantity-${index}`]}
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    placeholder="Quantity Delivered"
                    name={`deliverQuantity-${index}`}
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowInputChange(
                        row.id,
                        "deliverQuantity",
                        e.target.value
                      )
                    }
                    error={errors[`deliverQuantity-${index}`]}
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    step="0.01"
                    placeholder="Unit Price"
                    name={`unitPrice-${index}`}
                    value={row.unitPrice}
                    onChange={(e) =>
                      handleRowInputChange(row.id, "unitPrice", e.target.value)
                    }
                    error={errors[`unitPrice-${index}`]}
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    step="0.01"
                    placeholder="Line Total"
                    name={`lineTotal-${index}`}
                    value={row.lineTotal}
                    readOnly
                    error={errors[`lineTotal-${index}`]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-start">
        <button className="btn btn-primary" onClick={handleAddRow}>
          + Add Item
        </button>
      </div>
    </div>
  );
}

export default AddItem;
