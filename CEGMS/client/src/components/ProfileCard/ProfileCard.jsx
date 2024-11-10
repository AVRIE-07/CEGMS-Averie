import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ProfileCard.module.css";
import personI from "./Personal.png";
import mail from "./mail.png";
import password from "./password.png";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/users/get-user-profile"
        );
        console.log(response.data); // Check response structure
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <section className={styles.profileCard}>
      <div className={styles.cardContainer}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/10bcdc0a1ed7e1012ab2c9bb2303c220023d8be3b027a61d975243a9999a36ef?placeholderIfAbsent=true&apiKey=f158a1f6464b4ffba2f9a1dad0c7135d"
          className={styles.profileImage}
          alt="Profile"
        />
        <div className={styles.infoContainer}>
          <h3>
            {user.firstname} {user.lastname}
          </h3>{" "}
          {/* Display full name */}
          {/* Other sections and links */}
          <div className={styles.blueBox}>
            <div className={styles.boxesContainer}>
              <Link to="/Profile">
                <div
                  className={styles.grayBox}
                  style={{ borderBottom: "4px solid white" }}
                >
                  <img src={personI} className={styles.logo} alt="Personal" />
                  <h5 style={{ marginTop: "10%", fontSize: "15px" }}>
                    Personal
                  </h5>
                </div>
              </Link>
              {/* Other links for Email and Password */}
            </div>
          </div>
          {/* Display User Information */}
          <div className="mb-3 mt-3 p-3" style={{ width: "100%" }}>
            <label htmlFor="firstname" className="form-label fs-6 fw-semibold">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              className="form-control"
              value={user.firstname}
              readOnly
              style={{
                borderBottom: "2px solid #000",
                borderRadius: "0",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
              }}
            />
          </div>
          <div className="mb-3 p-3" style={{ width: "100%" }}>
            <label htmlFor="lastname" className="form-label fs-6 fw-semibold">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              className="form-control"
              value={user.lastname}
              readOnly
              style={{
                borderBottom: "2px solid #000",
                borderRadius: "0",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
              }}
            />
          </div>
        </div>
        <button className={styles.saveButton}>
          <div className={styles.buttonContent}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/207243a4f52d752f9770c8c2bb9ded9b7031b636279717a4fd564616ee451886?placeholderIfAbsent=true&apiKey=f158a1f6464b4ffba2f9a1dad0c7135d"
              className={styles.buttonIcon}
              alt=""
            />
            <span className={styles.buttonText}>Edit</span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default ProfileCard;
