import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cokinslogo from "../_images/cokinslogo.png";
import styles from "../_css/login.module.css";
import { FaUser, FaLock } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Identifier for email/username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [identifierError, setIdentifierError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validate email format

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setError("");
    setIdentifierError(false);
    setPasswordError(false);

    let hasError = false;

    // Validate email
    if (!identifier) {
      setIdentifierError(true);
      setError("Please enter your email.");
      hasError = true;
    } else if (!emailRegex.test(identifier)) {
      setIdentifierError(true);
      setError("Please enter a valid email address.");
      hasError = true;
    }

    // Validate password
    if (!password) {
      setPasswordError(true);
      setError("Password is required.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const loginData = { identifier, password };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        loginData
      );

      const {
        token,
        username,
        firstname,
        email,
        lastname,
        role,
        userId,
        address,
        emergencyContactPerson,
        emergencyContactNumber,
        personalContactNumber,
      } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("firstname", firstname);
      localStorage.setItem("lastname", lastname);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      localStorage.setItem("address", address || "");
      localStorage.setItem(
        "emergencyContactPerson",
        emergencyContactPerson || ""
      );
      localStorage.setItem(
        "emergencyContactNumber",
        emergencyContactNumber || ""
      );
      localStorage.setItem(
        "personalContactNumber",
        personalContactNumber || ""
      );

      if (role === "Employee") {
        navigate("/employee/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const message = error.response.data.message;

        if (message.toLowerCase().includes("email not found")) {
          setError("Email not found. Please register or use a valid email.");
        } else if (message.toLowerCase().includes("incorrect password")) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Email or Password is incorrect. Please try again.");
        }
      } else {
        setError("Email or Password is incorrect. Please try again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`col-8 mx-auto d-flex justify-content-center align-items-center border mt-5 p-4 ${styles.border}`}
      >
        <div className="row">
          <div className="col-6">
            <img src={cokinslogo} alt="Cokins Logo" className="w-100 h-100" />
          </div>
          <div className="col-6 text-center d-flex flex-column justify-content-center align-items-center">
            <div className={styles.w}>
              <h1 className="mb-1 fw-semibold">Welcome</h1>
              <p className="lead mb-5">Login with your email</p>
              <form onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                  <FaUser className={styles.icon} />
                  <input
                    type="text"
                    placeholder="Email"
                    className={`form-control mb-3 ${
                      identifierError ? styles.errorBorder : ""
                    }`}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setIdentifierError(false);
                      setError("");
                    }}
                    value={identifier}
                    style={{ paddingLeft: "40px" }}
                  />
                  {identifierError && (
                    <AiOutlineExclamationCircle className={styles.dangerIcon} />
                  )}
                </div>
                <div className={styles.inputContainer}>
                  <FaLock className={`${styles.icon} ${styles.lockIcon}`} />
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                        setError("");
                      }}
                      value={password}
                      className={`form-control mb-3 ${
                        passwordError ? styles.errorBorder : ""
                      }`}
                      style={{
                        paddingLeft: "40px",
                        paddingRight: "40px",
                      }}
                    />
                    <div
                      className="position-absolute"
                      style={{
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        zIndex: "3",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <BsFillEyeSlashFill />
                      ) : (
                        <BsFillEyeFill />
                      )}
                    </div>
                  </div>
                  {passwordError && (
                    <AiOutlineExclamationCircle className={styles.dangerIcon} />
                  )}
                </div>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button className={`${styles.loginButton} w-100`} type="submit">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
