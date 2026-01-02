// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    merchant_order_id: {
      type: String,
      required: true,
    },
    consignment_id: {
      type: String,
    },
    recipient_name: {
      type: String,
      required: true,
    },
    recipient_phone: {
      type: String,
      required: true,
    },
    recipient_address: {
      type: String,
      required: true,
    },
    delivery_type: {
      type: Number,
      required: true,
    },
    item_type: {
      type: Number,
      required: true,
    },
    item_quantity: {
      type: Number,
      required: true,
    },
    item_weight: {
      type: Number,
      required: true,
    },
    amount_to_collect: {
      type: Number,
      required: true,
    },

    item_description: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    note: {
      type: String,
    },

    gift_wrap: {
      type: Boolean,
      default: false,
    },

    products: [
      {
        pid: { type: String },
        sku: { type: String },
        variant: { type: String },
        title: { type: String },
        img: { type: String },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],

    order_total: {
      type: Number,
      required: true,
    },

    delivery_charge: {
      type: Number,
      default: 0,
    },

    amount_paid: {
      type: Number,
      required: true,
    },

    trxid: {
      type: String,
    },

    payment_status: {
      type: String,
    },

    order_status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
