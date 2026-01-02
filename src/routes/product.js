const Product = require("../models/product");
const express = require("express");
const router = express.Router();

router.post("/product/create", async (req, res) => {
  try {
    const {
      title,
      description,
      pid,
      sku,
      highlights,
      basePrice,
      discountPrice,
      variants,
      category,
      gallery,
      img,
      slug,
    } = req.body;
    const product = new Product({
      title,
      description,
      pid,
      sku,
      highlights,
      basePrice,
      discountPrice,
      variants,
      category,
      gallery,
      img,
      slug,
    });
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Get all products
router.get("/products-get-all", async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/product/get/:slug", async (req, res) => {
  {
    try {
      const { slug } = req.params;
      const product = await Product.findOne({ slug });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
});

router.get("/products/get-featured", async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/products/get-related/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).limit(8);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/products/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { sku: { $regex: query, $options: "i" } },
      ],
    }).limit(20);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
