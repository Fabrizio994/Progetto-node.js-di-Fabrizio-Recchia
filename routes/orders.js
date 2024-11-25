import express from "express";
import {
  AddOrder,
  getAllOrders,
  CallOrderById,
  DeleteOrder,
  UpdateOrder,
} from "../controllers/orders.js";

const router = express.Router();

router.post("/", AddOrder);
router.get("/", getAllOrders);
router.get("/:id", CallOrderById);
router.delete("/:id", DeleteOrder);
router.patch("/:id", UpdateOrder);
export default router;
