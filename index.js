import express from "express";
import ProductsRoutes from "./routes/prod.js";
import usersRoutes from "./routes/users.js";
import ordersRoutes from "./routes/orders.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/products", ProductsRoutes);
app.use("/users", usersRoutes);
app.use("/orders", ordersRoutes);

app.get("/", (req, res) => res.send("Hello World!"));

mongoose
  .connect(process.env.CONNETION_URL)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  )
  .catch((error) => console.log(error.message));
