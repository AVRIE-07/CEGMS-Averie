import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import cokinsLogo from "../../assets/images/cokins_logo.png";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import Alert from "@mui/material/Alert";
import { MyContext } from "../../App";
import { Button, TextField } from "@mui/material";

const EmailVerification = () => {
  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
  }, [context]);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { error, isLoading, verifyEmail } = useAuthStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Restrict input to numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const verificationCode = code.join("");
      try {
        await verifyEmail(verificationCode);
        setIsSubmitted(true);
        setIsVerified(true);
        toast.success("Email verified successfully");
      } catch (error) {
        console.error(error);
      }
    },
    [code, verifyEmail]
  );

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
          <div className="header-text mb-4">
            <h2 className="fw-bold text-center">Verify Your Email</h2>
            <p className="text-center">
              Enter the 6-digit code sent to your email address.
            </p>
          </div>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              {/* Code Inputs */}
              <div className="input mb-3">
                <div className="d-flex justify-content-between gap-2">
                  {code.map((digit, index) => (
                    <TextField
                      key={index}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
                      variant="outlined"
                      className="text-center"
                      style={{ width: "50px", height: "50px" }}
                    />
                  ))}
                </div>
                {error && (
                  <Alert severity="error" className="mt-3">
                    {error}
                  </Alert>
                )}
              </div>

              {/* Submit Button */}
              <Button
                fullWidth
                type="submit"
                disabled={isLoading}
                variant="contained"
                size="large"
                className="mt-3"
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>
          ) : isVerified ? (
            <div className="text-center">
              <p className="text-muted mb-6">
                Your email is verified! Please wait for admin approval before
                you can log in.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted mb-6">
                If the code is correct, your email will be verified shortly.
              </p>
            </div>
          )}

          <div className="header-text mb-2">
            <Link to="/login">
              <p className="text-center">
                <i className="bi bi-arrow-left me-2"></i>Back to Login
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
