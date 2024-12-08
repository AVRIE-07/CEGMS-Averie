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
    address: "", // New field for address
    emergencyContactNumber: "", // New field for emergency contact number
    emergencyContactPerson: "", // New field for emergency contact person
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

              <div className="mb-3">
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

              <div className="mb-3">
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

              <div className="mb-3">
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
              <p className="card-text">
                <strong>Email:</strong> {user.email || "Not available"}
              </p>

              <p className="card-text">
                <strong>Role:</strong> {role || "Not specified"}
              </p>
              <p className="card-text">
                <strong>Address:</strong> {user.address || "Not available"}
              </p>
              <p className="card-text">
                <strong>Personal Contact Number:</strong>{" "}
                {user.personalContactNumber || "Not available"}
              </p>
              <p className="card-text">
                <strong>Emergency Contact Person:</strong>{" "}
                {user.emergencyContactPerson || "Not available"}
              </p>
              <p className="card-text">
                <strong>Emergency Contact Number:</strong>{" "}
                {user.emergencyContactNumber || "Not available"}
              </p>
            </div>
            <div className="buttonGroup">
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
      </div>
    </div>
  );
};

export default ProfileCard;
