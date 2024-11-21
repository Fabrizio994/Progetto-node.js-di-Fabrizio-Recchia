import { Product } from "../models/prod.js";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();

    res.status(200).json(allProducts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const AddProduct = async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const CallProductById = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No product with that id");
  try {
    const product = await Product.findById(_id);

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const DeleteProduct = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No product with that id");

  try {
    await Product.findByIdAndDelete(_id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const UpdateProduct = async (req, res) => {
  const { id: _id } = req.params;
  const data = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No product with that id");

  try {
    const product = await Product.findByIdAndUpdate(_id, data, {
      new: true,
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
