import Supplier from "../models/supplier.model.js";
import mongoose from "mongoose";

export const createSupplier = async (req, res) => {
    const supplier = req.body;
  
    try {
      const newSupplier = new Supplier(supplier);
      await newSupplier.save();
      res.status(201).json(newSupplier);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

export const fetchSupplier = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid supplier ID" });
  }

  try {
    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const fetchAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();

    const totalSuppliers = await Supplier.countDocuments();
    res.status(200).json({
      suppliers,
      totalSuppliers,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { person_name, person_number, person_email, company_name, company_email, company_country, company_province, company_city, company_zipCode } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid supplier ID" });
  }

  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id, 
      { 
        person_name, 
        person_number, 
        person_email, 
        company_name, 
        company_email, 
        company_country, 
        company_province, 
        company_city, 
        company_zipCode 
      },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
  }

  try {
      const deletedSupplier = await Supplier.findByIdAndDelete(id);

      if (!deletedSupplier) {
          return res.status(404).json({ message: "Supplier not found" });
      }

      res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

  