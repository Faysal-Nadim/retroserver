const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    pid: {
      type: Number,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    highlights: [String],
    basePrice: {
      type: Number,
      required: true,
    },

    badge: {
      type: String,
      enum: ["New", "Sale"],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isCustomizable: {
      type: Boolean,
      default: false,
    },

    discountPrice: {
      type: Number,
    },

    variants: [
      {
        name: { type: String, required: true },
        sku: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        img: { type: String },
      },
    ],

    category: {
      type: String,
      required: true,
    },

    gallery: [String],

    img: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
