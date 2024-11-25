import React, { useState, useEffect } from "react";
import { MdMoreVert, MdArrowBack } from "react-icons/md";
import styles from "./UserManagement.module.css";
import axios from "axios"; // Ensure axios is installed

function UserTable() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [users, setUsers] = useState([]);

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

  const handleActionClick = (event, user) => {
    event.stopPropagation();
    setMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });
    setMenuVisible(true);
    setUserToEdit(user);
  };

  const handleEdit = () => {
    setMenuVisible(false);
    setModalVisible(true);
    setCurrentAction("edit");
  };

  const handleDelete = () => {
    setMenuVisible(false);
    setModalVisible(true);
    setCurrentAction("delete");
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/users/delete-user/${userToEdit._id}`
      );
      setSuccessModalVisible(true); // Show success modal
      setTimeout(() => {
        setSuccessModalVisible(false); // Auto-close after 3 seconds
      }, 1000);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again later.");
    } finally {
      setModalVisible(false);
    }
  };

  const handleEditConfirm = async () => {
    try {
      const updatedUser = {
        firstname: userToEdit.firstname,
        lastname: userToEdit.lastname,
        email: userToEdit.email,
        username: userToEdit.username,
        role: userToEdit.role,
      };

      await axios.put(
        `http://localhost:3001/users/update-user/${userToEdit._id}`,
        updatedUser
      );
      setSuccessModalVisible(true); // Show success modal
      setTimeout(() => {
        setSuccessModalVisible(false); // Auto-close after 3 seconds
      }, 1000);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error editing user:", error);
      alert("Failed to update user. Please try again later.");
    } finally {
      setModalVisible(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  return (
    <section onClick={closeMenu}>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Actions</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email ID</th>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} onClick={() => closeMenu()}>
              <td>
                <button
                  className={styles.editButton}
                  onClick={(e) => handleActionClick(e, user)}
                >
                  <MdMoreVert />
                </button>
                {menuVisible && userToEdit?._id === user._id && (
                  <div
                    className={styles.actionMenu}
                    style={{
                      position: "absolute",
                      top: menuPosition.top,
                      left: menuPosition.left,
                      zIndex: 1000,
                    }}
                  >
                    <div onClick={handleEdit}>Edit</div>
                    <div onClick={handleDelete}>Delete</div>
                  </div>
                )}
              </td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Modal */}
      {modalVisible && currentAction === "delete" && (
        <div className={styles.modalOverlay}>
          <div className={styles.editModal}>
            <button className={styles.backButton} onClick={handleCloseModal}>
              <MdArrowBack />
            </button>
            <h2 className={styles.modalTitle1}>Delete User</h2>
            <p className={styles.modalSubtitle}>
              Are you sure you want to delete this user?
            </p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.submitButton1}
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalVisible && currentAction === "edit" && (
        <div className={styles.modalOverlay}>
          <div className={styles.editModal}>
            <button className={styles.backButton} onClick={handleCloseModal}>
              <MdArrowBack />
            </button>
            <h2 className={styles.modalTitle1}>Edit User</h2>
            <form
              className={styles.editForm}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className={styles.inputGroup}>
                <div>
                  <label>
                    First Name
                    <input
                      type="text"
                      value={userToEdit?.firstname}
                      placeholder="First Name"
                      className={styles.inputField}
                      onChange={(e) =>
                        setUserToEdit({
                          ...userToEdit,
                          firstname: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Last Name
                    <input
                      type="text"
                      value={userToEdit?.lastname}
                      placeholder="Last Name"
                      className={styles.inputField}
                      onChange={(e) =>
                        setUserToEdit({
                          ...userToEdit,
                          lastname: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <div>
                  <label>
                    Email ID
                    <input
                      type="text"
                      value={userToEdit?.email}
                      placeholder="Email ID"
                      className={styles.inputField}
                      onChange={(e) =>
                        setUserToEdit({ ...userToEdit, email: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Username
                    <input
                      type="text"
                      value={userToEdit?.username}
                      placeholder="Username"
                      className={styles.inputField}
                      onChange={(e) =>
                        setUserToEdit({
                          ...userToEdit,
                          username: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Role
                    <select
                      value={userToEdit?.role}
                      className={styles.inputField}
                      onChange={(e) =>
                        setUserToEdit({ ...userToEdit, role: e.target.value })
                      }
                    >
                      <option value="Management">Management</option>
                      <option value="Development">Development</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.submitButton}
                  onClick={handleEditConfirm}
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.successModal}>
            <h2 className={styles.successTitle}>Success!</h2>
            <p className={styles.successMessage}>
              {currentAction === "delete"
                ? "User deleted successfully."
                : "User updated successfully."}
            </p>
            <button className={styles.closeButton} onClick={closeSuccessModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default UserTable;
