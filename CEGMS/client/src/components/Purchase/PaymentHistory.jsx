import React from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import styles from "./Purchase.module.css";
import AddPayment from "./Components/AddPayment";

const PaymentHistory = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className="card shadow-sm py-3 px-4 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-clock-fill fs-3"></i>
              <h5 className="fw-semibold ms-3 mb-0">Payment History</h5>
            </div>
            <div>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#addPayment"
              >
                + Add Payment
              </button>
            </div>
          </div>
        </div>

        <div className="card shadow-sm px-4 py-3">
          <table class="table table-hover border-top">
            <thead className="table-info">
              <tr>
                <th scope="col" className="fw-semibold">
                  DOCUMENT NUMBER
                </th>
                <th scope="col" className="fw-semibold">
                  INWARD NUMBER
                </th>
                <th scope="col" className="fw-semibold">
                  PAYMENT DATE
                </th>
                <th scope="col" className="fw-semibold">
                  MODE OF PAYMENT
                </th>
                <th scope="col" className="fw-semibold">
                  AMOUNT DUE
                </th>
                <th scope="col" className="fw-semibold">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="fs-6 align-middle table-group-divider">
              <tr>
                <th scope="row" className="text-primary">
                  PH1234
                </th>
                <td className="text-primary">WR1234</td>
                <td className="text-primary">01/01/2024</td>
                <td>Online</td>
                <td>Php 2,000.00</td>
                <td>
                  <button className="btn btn-outline-primary rounded-pill">
                    Pending
                  </button>
                </td>
              </tr>
              <tr>
                <th scope="row" className="text-primary">
                  PH5678
                </th>
                <td className="text-primary">WR5678</td>
                <td className="text-primary">10/10/2024</td>
                <td>COD</td>
                <td>Php 5,000.00</td>
                <td>
                  <button className="btn btn-outline-success rounded-pill">
                    Completed
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      {/*Modal for add payment*/}
      <AddPayment></AddPayment>
    </div>
  );
};

export default PaymentHistory;
