import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Purchase.module.css";
import SelectSupplier from "./Components/SelectSupplier";
import AddCompany from "./Components/AddCompany";
import { Link } from "react-router-dom";

const Purchase = () => {
  const handleLinkClick = (destination) => {
    // Store the destination in local storage or context
    localStorage.setItem("redirectDestination", destination);
  };
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="card shadow-sm py-3 px-4 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-calendar-check-fill fs-3"></i>
              <h5 className="fw-semibold ms-3 mb-0">Purchase</h5>
            </div>
            <div>
              <div>
                <div className="dropdown">
                  <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    + Create Document
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        to="/Purchase/Purchase-Order"
                        className="dropdown-item"
                        onClick={() =>
                          localStorage.setItem(
                            "redirectDestination",
                            "/Purchase/Purchase-Order"
                          )
                        }
                        data-bs-toggle="modal"
                        data-bs-target="#createDoc"
                      >
                        Purchase Order
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Purchase/GRN"
                        className="dropdown-item"
                        onClick={() => handleLinkClick("/Purchase/GRN")}
                        data-bs-toggle="modal"
                        data-bs-target="#createDoc"
                      >
                        Goods Received Note
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Purchase/RMA"
                        className="dropdown-item"
                        onClick={() => handleLinkClick("/Purchase/RMA")}
                        data-bs-toggle="modal"
                        data-bs-target="#createDoc"
                      >
                        Return Merchandise Authorization
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Purchase/Backorder"
                        className="dropdown-item"
                        onClick={() => handleLinkClick("/Purchase/Backorder")}
                        data-bs-toggle="modal"
                        data-bs-target="#createDoc"
                      >
                        Back Order
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm px-4 py-3">
          <div className="d-flex justify-content-end">
            <ul className="nav nav-underline fs-6 text-end">
              <li className="nav-item">
                <Link
                  to="/Purchase"
                  className="nav-link fw-semibold text-decoration-none"
                  style={{ color: "#6a6d71" }}
                >
                  Active
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/Purchase/Cancelled"
                  className="nav-link fw-semibold text-decoration-none border-bottom border-primary border-2"
                >
                  Cancelled
                </Link>
              </li>
            </ul>
          </div>

          <div className="row g-3 align-items-center mb-4">
            <div className="col-12 col-md-2 me-4">
              <label htmlFor="" className="mb-2" style={{ fontSize: ".8rem" }}>
                Transaction Type
              </label>
              <select
                className="form-select rounded-pill border-primary"
                aria-label="Default select example"
              >
                <option selected>Purchase Transaction</option>
              </select>
            </div>
            <div className="col-12 col-md-2 me-4">
              <label htmlFor="" className="mb-2" style={{ fontSize: ".8rem" }}>
                Goods/Services
              </label>
              <select
                className="form-select rounded-pill border-primary"
                aria-label="Default select example"
              >
                <option selected>All</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <label htmlFor="" className="mb-2" style={{ fontSize: ".8rem" }}>
                Status
              </label>
              <select
                className="form-select rounded-pill border-primary"
                aria-label="Default select example"
              >
                <option selected>All</option>
              </select>
            </div>
          </div>

          <div>
            <table class="table table-hover border-top">
              <thead className="table-info">
                <tr>
                  <th scope="col" className="fw-semibold">
                    COMPANY NAME
                  </th>
                  <th scope="col" className="fw-semibold">
                    TRANSACTION NAME
                  </th>
                  <th scope="col" className="fw-semibold">
                    DOCUMENT NUMBER
                  </th>
                  <th scope="col" className="fw-semibold">
                    GOODS STATUS
                  </th>
                  <th scope="col" className="fw-semibold">
                    LAST MODIFIED
                  </th>
                </tr>
              </thead>
              <tbody className="fs-6 align-middle table-group-divider">
                <tr>
                  <th scope="row" className="text-primary">
                    Company 1
                  </th>
                  <td className="text-primary">Purchase Order 1</td>
                  <td className="text-primary">PO1</td>
                  <td>
                    <button className="btn btn-outline-success rounded-pill">
                      Recieved
                    </button>
                  </td>
                  <td className="text-primary">22/03/2024, 7:00 pm</td>
                </tr>
                <tr>
                  <th scope="row" className="text-primary">
                    Company 2
                  </th>
                  <td className="text-primary">Purchase Order 2</td>
                  <td className="text-primary">PO2</td>
                  <td>
                    <button className="btn btn-outline-primary rounded-pill">
                      Draft
                    </button>
                  </td>
                  <td className="text-primary">22/03/2024, 7:00 pm</td>
                </tr>
                <tr>
                  <th scope="row" className="text-primary">
                    Company 3
                  </th>
                  <td className="text-primary">Purchase Order 3</td>
                  <td className="text-primary">PO3</td>
                  <td>
                    <button className="btn btn-outline-danger rounded-pill">
                      Not Dispatched
                    </button>
                  </td>
                  <td className="text-primary">22/03/2024, 7:00 pm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal create document*/}
      <SelectSupplier></SelectSupplier>

      {/* Modal add company*/}
      <AddCompany></AddCompany>
    </div>
  );
};

export default Purchase;
