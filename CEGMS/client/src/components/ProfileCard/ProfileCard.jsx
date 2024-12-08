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
    address: "",
    personalContactNumber: "",
    emergencyContactNumber: "",
    emergencyContactPerson: "",
    userId: "",
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
    const storedAddress = localStorage.getItem("address");
    const storedPersonalContactNumber = localStorage.getItem(
      "emergencyContactPerson"
    );
    const storedEmergencyContactNumber = localStorage.getItem(
      "emergencyContactNumber"
    );
    const storedEmergencyContactPerson = localStorage.getItem(
      "personalContactNumber"
    );
    const userId = localStorage.getItem("userId");

    if (storedUsername && storedFirstname && storedLastname && storedEmail) {
      setUser({
        username: storedUsername,
        firstname: storedFirstname,
        lastname: storedLastname,
        email: storedEmail,
        address: storedAddress,
        personalContactNumber: storedPersonalContactNumber,
        emergencyContactNumber: storedEmergencyContactNumber,
        emergencyContactPerson: storedEmergencyContactPerson,

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
    if (passwordData.newPassword === passwordData.currentPassword) {
      setPasswordMessage(
        "New password cannot be the same as the current password."
      );
      setPasswordMessageType("error");
      return;
    }

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
        setProfileUpdateMessage("User ID not found in localStorage.");
        setProfileUpdateMessageType("error");
        return;
      }

      const response = await axios.put(
        `http://localhost:3001/api/users/profile/update-user/${userId}`,
        user
      );

      const updatedUser = response.data.updatedUser;
      setUser(updatedUser);

      // Save updated attributes to localStorage
      localStorage.setItem("username", updatedUser.username);
      localStorage.setItem("firstname", updatedUser.firstname);
      localStorage.setItem("lastname", updatedUser.lastname);
      localStorage.setItem("email", updatedUser.email);
      localStorage.setItem("address", updatedUser.address || "");
      localStorage.setItem(
        "personalContactNumber",
        updatedUser.personalContactNumber || ""
      );
      localStorage.setItem(
        "emergencyContactPerson",
        updatedUser.emergencyContactPerson || ""
      );
      localStorage.setItem(
        "emergencyContactNumber",
        updatedUser.emergencyContactNumber || ""
      );

      setProfileUpdateMessage("Profile updated successfully!");
      setProfileUpdateMessageType("success");
      setIsEditing(false);

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
    // This just opens the form for editing; it doesn't trigger profile update yet.
    setIsEditing(true);
  };

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
            <form className="text-start p-4 border rounded shadow-sm bg-light">
              <h3 className="mb-4 text-primary">User Information</h3>

              {/* Personal Information Section */}
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstname" className="fw-bold form-label">
                    First Name
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    name="firstname"
                    value={user.firstname}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="lastname" className="fw-bold form-label">
                    Last Name
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    name="lastname"
                    value={user.lastname}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="form-control"
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="email" className="fw-bold form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <h4 className="mb-3 text-secondary">Contact Information</h4>
              <div className="row mb-4">
                <div className="col-md-12 mb-3">
                  <label htmlFor="address" className="fw-bold form-label">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="personalContactNumber"
                    className="fw-bold form-label"
                  >
                    Personal Contact Number
                  </label>
                  <input
                    id="personalContactNumber"
                    type="text"
                    name="personalContactNumber"
                    value={user.personalContactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your personal contact number"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="emergencyContactPerson"
                    className="fw-bold form-label"
                  >
                    Emergency Contact Person
                  </label>
                  <input
                    id="emergencyContactPerson"
                    type="text"
                    name="emergencyContactPerson"
                    value={user.emergencyContactPerson}
                    onChange={handleInputChange}
                    placeholder="Enter emergency contact person"
                    className="form-control"
                  />
                </div>
                <div className="col-md-12">
                  <label
                    htmlFor="emergencyContactNumber"
                    className="fw-bold form-label"
                  >
                    Emergency Contact Number
                  </label>
                  <input
                    id="emergencyContactNumber"
                    type="text"
                    name="emergencyContactNumber"
                    value={user.emergencyContactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter emergency contact number"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-primary me-2 px-4"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary px-4"
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
              <div className={styles.profileText}>
                <strong>Email:</strong> {user.email || "Not available"}
              </div>
              <div className={styles.profileText}>
                <strong>Role:</strong> {role || "Not specified"}
              </div>
              <div className={styles.profileText}>
                <strong>Address:</strong> {user.address || "Not available"}
              </div>
              <div className={styles.profileText}>
                <strong>Personal Contact Number:</strong>{" "}
                {user.personalContactNumber || "Not available"}
              </div>
              <div className={styles.profileText}>
                <strong>Emergency Contact Person:</strong>{" "}
                {user.emergencyContactPerson || "Not available"}
              </div>
              <div className={styles.profileText}>
                <strong>Emergency Contact Number:</strong>{" "}
                {user.emergencyContactNumber || "Not available"}
              </div>
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
                  className="btn btn-primary"
                  onClick={handlePasswordSubmit}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={togglePasswordModal}
                >
                  Close
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
