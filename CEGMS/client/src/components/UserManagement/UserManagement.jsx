import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Table,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update filtered users whenever searchTerm or users list changes
  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users/get-users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users. Please try again later.");
    }
  };

  // Filter users based on the search term
  const filterUsers = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(lowercasedSearchTerm) ||
        user.lastname.toLowerCase().includes(lowercasedSearchTerm) ||
        user.email.toLowerCase().includes(lowercasedSearchTerm) ||
        user.username.toLowerCase().includes(lowercasedSearchTerm) ||
        user.role.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredUsers(filtered);
  };

  // Handle opening the modal for adding a new user
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

  // Handle closing the modal
  const handleCloseModal = () => {
    setErrorMessage("");
    setShowModal(false);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Save new or updated user
  const handleSaveUser = async (e) => {
    e.preventDefault();

    // Validate passwords if not in edit mode
    if (!editMode && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Create payload for the API request
    const payload = {
      role: formData.role,
      firstname: formData.firstName.trim(),
      lastname: formData.lastName.trim(),
      email: formData.email.trim(),
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    try {
      let response;
      if (editMode) {
        // Update user if in edit mode
        response = await axios.put(
          `http://localhost:3001/users/update-user/${currentUserId}`,
          payload
        );
      } else {
        // Add new user if not in edit mode
        response = await axios.post(
          "http://localhost:3001/users/add-user",
          payload
        );
      }
      fetchUsers(); // Refresh users list
      setSuccessModalVisible(true); // Show success modal
      handleCloseModal(); // Close form modal
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to save user. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  // Handle editing an existing user
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

  // Handle showing the delete confirmation modal
  const showDeleteModal = (userId) => {
    setUserToDelete(userId);
    setDeleteModalVisible(true);
  };

  // Handle deleting a user
  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/users/delete-user/${userToDelete}`
      );
      fetchUsers(); // Refresh users list
      setDeleteModalVisible(false); // Close delete modal
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again later.");
    }
  };

  // Handle closing the delete modal
  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

  // Handle closing the success modal
  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">User Management</h1>
          <p className="text-muted">Manage users of the company</p>
        </div>
        <Button variant="primary" onClick={handleShowModal}>
          + Add User
        </Button>
      </div>

      {/* Search bar */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Users table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Role</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.role}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => showDeleteModal(user._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete confirmation modal */}
      <Modal show={deleteModalVisible} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success modal */}
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

      {/* Add/Edit User Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveUser}>
            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={formData.role}
                onChange={handleChange}
              >
                <option>Admin</option>
                <option>Employee</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>
            {!editMode && (
              <>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserManagement;
