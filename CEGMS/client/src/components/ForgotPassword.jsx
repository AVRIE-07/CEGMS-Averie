import React, { useState } from "react";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import cokinslogo from "../_images/cokinslogo.png";
import styles from "../_css/login.module.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Request code, 2 = Enter code
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/forgot-password", // Adjust the URL to your backend
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(
          data.message || "A password reset link has been sent to your email."
        );
        setStep(2); // Move to the code verification step
      } else {
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("Failed to send the reset link. Please try again later.");
    }
  };

  // Handle verification code submission
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!verificationCode) {
      setError("Please enter the verification code sent to your email.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/reset-password", // Adjust the URL to your backend
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resetToken: verificationCode,
            newPassword: "newPassword123", // Update with a real password form
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(
          data.message || "Password reset successful. You can now log in."
        );
      } else {
        setError(data.message || "Invalid or expired verification code.");
      }
    } catch (err) {
      setError("Failed to verify code. Please try again later.");
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
            <h2 className="text-center mb-4">
              {step === 1 ? "Forgot Password" : "Verify Code"}
            </h2>
            {step === 1 ? (
              <>
                <p className="text-center text-muted mb-4">
                  Enter your email to receive a verification code.
                </p>
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-3 position-relative">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        id="email"
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {error && (
                        <AiOutlineExclamationCircle className="position-absolute top-50 end-0 translate-middle-y pe-3 text-danger" />
                      )}
                    </div>
                    {error && <div className="invalid-feedback">{error}</div>}
                    {successMessage && (
                      <div className="text-success mt-2">{successMessage}</div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Send Code
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-center text-muted mb-4">
                  Enter the code sent to your email.
                </p>
                <form onSubmit={handleCodeSubmit}>
                  <div className="mb-3 position-relative">
                    <label htmlFor="verificationCode" className="form-label">
                      Verification Code
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaKey />
                      </span>
                      <input
                        type="text"
                        id="verificationCode"
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                      {error && (
                        <AiOutlineExclamationCircle className="position-absolute top-50 end-0 translate-middle-y pe-3 text-danger" />
                      )}
                    </div>
                    {error && <div className="invalid-feedback">{error}</div>}
                    {successMessage && (
                      <div className="text-success mt-2">{successMessage}</div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Verify Code
                  </button>
                </form>
              </>
            )}
            <div className="text-center mt-3">
              <Link to="/" className="text-secondary">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
