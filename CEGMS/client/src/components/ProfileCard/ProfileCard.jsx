import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import styles from "./ProfileCard.module.css"; // Import CSS Module styles
import profileImage from "./ProfileAvatar.png";

const ProfileCard = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
  });

  const [role, setRole] = useState("");

  useEffect(() => {
    // Get user data from localStorage
    const storedUsername = localStorage.getItem("username");
    const storedFirstname = localStorage.getItem("firstname");
    const storedLastname = localStorage.getItem("lastname");
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");

    if (
      storedUsername &&
      storedFirstname &&
      storedLastname &&
      storedEmail &&
      storedRole
    ) {
      // Update user state with data from localStorage
      setUser({
        username: storedUsername,
        firstname: storedFirstname,
        lastname: storedLastname,
        email: storedEmail,
      });
      setRole(storedRole);
    }
  }, []); // Empty dependency array means this effect runs once on component mount

  return (
    <section className={`container ${styles.profileCard}`}>
      <div className="d-flex justify-content-center mb-4">
        <img
          src={profileImage}
          alt="Profile"
          className={`rounded-circle ${styles.profileImage}`}
        />
      </div>
      <div className="card-body text-center">
        <h3 className={styles.profileTitle}>
          {user.firstname} {user.lastname}
        </h3>

        <div className={styles.profileInfo}>
          <strong>Username:</strong>
          <p>{user.username || "Not available"}</p>
        </div>
        <div className={styles.profileInfo}>
          <strong>Email:</strong>
          <p>{user.email || "Not available"}</p>
        </div>
        <div className={styles.profileInfo}>
          <strong>Role:</strong>
          <p>{role || "Not specified"}</p>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
