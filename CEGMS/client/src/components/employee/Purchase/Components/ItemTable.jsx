import { useState } from "react";

const ItemTable = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      itemID: "",
      description: "",
      quantity: "",
      unitPrice: "",
      lineTotal: "",
    },
  ]);

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      itemID: "",
      description: "",
      quantity: "",
      unitPrice: "",
      lineTotal: "",
    };
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  return (
    <>
      <table class="table border-top text-center">
        <thead>
          <tr className="table-info">
            <th scope="col">Delete</th>
            <th scope="col">Item ID</th>
            <th scope="col">Item Description</th>
            <th scope="col">Quantity</th>
            <th scope="col">Unit Price</th>
            <th scope="col">Line Total</th>
          </tr>
        </thead>
        <tbody className="fs-6 align-middle">
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="text-danger">
                <i
                  className="bi bi-trash-fill fs-5"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveRow(row.id)}
                ></i>
              </th>
              <td>
                <input
                  type="text"
                  className="form-control border-bottom border-1 border-dark rounded-0 text-center border-top-0 border-end-0 border-start-0"
                  value={row.itemID}
                  onChange={(e) =>
                    handleInputChange(row.id, "itemID", e.target.value)
                  }
                  placeholder="Item ID"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control border-bottom border-1 border-dark rounded-0 text-center border-top-0 border-end-0 border-start-0"
                  value={row.description}
                  onChange={(e) =>
                    handleInputChange(row.id, "description", e.target.value)
                  }
                  placeholder="Description"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control border-bottom border-1 border-dark rounded-0 text-center border-top-0 border-end-0 border-start-0"
                  value={row.quantity}
                  onChange={(e) =>
                    handleInputChange(row.id, "quantity", e.target.value)
                  }
                  placeholder="Quantity"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control border-bottom border-1 border-dark rounded-0 text-center border-top-0 border-end-0 border-start-0"
                  value={row.unitPrice}
                  onChange={(e) =>
                    handleInputChange(row.id, "unitPrice", e.target.value)
                  }
                  placeholder="Unit Price"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control border-bottom border-1 border-dark rounded-0 text-center border-top-0 border-end-0 border-start-0"
                  value={row.lineTotal}
                  onChange={(e) =>
                    handleInputChange(row.id, "lineTotal", e.target.value)
                  }
                  placeholder="Line Total"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleAddRow}>
        + Add Item
      </button>
    </>
  );
};

export default ItemTable;
