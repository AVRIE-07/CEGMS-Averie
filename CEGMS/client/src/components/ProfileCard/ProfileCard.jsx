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
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Track success or error

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");

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

      // Close the modal after success
      setIsPasswordModalVisible(false);

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
        setMessage("User ID not found in localStorage.");
        setMessageType("error");
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

      setMessage(response.data.message);
      setMessageType("success");
      setIsEditing(false);
      setShowModal(false); // Close modal after successful submission
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage(
        error.response?.data?.message || "Failed to update profile. Try again."
      );
      setMessageType("error");
      setShowModal(false); // Close modal on error
    }
  };

  const handleModalClose = () => setShowModal(false);

  const handleSaveChanges = () => setShowModal(true);

  const togglePasswordModal = () => {
    setIsPasswordModalVisible((prevState) => !prevState);
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

        {isEditing ? (
          <>
            <form className="text-start">
              <div className="mb-3">
                <p className="fw-bold mb-1 text-start">First Name</p>
                <input
                  type="text"
                  name="firstname"
                  value={user.firstname}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <p className="fw-bold mb-1 text-start">Last Name</p>
                <input
                  type="text"
                  name="lastname"
                  value={user.lastname}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="form-control"
                />
              </div>
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
              <div className="mb-3">
                <p className="fw-bold mb-1 text-start">Username</p>
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="form-control"
                />
              </div>
              <div className="d-flex justify-content-end buttonGroup">
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
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
                <strong>Username:</strong> {user.username || "Not available"}
              </p>
              <p className="card-text">
                <strong>Email:</strong> {user.email || "Not available"}
              </p>
              <p className="card-text">
                <strong>Role:</strong> {role}
              </p>
            </div>
            <div className="buttonGroup">
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </>
        )}

        {/* Change Password Button */}
        <div className="mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={togglePasswordModal}
          >
            Change Password
          </button>
        </div>

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

      {/* Change Password Modal */}
      {isPasswordModalVisible && (
        <div className="modal show d-block" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={togglePasswordModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Current Password"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm New Password"
                    className="form-control"
                  />
                </div>

                {/* Password Change Error or Success Message */}
                {passwordMessage && (
                  <div
                    className={`alert ${
                      passwordMessageType === "error"
                        ? "alert-danger"
                        : "alert-success"
                    }`}
                  >
                    {passwordMessage}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={togglePasswordModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePasswordSubmit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
