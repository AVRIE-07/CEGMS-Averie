import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./ProfileCard.module.css";
import profileImage from "./ProfileAvatar.png";

const ProfileCard = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
  });
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // New state for forgot password form
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Track success or error
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");
  const [profileUpdateMessage, setProfileUpdateMessage] = useState("");
  const [profileUpdateMessageType, setProfileUpdateMessageType] = useState("");

  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false); // For toggling the change password modal
  const [passwordChangeConfirmed, setPasswordChangeConfirmed] = useState(false); // For tracking if password change was successful

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedFirstname = localStorage.getItem("firstname");
    const storedLastname = localStorage.getItem("lastname");
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (storedUsername && storedFirstname && storedLastname && storedEmail) {
      setUser({
        username: storedUsername,
        firstname: storedFirstname,
        lastname: storedLastname,
        email: storedEmail,
        userId: userId,
      });
      setRole(storedRole || "Not specified");
    }
  }, []);

  useEffect(() => {
    if (message && messageType === "success") {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000); // Hide message after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [message, messageType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.");
      setPasswordMessageType("error");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setPasswordMessage("User ID not found.");
        setPasswordMessageType("error");
        return;
      }

      const response = await axios.put(
        `http://localhost:3001/api/users/profile/change-password/${userId}`,
        passwordData
      );

      setPasswordMessage(response.data.message);
      setPasswordMessageType("success");
      setPasswordChangeConfirmed(true); // Set the flag to show confirmation
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }); // Clear the password fields after success

      // Optionally, you could auto-close the confirmation after a delay
      setTimeout(() => setPasswordChangeConfirmed(false), 5000); // Hide confirmation after 5 seconds
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordMessage(
        error.response?.data?.message || "Failed to change password. Try again."
      );
      setPasswordMessageType("error");
    }
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setProfileUpdateMessage("User ID not found in localStorage.");
        setProfileUpdateMessageType("error");
        return;
      }

      const response = await axios.put(
        `http://localhost:3001/api/users/profile/update-user/${userId}`,
        user
      );

      // Update state with the latest user data
      const updatedUser = response.data.updatedUser;
      setUser(updatedUser);

      // Save updated user data to localStorage
      localStorage.setItem("username", updatedUser.username);
      localStorage.setItem("firstname", updatedUser.firstname);
      localStorage.setItem("lastname", updatedUser.lastname);
      localStorage.setItem("email", updatedUser.email);
      // Show success message
      setProfileUpdateMessage("Profile updated successfully!");
      setProfileUpdateMessageType("success");

      // Close the edit form
      setIsEditing(false);

      // Optionally, hide the success message after 3 seconds
      setTimeout(() => {
        setProfileUpdateMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating user:", error);
      setProfileUpdateMessage(
        error.response?.data?.message || "Failed to update profile. Try again."
      );
      setProfileUpdateMessageType("error");
    }
  };

  const handleModalClose = () => setShowModal(false);

  const handleSaveChanges = () => {
    setIsEditing(true);
  };

  const togglePasswordModal = () => {
    setIsPasswordModalVisible((prevState) => !prevState);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true); // Show the Forgot Password form
  };

  return (
    <div className={`container mt-5 ${styles.profileCard}`}>
      <div className="row justify-content-center">
        <div className="mb-4">
          <img
            src={profileImage}
            alt="Profile"
            className={`rounded-circle ${styles.profileImage} img-thumbnail`}
          />
        </div>

        {isEditing || isForgotPassword ? (
          <>
            <form className="text-start">
              {/* Only show the Email field when editing profile, not when changing password */}
              {!isForgotPassword && (
                <div className="mb-3">
                  <p className="fw-bold mb-1 text-start">Email</p>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="form-control"
                  />
                </div>
              )}

              {isForgotPassword && (
                <>
                  <div className="mb-3">
                    <p className="fw-bold mb-1 text-start">Current Password</p>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <p className="fw-bold mb-1 text-start">New Password</p>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <p className="fw-bold mb-1 text-start">
                      Confirm New Password
                    </p>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="form-control"
                    />
                  </div>
                </>
              )}

              <div className="d-flex justify-content-end buttonGroup">
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={
                    isForgotPassword ? handlePasswordSubmit : handleSubmit
                  } // Trigger the correct form submission
                >
                  {isForgotPassword ? "Reset Password" : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setIsForgotPassword(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h3 className={`card-title ${styles.profileTitle}`}>
              {user.firstname} {user.lastname}
            </h3>
            <div className={styles.profileInfo}>
              <p className="card-text">
                <strong>Email:</strong> {user.email || "Not available"}
              </p>
              <p className="card-text">
                <strong>Role:</strong> {role}
              </p>
            </div>
            <div className="buttonGroup">
              <button
                className="btn btn-primary me-3"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleForgotPassword} // Trigger the forgot password form
              >
                Forgot Password
              </button>
            </div>
          </>
        )}

        {/* Display success or error message after submitting the form */}
        {profileUpdateMessage && (
          <div
            className={`alert ${
              profileUpdateMessageType === "error"
                ? "alert-danger"
                : "alert-success"
            } mt-3`}
          >
            {profileUpdateMessage}
          </div>
        )}

        {/* Success or Error message */}
        {message && (
          <div
            className={`alert ${
              messageType === "error" ? "alert-danger" : "alert-success"
            } mt-3`}
          >
            {message}
          </div>
        )}

        {/* Password Change Confirmation */}
        {passwordChangeConfirmed && (
          <div className="alert alert-success mt-3">
            Password changed successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
