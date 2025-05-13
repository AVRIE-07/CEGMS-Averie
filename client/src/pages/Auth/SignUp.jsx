import React, { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./SignUp.module.css";
import { useAuthStore } from "../../store/authStore";
import cokinsLogo from "../../assets/images/cokins_logo.png";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Alert from "@mui/material/Alert";
import { MyContext } from "../../App";
import { TextField } from "@mui/material";

const steps = [
  {
    label: "Enter your details",
  },
  {
    label: "Complete your Emergency Contact Information",
  },
  {
    label: "Set your password",
    description: "Create a secure password for your account.",
  },
];

const SignUp = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    emergency_contact_full_name: "",
    emergency_contact_number: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, isLoading, errorSignup } = useAuthStore();

  const phoneRegex = /^\+639\d{9}$/;
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await handleSignup();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSignup = async () => {
    try {
      await signup({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        emergency_contact_full_name: formData.emergency_contact_full_name,
        emergency_contact_number: formData.emergency_contact_number,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role || "PE",
      });
      navigate("/verify-email");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  // Validation logic for each step
  const validateStep = () => {
    if (activeStep === 0) {
      return !formData.first_name || !formData.last_name || !formData.email;
    } else if (activeStep === 1) {
      return (
        !formData.phone_number ||
        !formData.emergency_contact_full_name ||
        !formData.emergency_contact_number
      );
    } else if (activeStep === 2) {
      return (
        !formData.password || formData.password !== formData.confirmPassword
      );
    }
    return false;
  };

  // Helper to determine if fields are valid
  const isValidPhoneNumber = phoneRegex.test(formData.phone_number);
  // const isValidEmail = emailRegex.test(formData.email);
  const isValidEmergencyPhone = phoneRegex.test(
    formData.emergency_contact_number
  );

  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
  }, [context]);

  return (
    <div
      className={`${styles["container"]} d-flex justify-content-center align-items-center min-vh-100`}
    >
      <div
        className={`row border ${styles["rounded-5"]} p-3 bg-white shadow ${styles["box-area"]}`}
      >
        {/* Left box */}
        <div
          className={`${styles.cokinsBox} ${styles.left_box} col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box`}
        >
          <div className="featured-image mb-3">
            <img
              src={cokinsLogo}
              className="img-fluid"
              style={{ width: "350px" }}
              alt="featured"
            />
          </div>
        </div>

        {/* Right box */}
        <div className={`col-md-6 ${styles["right-box"]}`}>
          <div className="header-text mb-1">
            <h2 className="fw-bold text-center">Sign Up</h2>
            <p className="text-center">Provide the required fields</p>
          </div>
          <Box sx={{ maxWidth: 500 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    {/* Step-specific input fields */}
                    {activeStep === 0 && (
                      <>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="First Name"
                          value={formData.first_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              first_name: e.target.value,
                            })
                          }
                          size="small"
                          variant="filled"
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Last Name"
                          value={formData.last_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              last_name: e.target.value,
                            })
                          }
                          size="small"
                          variant="filled"
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          size="small"
                          variant="filled"
                        />
                      </>
                    )}
                    {activeStep === 1 && (
                      <>
                        <div className="input mb-3">
                          <input
                            type="text"
                            className={`form-control form-control-lg bg-light fs-6 ${
                              isValidPhoneNumber ? "is-valid" : "is-invalid"
                            }`}
                            placeholder="Phone Number"
                            value={formData.phone_number}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone_number: e.target.value,
                              })
                            }
                          />
                          {!isValidPhoneNumber && formData.phone_number && (
                            <div className="invalid-feedback">
                              Phone number must start with +639 and be 13
                              characters long.
                            </div>
                          )}
                        </div>
                        <div className="input mb-3">
                          <input
                            type="text"
                            className="form-control form-control-lg bg-light fs-6"
                            placeholder="Emergency Contact Person Name"
                            value={formData.emergency_contact_full_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                emergency_contact_full_name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="input mb-3">
                          <input
                            type="text"
                            className={`form-control form-control-lg bg-light fs-6 ${
                              isValidEmergencyPhone ? "is-valid" : "is-invalid"
                            }`}
                            placeholder="Emergency Contact Person Number"
                            value={formData.emergency_contact_number}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                emergency_contact_number: e.target.value,
                              })
                            }
                          />
                          {!isValidEmergencyPhone &&
                            formData.emergency_contact_number && (
                              <div className="invalid-feedback">
                                Emergency contact number must start with +639
                                and be 13 characters long.
                              </div>
                            )}
                        </div>
                      </>
                    )}
                    {activeStep === 2 && (
                      <>
                        <div className="input mb-3">
                          <input
                            type="password"
                            className={`form-control form-control-lg bg-light fs-6 ${
                              !formData.password || formData.password.length < 6
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                          />
                          {!formData.password ||
                          formData.password.length < 8 ? (
                            <div className="invalid-feedback">
                              Password must be at least 8 characters long.
                            </div>
                          ) : null}
                        </div>
                        <div className="input mb-3">
                          <input
                            type="password"
                            className={`form-control form-control-lg bg-light fs-6 ${
                              formData.confirmPassword !== formData.password
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                              })
                            }
                          />
                          {formData.confirmPassword !== formData.password &&
                          formData.confirmPassword ? (
                            <div className="invalid-feedback">
                              Passwords do not match.
                            </div>
                          ) : null}
                        </div>
                      </>
                    )}

                    {errorSignup && (
                      <Alert severity="error" className="mb-3">
                        {errorSignup}
                      </Alert>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={validateStep() || isLoading}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                ) : activeStep === steps.length - 1 ? (
                  "Sign Up"
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </Box>
          <div className="header-text mt-4">
            <p className="text-center">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
