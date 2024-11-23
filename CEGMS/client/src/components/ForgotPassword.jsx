import React, { useState } from "react";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Request code, 2 = Enter code
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle email submission to simulate sending a code
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Simple validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulate sending code
    setSuccessMessage("A verification code has been sent to your email.");
    setStep(2); // Move to the next step (enter code)
  };

  // Handle verification code submission to simulate verification
  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Simple validation for verification code
    if (!verificationCode) {
      setError("Please enter the verification code sent to your email.");
      return;
    }

    // Simulate successful code verification
    setSuccessMessage(
      "Your code has been verified. You may now reset your password."
    );
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm p-4">
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
  );
}
