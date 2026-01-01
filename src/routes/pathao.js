const axios = require("axios");
const express = require("express");
const router = express.Router();
const Order = require("../models/order");

async function issueToken() {
  const base_url = process.env.BASE_URL; // or your actual URL
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const username = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;

  try {
    const response = await axios.post(
      `${base_url}/aladdin/api/v1/issue-token`,
      {
        client_id,
        client_secret,
        grant_type: "password",
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Token Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to issue token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

router.post("/pathao/webhook", async (req, res) => {
  // console.log(req.body);
  try {
    if (req.body.event === "order.created") {
      const order = await Order.findOne({
        merchant_order_id: req.body.merchant_order_id,
      });

      order.consignment_id = req.body.consignment_id;
      await order.save();
    } else if (req.body.event === "order.at-the-sorting-hub") {
      const order = await Order.findOne({
        consignment_id: req.body.consignment_id,
      });

      order.order_status = "At Sorting Hub";
      await order.save();
    } else if (req.body.event === "order.in-transit") {
      const order = await Order.findOne({
        consignment_id: req.body.consignment_id,
      });

      order.order_status = "In Transit";
      await order.save();
    } else if (req.body.event === "order.received-at-last-mile-hub") {
      const order = await Order.findOne({
        consignment_id: req.body.consignment_id,
      });
      order.order_status = "At Delivery Hub";
      await order.save();
    } else if (req.body.event === "order.assigned-for-delivery") {
      const order = await Order.findOne({
        consignment_id: req.body.consignment_id,
      });
      order.order_status = "Out for Delivery";
      await order.save();
    } else if (req.body.event === "order.delivered") {
      const order = await Order.findOne({
        consignment_id: req.body.consignment_id,
      });
      order.order_status = "Delivered";
      await order.save();
    } else if (req.body.event === "order.on-hold") {
      const order = await Order.findOne({
        consignment_id: req.body.consignment_id,
      });
      order.order_status = "On Hold";
      await order.save();
    } else if (req.body.event === "order.returned") {
      const order = await Order.findOne({
        consignment_id: req.body.consignment_id,
      });
      order.order_status = "Returned";
      await order.save();
    } else if (req.body.event === "order.paid") {
      const order = await Order.findOne({
        consignment_id: req.body.consignment_id,
      });
      order.payment_status = "Paid";
      await order.save();
    } else if (req.body.event === "order.pickup-cancelled") {
      const order = await Order.findOne({
        consignment_id: req.body.consignment_id,
      });
      order.order_status = "Cancelled";
      await order.save();
    }

    // For the integration test, they only care about:
    // - status 202
    // - this exact header + value
    res.set(
      "X-Pathao-Merchant-Webhook-Integration-Secret",
      "f3992ecc-59da-4cbe-a049-a13da2018d51"
    );

    // Respond within 10s
    return res.status(202).json({ ok: true });
  } catch (error) {
    res.set(
      "X-Pathao-Merchant-Webhook-Integration-Secret",
      "f3992ecc-59da-4cbe-a049-a13da2018d51"
    );

    // Respond within 10s
    return res.status(202).json({ ok: true });
  }
});

router.post("/pathao/order/submit-to-pathao", async (req, res) => {
  const accessToken = process.env.ACCESS_TOKEN;
  axios
    .post(`${process.env.BASE_URL}/aladdin/api/v1/orders`, req.body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(async (response) => {
      console.log("✅ Order submitted to Pathao successfully:");
      return res.status(200).json(response.data);
    })
    .catch(async (error) => {
      console.error("❌ Failed to create order:");
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Error Data:", error.response.data);
      } else {
        console.error(error.message);
      }
      throw error;
    });
});

// router.post("/pathao/update-consignment-status", async (req, res) => {
//   const { consignment_id, order_status, _id } = req.body;
//   try {
//     const updatedOrder = await Order.findOneAndUpdate(
//       { _id: _id },
//       { $set: { order_status: order_status, consignment_id: consignment_id } },
//       { new: true }
//     );
//     return res.status(200).json(updatedOrder);
//   } catch (error) {
//     console.error("❌ Failed to update consignment status:", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to update consignment status" });
//   }
// });

module.exports = router;
