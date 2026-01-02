// routes/label.route.js
const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");
const { sendOrderConfirmationEmail } = require("./email");

router.get("/order/print-label", async (req, res) => {
  const consignment_id = req.query.consignment_id;

  const orderData = await Order.findOne({ consignment_id: consignment_id });
  if (orderData.order_status === "Pending") {
    orderData.order_status = "Sorted";
    await orderData.save();
  }

  const order = {
    merchantLogo:
      "https://aleeha-test.s3.ap-southeast-1.amazonaws.com/label-logo.png",
    merchantName: "Retro Revive",
    outlet: "KA 96/1, Kazibari, Kuril, Dhaka",
    contact: "01319940717, 01877473242",

    shippingType: orderData.delivery_type === 48 ? "Regular" : "Express",

    customerName: orderData.recipient_name,
    phone: orderData.recipient_phone,
    address: orderData.recipient_address,

    weight: orderData.item_weight + " kg",
    merchantOrderId: orderData.merchant_order_id,
    productDescription: orderData.item_description,
    amount: "৳ " + orderData.amount_to_collect,

    tracking: orderData.consignment_id,
    paymentStatus: orderData.amount_to_collect > 0 ? "COD" : "Paid",
  };
  if (!order) return res.status(404).send("Order not found");

  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Shipping Label</title>

<style>
  /* Let printer handle paper size; just remove margins */
  @page {
    margin: 0;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  /* Center the label on whatever page size the driver uses */
  body {
    font-family: "Roboto Mono", monospace;
    display: flex;
    justify-content: center;   /* horizontal center */
    align-items: center;       /* vertical center */
  }

  /* This is your physical label size */
  .label {
    width: 80mm;
    height: 90mm;
    border: 1px solid #000;
    border-radius: 3mm;
    padding: 3mm;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* optional: slight overall shrink if you want extra safety */
    transform: scale(0.9);
    transform-origin: center center;
  }

  .row { display: flex; width: 100%; }
  .between { justify-content: space-between; }
  .divider { border-bottom: 1px solid #000; margin: 1.5mm 0; }

  .flex-row { flex-direction: row; justify-content: space-between; align-items: center; }

  .small  { font-size: 2.8mm; }
  .medium { font-size: 3mm; }
  .shipping-type-box {
  border: 1px solid #000;
  padding: 1mm 3mm;
  font-size: 2.9mm;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 1mm;
}


  .logo-box img { height: 10mm; }

  .from-box     { font-size: 2.6mm; line-height: 1.3; }
  .receiver-left{ width: 60%; font-size: 2.8mm; line-height: 1.3; }

  #qrCode {
    width: 20mm;
    height: 20mm;
  }

  .barcode-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #barcodeMain {
    width: 95%;
    height: 12mm;
  }

  .pay-status-box {
    border: 1px solid #000;
    padding: 1mm 2.5mm;
    font-size: 3mm;
    font-weight: bold;
  }

  .product-section {
    font-size: 2.4mm;
    line-height: 1.2;
  }
</style>

<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
</head>
<body onload="initLabel()">

<div class="label">

  <!-- TOP -->
  <div class="row between">
    <div class="logo-box">
      <img src="${order.merchantLogo}" />
    </div>
    <div class="from-box">
      <strong>Shipped From:</strong> ${order.merchantName}<br/>
      ${order.outlet}<br/>
      ${order.contact}
    </div>
  </div>

  <div class="divider"></div>

  <!-- RECEIVER + QR -->
  

  <div class="row between flex-row">
    <div class="receiver-left">
        <div class="shipping-type-box">${order.shippingType}</div>
        <div>
            <strong>To:</strong><br/>${order.customerName}<br/>
            ${order.phone}<br/>
            <span class="small">${order.address}</span>
        </div>
    </div>
    <div>
        <div id="qrCode"></div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- BARCODE -->
  <div class="barcode-wrapper">
    <svg id="barcodeMain"></svg>
    <div class="small">${order.tracking}</div>
  </div>

  <div class="divider"></div>

  <!-- AMOUNT + STATUS -->
  <div class="row between medium" style="align-items: center;">
    <div>
      <strong>Total -</strong>
      ${order.amount}
    </div>
    <div class="pay-status-box">${order.paymentStatus}</div>
  </div>

  <div class="divider"></div>

  <!-- PRODUCT DETAILS -->
  <div class="product-section">
    <strong>Order ID:</strong> ${order.merchantOrderId}<br/>
    <strong>Product:</strong> ${order.productDescription}<br/>
    <strong>Weight:</strong> ${order.weight}<br/>
  </div>

</div>

<script>
function initLabel() {
  JsBarcode("#barcodeMain", "${order.tracking}", {
    format: "CODE128",
    displayValue: false,
    height: 40,
    margin: 0
  });

  new QRCode(document.getElementById("qrCode"), {
    text: "${order.tracking}",
    width: 75,
    height: 75
  });

  setTimeout(() => window.print(), 300);
}
</script>

</body>
</html>
`);
});

function getYYMMDD() {
  const now = new Date();

  const year = String(now.getFullYear()).slice(2); // last 2 digits
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

router.post("/order/create", async (req, res) => {
  const {
    merchant_order_id,
    recipient_name,
    recipient_phone,
    recipient_address,
    delivery_type,
    item_type,
    item_quantity,
    item_weight,
    item_description,
    products, // [{ sku, quantity, ... }]
    order_total,
    trxid,
    payment_status,
    amount_paid,
    delivery_charge,
    email,
    gift_wrap,
    amount_to_collect,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1) Reduce stock for each ordered sku (variant sku)
    for (const item of products) {
      const { sku, quantity } = item;

      if (sku === "GIFT-WRAP") continue;

      // only decrement if enough stock exists
      const result = await Product.updateOne(
        {
          variants: { $elemMatch: { sku, stock: { $gte: quantity } } },
        },
        {
          $inc: { "variants.$.stock": -quantity },
        },
        { session }
      );

      if (result.modifiedCount === 0) {
        throw new Error(`Not enough stock for SKU: ${sku}`);
      }
    }

    // 2) Create the order
    const newOrder = new Order({
      merchant_order_id: `#${getYYMMDD()}${merchant_order_id}`,
      recipient_name,
      recipient_phone,
      recipient_address,
      delivery_type,
      item_type,
      item_quantity,
      item_weight,
      amount_to_collect,
      item_description,
      products,
      order_total,
      trxid,
      payment_status,
      delivery_charge,
      amount_paid,
      email,
      note: req.body.note || "",
      gift_wrap,
    });

    const savedOrder = await newOrder.save({ session });

    // 3) Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send email AFTER commit (so you don't email a failed order)
    if (email) {
      await sendOrderConfirmationEmail(savedOrder, email);
    }

    return res.status(201).json(savedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      error: "Failed to create order",
      message: error.message,
    });
  }
});

router.post("/order/create/direct", async (req, res) => {
  const {
    merchant_order_id,
    recipient_name,
    recipient_phone,
    recipient_address,
    delivery_type,
    item_type,
    item_quantity,
    item_weight,
    item_description,
    products, // [{ sku, quantity, ... }]
    order_total,
    trxid,
    payment_status,
    amount_paid,
    delivery_charge,
    email,
    gift_wrap,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1) Reduce stock for each ordered sku (variant sku)
    for (const item of products) {
      const { sku, quantity } = item;

      if (sku === "GIFT-WRAP") continue;

      // only decrement if enough stock exists
      const result = await Product.updateOne(
        {
          variants: { $elemMatch: { sku, stock: { $gte: quantity } } },
        },
        {
          $inc: { "variants.$.stock": -quantity },
        },
        { session }
      );

      if (result.modifiedCount === 0) {
        throw new Error(`Not enough stock for SKU: ${sku}`);
      }
    }

    // 2) Create the order
    const newOrder = new Order({
      merchant_order_id: `#${getYYMMDD()}${merchant_order_id}`,
      recipient_name,
      recipient_phone,
      recipient_address,
      delivery_type,
      item_type,
      item_quantity,
      item_weight,
      amount_to_collect: order_total - amount_paid,
      item_description,
      products,
      order_total,
      trxid,
      payment_status,
      delivery_charge,
      amount_paid,
      email,
      note: req.body.note || "",
      gift_wrap,
    });

    const savedOrder = await newOrder.save({ session });

    // 3) Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send email AFTER commit (so you don't email a failed order)
    if (email) {
      await sendOrderConfirmationEmail(savedOrder, email);
    }

    return res.status(201).json(savedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      error: "Failed to create order",
      message: error.message,
    });
  }
});

router.get("/orders/get-all", async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders.slice().reverse());
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

module.exports = router;
