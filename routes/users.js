import express from "express";
import {
  getAllUsers,
  AddUser,
  CallUserById,
  DeleteUser,
  UpdateUser,
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", AddUser);
router.get("/:id", CallUserById);
router.delete("/:id", DeleteUser);
router.patch("/:id", UpdateUser);

export default router;
