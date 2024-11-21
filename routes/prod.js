import express from "express";
import {
  getAllProducts,
  AddProduct,
  CallProductById,
  DeleteProduct,
  UpdateProduct,
} from "../controllers/prod.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", AddProduct);
router.get("/:id", CallProductById);
router.delete("/:id", DeleteProduct);
router.patch("/:id", UpdateProduct);

export default router;
