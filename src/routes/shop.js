const Product = require("../models/product");
const express = require("express");
const router = express.Router();

const esc = (s = "") =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

// bots that need OG HTML
const isCrawler = (ua = "") => {
  ua = ua.toLowerCase();
  return (
    ua.includes("facebookexternalhit") ||
    ua.includes("facebot") ||
    ua.includes("twitterbot") ||
    ua.includes("whatsapp") ||
    ua.includes("telegrambot") ||
    ua.includes("slackbot") ||
    ua.includes("linkedinbot") ||
    ua.includes("pinterest") ||
    ua.includes("discordbot") ||
    ua.includes("googlebot") // optional
  );
};

router.get("/p/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });
    if (!product) return res.status(404).send("Not found");

    const title = `${product.title} | Retro Revive BD`;

    // if description has HTML, you should strip tags; for now keep simple:
    const desc = String(product.description || "")
      .replace(/<[^>]*>/g, "")
      .slice(0, 155);

    // MUST be absolute + public
    const image = String(product.img || "").startsWith("http")
      ? product.img
      : `https://server.retrorevivebd.com${product.img || ""}`;

    const realUrl = `https://retrorevivebd.com/product/${slug}`;
    const shareUrl = `https://shop.retrorevivebd.com/p/${slug}`;

    const ua = req.headers["user-agent"] || "";

    // ✅ humans: redirect fast
    if (!isCrawler(ua)) {
      return res.redirect(302, realUrl);
    }

    // ✅ bots: return OG HTML (no redirect)
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
  <meta property="og:image:secure_url" content="${esc(image)}" />
  <meta property="og:url" content="${esc(shareUrl)}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Retro Revive BD" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${esc(image)}" />
</head>
<body>Loading...</body>
</html>`);
  } catch (error) {
    res.status(500).send("Error generating preview");
  }
});

module.exports = router;
