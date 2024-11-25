import React from "react";

function Navbar(){
    return(
        <ul className="nav nav-underline fs-6 mt-2 border-bottom border-2 border-secondary" style={{ position: 'fixed', top: 0, width: '77.5%', zIndex: 1000 }}>
            <li className="nav-item pe-3">
                <a className="nav-link fw-semibold border-bottom border-primary border-2" href="#">Purchase</a>
            </li>
            <li className="nav-item pe-3">
                <a className="nav-link fw-semibold" href="#">Payment History</a>
            </li>
        </ul>
    )
}

export default Navbar