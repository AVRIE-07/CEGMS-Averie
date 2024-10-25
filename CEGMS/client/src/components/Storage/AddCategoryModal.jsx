import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const AddCategoryModal = ({ show, handleClose, fetchCategories }) => {
  const [categoryName, setCategoryName] = useState("");

  const handleInputChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/category", {
        product_Category: categoryName, // Updated to match your model
      });
      fetchCategories(); // Call fetchCategories to refresh the category list
      handleClose(); // Close the modal
      setCategoryName(""); // Reset the input field
    } catch (error) {
      alert("Could not add category. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="categoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ marginTop: 10 }}>
            Add Category
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCategoryModal;
