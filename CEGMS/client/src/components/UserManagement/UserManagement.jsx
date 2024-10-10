import React, { useState, useEffect } from "react";
import styles from "./UserManagement.module.css";
import axios from "axios";
import SearchBar from "./SearchBar";
import UserTable from "./UserTable";
import { Modal, Button, Form } from "react-bootstrap";

function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    role: "Employee",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Fetch users from the backend when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users/get-users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users. Please try again later.");
    }
  };

  const handleShowModal = () => {
    setEditMode(false);
    setFormData({
      role: "Employee",
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setErrorMessage("");
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();

    if (!editMode && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const payload = {
      role: formData.role,
      firstname: formData.firstName.trim(),
      lastname: formData.lastName.trim(),
      email: formData.email.trim(),
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:3001/users/update-user/${currentUserId}`,
          payload
        );
      } else {
        await axios.post("http://localhost:3001/users/add-user", payload);
      }
      fetchUsers();
      setSuccessModalVisible(true); // Show success modal
      handleCloseModal();
    } catch (error) {
      const errorMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to save user. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  const handleEditUser = (user) => {
    setEditMode(true);
    setCurrentUserId(user._id);
    setFormData({
      role: user.role,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      username: user.username,
      password: "",
      confirmPassword: "",
    });
    setShowModal(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>Manage Users of Company</p>
          <SearchBar />
        </div>
        <button className={styles.addButton} onClick={handleShowModal}>
          + Add Users
        </button>
      </header>
      <UserTable users={users} onEditUser={handleEditUser} />

      {/* Bootstrap Modal for adding/updating a user */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit User" : "Add New User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="role" className="mb-3">
              <Form.Label>Select Role</Form.Label>
              <Form.Control
                as="select"
                value={formData.role}
                onChange={handleChange}
              >
                <option>Employee</option>
                <option>Admin</option>
                <option>Proprietor</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="firstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="lastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>

            {!editMode && (
              <>
                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            {editMode ? "Save Changes" : "Add User"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      {successModalVisible && (
        <Modal show={successModalVisible} onHide={closeSuccessModal}>
          <Modal.Header closeButton>
            <Modal.Title>Success!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            User {editMode ? "updated" : "added"} successfully.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeSuccessModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </main>
  );
}

export default UserManagement;
