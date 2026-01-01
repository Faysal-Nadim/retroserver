const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const env = require("dotenv");
const cors = require("cors");

const app = express();

env.config();

const orderRoutes = require("./routes/order");
const pathaoRoutes = require("./routes/pathao");
const productRoutes = require("./routes/product");
const shopRoutes = require("./routes/shop");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@retrorevive.llec5na.mongodb.net/?appName=retrorevive`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", orderRoutes);
app.use("/api/v1", pathaoRoutes);
app.use("/api/v1", productRoutes);
app.use(shopRoutes);

// app.listen(5000, () => console.log("Server on 5000"));

module.exports = app;
