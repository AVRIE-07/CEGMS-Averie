import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./ProfileCard.module.css";
import profileImage from "./ProfileAvatar.png";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

const ProfileCard = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    address: "", // New field for address
    emergencyContactNumber: "", // New field for emergency contact number
    emergencyContactPerson: "", // New field for emergency contact person
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState(""); // To track the action (profile or password update)

  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false); // For profile editing
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");
  const [profileUpdateMessage, setProfileUpdateMessage] = useState("");
  const [profileUpdateMessageType, setProfileUpdateMessageType] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedFirstname = localStorage.getItem("firstname");
    const storedLastname = localStorage.getItem("lastname");
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedAddress = localStorage.getItem("address");
    const storedEmergencyContactNumber = localStorage.getItem(
      "emergencyContactNumber"
    );
    const storedEmergencyContactPerson = localStorage.getItem(
      "emergencyContactPerson"
    );
    const userId = localStorage.getItem("userId");
    const storedPersonalContactNumber = localStorage.getItem(
      "personalContactNumber"
    );

    // Check if the values are available in localStorage, otherwise provide default values
    if (
      storedUsername &&
      storedFirstname &&
      storedLastname &&
      storedEmail &&
      storedPersonalContactNumber
    ) {
      setUser({
        username: storedUsername,
        firstname: storedFirstname,
        lastname: storedLastname,
        email: storedEmail,
        address: storedAddress || "Not available", // Ensure default if not found
        emergencyContactNumber: storedEmergencyContactNumber || "Not available", // Ensure default
        emergencyContactPerson: storedEmergencyContactPerson || "Not available", // Ensure default
        userId: userId,
        personalContactNumber: storedPersonalContactNumber || "Not available",
      });
      setRole(storedRole || "Not specified");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const handlePasswordChange = async () => {
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

      // Trigger modal to show success message
      const successModal = new window.bootstrap.Modal(
        document.getElementById("successModal")
      );
      successModal.show();

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
      console.log(userId); // Add this line to check if the userId is being retrieved correctly
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
      localStorage.setItem("address", updatedUser.address);
      localStorage.setItem(
        "emergencyContactNumber",
        updatedUser.emergencyContactNumber
      );
      localStorage.setItem(
        "emergencyContactPerson",
        updatedUser.emergencyContactPerson
      );

      // Show success message
      setProfileUpdateMessage("Profile updated successfully!");
      setProfileUpdateMessageType("success");

      // Close the edit form
      setIsEditing(false);

      // Trigger modal to show success message
      const successModal = new window.bootstrap.Modal(
        document.getElementById("successModal")
      );
      successModal.show();

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

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
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
              {isEditing && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-6">
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

                    <div className="col-md-6">
                      <p className="fw-bold mb-1 text-start">Address</p>
                      <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p className="fw-bold mb-1 text-start">
                        Personal Contact Number
                      </p>
                      <input
                        type="text"
                        name="personalContactNumber"
                        value={user.personalContactNumber}
                        onChange={handleInputChange}
                        placeholder="Enter personal contact person's name"
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-6">
                      <p className="fw-bold mb-1 text-start">
                        Emergency Contact Person
                      </p>
                      <input
                        type="text"
                        name="emergencyContactPerson"
                        value={user.emergencyContactPerson}
                        onChange={handleInputChange}
                        placeholder="Enter emergency contact person's name"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p className="fw-bold mb-1 text-start">
                        Emergency Contact Number
                      </p>
                      <input
                        type="text"
                        name="emergencyContactNumber"
                        value={user.emergencyContactNumber}
                        onChange={handleInputChange}
                        placeholder="Enter emergency contact number"
                        className="form-control"
                      />
                    </div>
                  </div>
                </>
              )}

              {isForgotPassword && (
                <>
                  <div className="mb-3">
                    <p className="fw-bold mb-1 text-start">Current Password</p>
                    <div className="input-group">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        placeholder="Enter current password"
                        className="form-control"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                      >
                        {showCurrentPassword ? (
                          <BsFillEyeSlashFill />
                        ) : (
                          <BsFillEyeFill />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="fw-bold mb-1 text-start">New Password</p>
                    <div className="input-group">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="Enter new password"
                        className="form-control"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        {showNewPassword ? (
                          <BsFillEyeSlashFill />
                        ) : (
                          <BsFillEyeFill />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="fw-bold mb-1 text-start">
                      Confirm New Password
                    </p>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Confirm new password"
                        className="form-control"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <BsFillEyeSlashFill />
                        ) : (
                          <BsFillEyeFill />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="d-flex justify-content-end buttonGroup">
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={handleSubmit}
                >
                  Save Changes
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
            <div className={styles.buttonGroup}>
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => setIsForgotPassword(true)}
              >
                Change Password
              </button>
            </div>
            {profileUpdateMessage && (
              <div
                className={`alert mt-3 ${
                  profileUpdateMessageType === "success"
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {profileUpdateMessage}
              </div>
            )}
          </>
        )}
        <div
          className="modal fade"
          id="successModal"
          tabIndex="-1"
          aria-labelledby="successModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="successModalLabel">
                  Success
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {profileUpdateMessage || passwordMessage}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
