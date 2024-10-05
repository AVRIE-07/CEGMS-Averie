import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cokinslogo from "../_images/cokinslogo.png";
import styles from "../_css/login.module.css";
import googleLogo from "../_images/google.png"; // Import the Google logo
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false); // Separate state for username error
  const [passwordError, setPasswordError] = useState(false);
  const [inputError, setInputError] = useState(false);
  const navigate = useNavigate();

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const allowedUsernameChars = /^[a-zA-Z0-9_]+$/; // Update username regex if needed

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!email && !username) {
      setInputError(true);
      hasError = true;
    }

    if (!password) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      setError("Please fill in all required fields.");
      return;
    }

    const loginData = email ? { email, password } : { username, password };

    if (email && !gmailRegex.test(email)) {
      setError("Please enter a valid Gmail address.");
      setEmailError(true);
      return;
    }

    if (username && !allowedUsernameChars.test(username)) {
      setError(
        "Invalid username. Only letters, numbers, and underscores are allowed."
      );
      setUsernameError(true);
      return;
    }

    axios
      .post("http://localhost:3001/login", loginData)
      .then((result) => {
        console.log(result);
        if (result.data === "Success") {
          navigate("/dashboard");
        } else if (result.data === "No Record Existed") {
          setError("Invalid username or email.");
          setEmailError(true);
        } else {
          setError(result.data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("An error occurred. Please try again.");
      });
  };

  const handleUsernameEmailChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setEmail("");
      setUsername("");
    } else if (value.includes("@")) {
      // If '@' is found, treat it as an email
      setEmail(value);
      setUsername("");
      setEmailError(!gmailRegex.test(value)); // Apply email validation
      setUsernameError(false); // Clear username error if any
    } else {
      // Otherwise, treat it as a username
      setUsername(value);
      setEmail("");
      setUsernameError(!allowedUsernameChars.test(value)); // Apply username validation
      setEmailError(false); // Clear email error if any
    }

    setInputError(false); // Clear the general input error
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
                <p className="lead mb-5">Login with username or email</p>
                <form onSubmit={handleSubmit}>
                  <div className={styles.inputContainer}>
                    <FaUser className={styles.icon} />
                    <input
                      type="text"
                      placeholder="Email or Username"
                      className={`form-control mb-3 ${
                        inputError || emailError || usernameError
                          ? styles.errorBorder
                          : ""
                      }`}
                      onChange={handleUsernameEmailChange}
                      value={email || username}
                      style={{ paddingLeft: "40px" }}
                    />
                    {(inputError || emailError || usernameError) && (
                      <AiOutlineExclamationCircle
                        className={styles.dangerIcon}
                      />
                    )}
                  </div>
                  <div className={styles.inputContainer}>
                    <FaLock className={styles.icon} />
                    <input
                      type="password"
                      placeholder="Password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                      }}
                      value={password}
                      className={`form-control mb-3 ${
                        passwordError ? styles.errorBorder : ""
                      }`}
                      style={{ paddingLeft: "40px" }}
                    />
                    {passwordError && (
                      <AiOutlineExclamationCircle
                        className={styles.dangerIcon}
                      />
                    )}
                  </div>
                  {error && <p className={styles.errorMessage}>{error}</p>}
                  <p
                    className="text-end text-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Forgot Password?
                  </p>
                  <button
                    className={`${styles.loginButton} w-100`}
                    type="submit"
                  >
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
    </>
  );
}
