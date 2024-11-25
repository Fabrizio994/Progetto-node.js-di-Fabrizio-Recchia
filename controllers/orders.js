import Order from "../models/orders.js";
import { userSchemaModel } from "../models/users.js";
import { Product } from "../models/prod.js";
import mongoose from "mongoose";

export const AddOrder = async (req, res) => {
  const { name, productName, quantity } = req.body;

  try {
    const user = await userSchemaModel.findOne({ name: name });
    if (!user) return res.status(404).send("User not found");

    const product = await Product.findOne({ name: productName });
    if (!product) return res.status(404).send("Product not found");

    const newOrder = new Order({
      user: user._id,
      products: [
        {
          product: product._id,
          quantity: quantity || 1,
        },
      ],
    });

    await newOrder.save();
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("user", "name")
      .populate("products.product", "name");

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, productId, startDate, endDate } = req.query;

    const query = {};
    if (productId) {
      query["products.product"] = productId;
    }
    if (startDate && endDate) {
      query.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(query)
      .populate("user", "name")
      .populate({
        path: "products.product",
        select: "name",
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const CallOrderById = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No order with that id");
  try {
    const order = await Order.findById(_id);

    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const UpdateOrder = async (req, res) => {
  const { id: _id } = req.params;
  const { userName, products } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No order with that id");
  }

  try {
    const user = await userSchemaModel.findOne({ name: userName });
    if (!user) return res.status(404).send("User not found");

    const order = await Order.findById(_id);
    if (!order) return res.status(404).send("Order not found");

    order.user = user._id;
    order.userName = user.name;
    order.products = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findOne({ name: item.productName });
        if (!product) throw new Error(`Product ${item.productName} not found`);
        return {
          product: product._id,
          productName: product.name,
          quantity: item.quantity,
        };
      })
    );

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const DeleteOrder = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No order with that id");

  try {
    await Order.findByIdAndDelete(_id);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
