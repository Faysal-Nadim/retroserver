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

const esc = (s = "") =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

router.get("/p/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });
    if (!product) return res.status(404).send("Not found");

    const title = `${product.title} | Retro Revive BD`;
    const desc = (product.description || "").slice(0, 155);

    // Must be absolute public URL
    const image =
      product.img ||
      (Array.isArray(product.gallery) ? product.gallery[0] : "") ||
      "https://retrorevivebd.com/logo.png";

    const realUrl = `https://retrorevivebd.com/product/${slug}`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");

    res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />

  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta property="og:url" content="${esc(realUrl)}" />
  <meta property="og:type" content="product" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${esc(image)}" />

  <meta http-equiv="refresh" content="0; url=${esc(realUrl)}" />
</head>
<body>Redirecting…</body>
</html>`);
  } catch (error) {
    res.status(500).send("Error generating preview");
  }
});

module.exports = router;
