import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
    password: "",
    confirmPassword: "",
    address: "", // New field
    personalContact: "", // New field
    emergencyContactPerson: "", // New field
    emergencyContactNumber: "", // New field
  });
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteSuccessModalVisible, setDeleteSuccessModalVisible] =
    useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of users per page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => paginate(i)}>
            {i}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page on search/filter
  }, [filteredUsers]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/get-users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users. Please try again later.");
    }
  };

  const filterUsers = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(lowercasedSearchTerm) ||
        user.lastname.toLowerCase().includes(lowercasedSearchTerm) ||
        user.email.toLowerCase().includes(lowercasedSearchTerm) ||
        user.role.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredUsers(filtered);
  };

  const handleShowModal = () => {
    setEditMode(false);
    setFormData({
      role: "Employee",
      firstName: "",
      lastName: "",
      email: "",
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
      password: formData.password.trim(),
      address: formData.address.trim(),
      personalContactNumber: formData.personalContact.trim(),
      emergencyContactPerson: formData.emergencyContactPerson.trim(),
      emergencyContactNumber: formData.emergencyContactNumber.trim(),
    };

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:3001/api/users/update-user/${currentUserId}`,
          payload
        );
      } else {
        await axios.post("http://localhost:3001/api/users/add-user", payload);
      }
      fetchUsers();
      setSuccessModalVisible(true);
      handleCloseModal();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to save user. Please try again.";
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
      password: "",
      confirmPassword: "",
    });
    setShowModal(true);
  };

  const showDeleteModal = (userId) => {
    setUserToDelete(userId);
    setDeleteModalVisible(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/api/users/delete-user/${userToDelete}`
      );
      fetchUsers();
      setDeleteModalVisible(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again later.");
    }
    setDeleteModalVisible(false);
    setDeleteSuccessModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

  const closeDeleteSuccessModal = () => {
    setDeleteSuccessModalVisible(false);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.role}</td>
              <td>
                {user.firstname} {user.lastname}
              </td>
              <td>{user.email}</td>
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

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {renderPageNumbers()}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Delete Confirmation Modal */}
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

      {/* Success Confirmation Modal After Deleting */}
      <Modal
        show={deleteSuccessModalVisible}
        onHide={closeDeleteSuccessModal}
        centered
      >
        <Modal.Header>
          <Modal.Title className="text-success">
            <i className="bi bi-check-circle-fill me-2"></i> Success!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>User deleted successfully.</p>
          <div style={{ fontSize: "2em", color: "#28a745" }}>
            <i className="bi bi-check-circle-fill"></i>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="success" onClick={closeDeleteSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={successModalVisible} onHide={closeSuccessModal} centered>
        <Modal.Header>
          <Modal.Title className="text-success">
            <i className="bi bi-check-circle-fill me-2"></i> Success!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>User {editMode ? "updated" : "added"} successfully.</p>
          <div style={{ fontSize: "2em", color: "#28a745" }}>
            <i className="bi bi-check-circle-fill"></i>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="success" onClick={closeSuccessModal}>
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
                placeholder="Enter last name"
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
            {!editMode && (
              <>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <div
                      className="position-absolute"
                      style={{
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <div
                      className="position-absolute"
                      style={{
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </Form.Group>
                <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="personalContact">
                  <Form.Label>Personal Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.personalContact}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="emergencyContactPerson">
                  <Form.Label>Emergency Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.emergencyContactPerson}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="emergencyContactNumber">
                  <Form.Label>Emergency Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.emergencyContactNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </>
            )}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <Button
              variant="primary"
              type="submit"
              style={{ marginTop: "10px" }} // Add your desired padding-top value here
            >
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserManagement;
