import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cokinslogo from "../_images/cokinslogo.png";
import styles from "../_css/login.module.css";
import { FaUser } from "react-icons/fa"; // User Icon
import { FaLock } from "react-icons/fa"; // Lock Icon
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs"; // Eye icons from Bootstrap

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const navigate = useNavigate();

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("");
    setEmailError(false);
    setPasswordError(false);

    let hasError = false;

    // Validate email
    if (!email) {
      setEmailError(true);
      setError("Please enter your email.");
      hasError = true;
    } else if (!gmailRegex.test(email)) {
      setEmailError(true);
      setError("Please enter a valid Gmail address.");
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

    const loginData = { email, password };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        loginData
      );

      const { token, username, firstname, email, lastname, role } =
        response.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("firstname", firstname);
      localStorage.setItem("email", email);
      localStorage.setItem("lastname", lastname);
      localStorage.setItem("role", role);

      // Redirect to different dashboards based on the role
      if (role === "Employee") {
        navigate("/employee/dashboard"); // Redirect to employee dashboard
      } else {
        navigate("/dashboard"); // Redirect to general dashboard
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Unauthorized. Please check your credentials.");
      } else {
        setError("Incorrect Email or Password. Please try again.");
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div
          className={`col-8 mx-auto d-flex justify-content-center align-items-center border mt-5 p-4 ${styles.border}`}
        >
          <div className="row">
            <div className="col-6">
              <img src={cokinslogo} alt="" className="w-100 h-100" />
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
                        emailError ? styles.errorBorder : ""
                      }`}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                        setError("");
                      }}
                      value={email}
                      style={{ paddingLeft: "40px" }}
                    />
                    {emailError && (
                      <AiOutlineExclamationCircle
                        className={styles.dangerIcon}
                      />
                    )}
                  </div>

                  {/* Password input with eye icon */}
                  <div className={styles.inputContainer}>
                    {/* Lock Icon in Front */}
                    <FaLock className={`${styles.icon} ${styles.lockIcon}`} />
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"} // Toggle password visibility
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
                          paddingRight: "40px", // Added padding for the eye icon
                        }}
                      />
                      {/* Eye Icon */}
                      <div
                        className="position-absolute"
                        style={{
                          top: "50%",
                          right: "10px", // Adjusted right positioning to make room
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 2, // Ensures eye icon appears in front
                        }}
                        onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                      >
                        {showPassword ? (
                          <BsFillEyeSlashFill />
                        ) : (
                          <BsFillEyeFill />
                        )}{" "}
                        {/* Show appropriate icon */}
                      </div>
                    </div>
                    {passwordError && (
                      <AiOutlineExclamationCircle
                        className={styles.dangerIcon}
                      />
                    )}
                  </div>
                  <div className="text-end mb-3">
                    <a href="/ForgotPassword" className="text-primary">
                      Forgot Password?
                    </a>
                  </div>
                  {error && <p className={styles.errorMessage}>{error}</p>}
                  <button
                    className={`${styles.loginButton} w-100`}
                    type="submit"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
