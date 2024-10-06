import React, { useState, useEffect } from "react";
import styles from "./UserManagement.module.css";
import axios from "axios"; // Import axios to make API calls
import { Modal, Button, Form, Table } from "react-bootstrap";

function UserManagement() {
  const [showModal, setShowModal] = useState(false); // For Add/Edit User Modal
  const [editMode, setEditMode] = useState(false); // Track if we are editing
  const [currentUserId, setCurrentUserId] = useState(null); // Track the current user being edited
  const [formData, setFormData] = useState({
    role: "Employee",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "", // Added confirm password field
  });
  const [users, setUsers] = useState([]); // State to store users
  const [errorMessage, setErrorMessage] = useState(""); // For form validation errors

  // State for Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleShow = () => {
    setEditMode(false); // Add mode
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

  const handleClose = () => {
    setErrorMessage("");
    setShowModal(false);
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  // Fetch users from the backend when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users/get-users");
      setUsers(response.data); // Set the users in state
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users. Please try again later.");
    }
  };

  // Function to handle form data changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Function to handle saving the user (both Add and Update)
  const handleSaveUser = async (e) => {
    e.preventDefault();

    // Check if passwords match before proceeding
    if (!editMode && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Prepare the payload with correct field names
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
        // Update existing user
        await axios.put(
          `http://localhost:3001/users/update-user/${currentUserId}`,
          payload
        );
      } else {
        // Add new user
        await axios.post("http://localhost:3001/users/add-user", payload);
      }
      // Fetch users again to update the table
      fetchUsers();
      alert("User added successfully.");
      handleClose(); // Close modal after success
    } catch (error) {
      console.error("Error details:", error.response.data); // Log error details for debugging
      const errorMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to save user. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  // Function to handle editing a user
  const handleEditUser = (user) => {
    setEditMode(true); // Set edit mode
    setCurrentUserId(user._id); // Set the ID of the user being edited
    setFormData({
      role: user.role,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      username: user.username,
      password: "", // Set password to empty for editing
      confirmPassword: "",
    });
    setShowModal(true); // Show modal for editing
  };

  // Function to handle showing the delete modal
  const handleShowDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Function to handle deleting a user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:3001/users/delete-user/${userToDelete._id}`
      );
      alert(response.data.message); // Show success message

      // Fetch users again to update the table after deletion
      fetchUsers();
      handleCloseDeleteModal();
    } catch (error) {
      alert("Failed to delete user. Please try again.");
      console.error("Error deleting user:", error);
      handleCloseDeleteModal();
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title} style={{ fontSize: "2vmin" }}>
            Users
          </h1>
        </div>
        <button className={styles.addButton} onClick={handleShow}>
          Add Users
        </button>
      </header>

      {/* User Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEditUser(user)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleShowDeleteModal(user)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Bootstrap Modal for adding/updating a user */}
      <Modal show={showModal} onHide={handleClose}>
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            {editMode ? "Save Changes" : "Add User"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete ? (
            <p>
              Are you sure you want to delete{" "}
              <strong>{userToDelete.username}</strong>?
            </p>
          ) : (
            <p>No user selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default UserManagement;
