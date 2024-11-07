import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import cokinslogo from "../_images/cokinslogo.png";
import styles from "../_css/login.module.css";
import googleLogo from "../_images/google.png";
import { FaUser, FaLock } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, username, password } = formData;

    // Clear previous errors
    setErrors({});

    let hasError = false;
    const newErrors = {};

    // Regex for email and username validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/; // Adjust this regex as per your username rules

    // Validation
    if (!email && !username) {
      newErrors.input = "Please fill in all required fields.";
      hasError = true;
    } else if (email && !emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
      hasError = true;
    } else if (username && !usernameRegex.test(username)) {
      newErrors.username =
        "Invalid username. Must be at least 3 characters long and can contain letters, numbers, and underscores.";
      hasError = true;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const loginData = email ? { email, password } : { username, password };

    try {
      const response = await axios.post(
        "http://localhost:3001/users/login",
        loginData
      );
      if (response.data === "Success") {
        navigate("/dashboard");
      } else {
        setErrors({ server: response.data });
      }
    } catch (error) {
      // Handle the error based on the response
      if (error.response && error.response.status === 401) {
        setErrors({ server: "Unauthorized. Please check your credentials." });
      } else {
        setErrors({ server: "An error occurred. Please try again." });
      }
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    // Clear any previous errors when user starts typing
    setErrors((prev) => ({ ...prev, input: "", email: "", username: "" }));

    if (value.includes("@")) {
      setFormData({ email: value, username: "", password: formData.password });
    } else {
      setFormData({ email: "", username: value, password: formData.password });
    }
  };

  const handlePasswordChange = (e) => {
    setFormData((prev) => ({ ...prev, password: e.target.value }));
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
              <p className="lead mb-5">Login with username or email</p>
              <form onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                  <FaUser className={styles.icon} />
                  <input
                    type="text"
                    placeholder="Email or Username"
                    className={`form-control mb-3 ${
                      errors.input || errors.email || errors.username
                        ? styles.errorBorder
                        : ""
                    }`}
                    onChange={handleInputChange}
                    value={formData.email || formData.username}
                    style={{ paddingLeft: "40px" }}
                  />
                  {(errors.input || errors.email || errors.username) && (
                    <AiOutlineExclamationCircle className={styles.dangerIcon} />
                  )}
                </div>
                {errors.username && (
                  <p className={styles.errorMessage}>{errors.username}</p>
                )}
                <div className={styles.inputContainer}>
                  <FaLock className={styles.icon} />
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={handlePasswordChange}
                    value={formData.password}
                    className={`form-control mb-3 ${
                      errors.password ? styles.errorBorder : ""
                    }`}
                    style={{ paddingLeft: "40px" }}
                  />
                  {errors.password && (
                    <AiOutlineExclamationCircle className={styles.dangerIcon} />
                  )}
                </div>
                {errors.password && (
                  <p className={styles.errorMessage}>{errors.password}</p>
                )}
                {errors.input && (
                  <p className={styles.errorMessage}>{errors.input}</p>
                )}
                {errors.server && (
                  <p className={styles.errorMessage}>{errors.server}</p>
                )}
                <Link
                  to="/ForgotPassword" // Link to Reports component
                  className="nav-link fw-semibold text-decoration-none"
                  style={{ color: "#6a6d71" }}
                >
                  Forgot Password?
                </Link>
                <button className={`${styles.loginButton} w-100`} type="submit">
                  Login
                </button>
              </form>
              <button
                className={`${styles.googleButton} w-100 mt-3`}
                type="button"
              >
                <img
                  src={googleLogo}
                  alt="Google logo"
                  style={{ marginRight: "8px", height: "24px" }}
                />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
