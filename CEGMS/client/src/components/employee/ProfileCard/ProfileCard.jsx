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

  return (
    <div className={`container mt-5 ${styles.profileCard}`}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="mb-4">
                <img
                  src={profileImage}
                  alt="Profile"
                  className={`rounded-circle ${styles.profileImage} img-thumbnail`}
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
              {isEditing ? (
                <>
                  <form>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="firstname"
                        value={user.firstname}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="lastname"
                        value={user.lastname}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                        placeholder="Username"
                        className="form-control"
                      />
                    </div>
                    <div className="d-flex justify-content-center">
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
                  {/* Modal */}
                  {showModal && (
                    <div
                      className="modal fade show"
                      style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                      tabIndex="-1"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Confirm Save</h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={handleModalClose}
                            ></button>
                          </div>
                          <div className="modal-body">
                            <p>Are you sure you want to save these changes?</p>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleModalClose}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleSubmit}
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="card-title">
                    {user.firstname} {user.lastname}
                  </h3>
                  <p className="card-text">
                    <strong>Username:</strong>{" "}
                    {user.username || "Not available"}
                  </p>
                  <p className="card-text">
                    <strong>Email:</strong> {user.email || "Not available"}
                  </p>
                  <p className="card-text">
                    <strong>Role:</strong> {role}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </>
              )}
              {message && (
                <div
                  className={`alert mt-3 ${
                    messageType === "error" ? "alert-danger" : "alert-success"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
