const transporter = require("../utils/email");

async function sendOrderConfirmationEmail(order, email) {
  try {
    await transporter.sendMail({
      from: `Retro Revive <${process.env.EMAIL}>`,
      to: email,
      subject: `Order Confirmed ${order.merchant_order_id} - Retro Revive`,
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Order Confirmed - Retro Revive</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f6f2ea;
      font-family: Arial, Helvetica, sans-serif;
      color: #121826;
    "
  >
    <!-- Wrapper -->
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background: #f6f2ea; padding: 28px 12px"
    >
      <tr>
        <td align="center">
          <!-- Container -->
          <table
            width="680"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 680px;
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
            "
          >
            <!-- Logo -->
            <tr>
              <td align="left" style="padding: 0 6px 14px">
                <img
                  src="https://aleeha-test.s3.ap-southeast-1.amazonaws.com/rr-2.png"
                  alt="Retro Revive"
                  height="38"
                  style="
                    display: block;
                    height: 38px;
                    width: auto;
                    border: none;
                    border-radius: 8px;
                  "
                />
              </td>
            </tr>

            <!-- Main Card -->
            <tr>
              <td
                style="
                  background: #ffffff;
                  border: 1px solid #eadfd2;
                  border-radius: 16px;
                  overflow: hidden;
                "
              >
                <!-- Top stripe -->
                <div style="height: 6px; background: #ef5b3f"></div>

                <!-- Header -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 22px 22px 8px">
                      <div
                        style="
                          font-size: 12px;
                          color: #6b7280;
                          letter-spacing: 0.12em;
                          font-weight: 700;
                        "
                      >
                        ORDER CONFIRMATION
                      </div>

                      <!-- Pixel-ish title vibe (safe fonts) -->
                      <div
                        style="
                          margin-top: 10px;
                          font-size: 22px;
                          font-weight: 900;
                          letter-spacing: 0.02em;
                        "
                      >
                        Revive Your Favorite
                        <span style="color: #ef5b3f">Retro Memories</span>
                      </div>

                      <div
                        style="
                          margin-top: 10px;
                          font-size: 13px;
                          color: #374151;
                          line-height: 1.6;
                        "
                      >
                        Hey <b>${
                          order.recipient_name
                        }</b> — your order is confirmed
                        and queued for dispatch. Keep this email for your
                        records.
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Order Meta -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0 18px 18px">
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                          border: 1px solid #eadfd2;
                          border-radius: 14px;
                          background: #fbf7f1;
                        "
                      >
                        <tr>
                          <td style="padding: 14px">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td
                                  style="
                                    font-size: 12px;
                                    color: #6b7280;
                                    padding-bottom: 4px;
                                  "
                                >
                                  Order ID
                                </td>
                                <td
                                  align="right"
                                  style="
                                    font-size: 12px;
                                    color: #6b7280;
                                    padding-bottom: 4px;
                                  "
                                >
                                  Order Status
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    font-size: 14px;
                                    font-weight: 900;
                                    color: #111827;
                                  "
                                >
                                  ${order.merchant_order_id}
                                </td>
                                <td
                                  align="right"
                                  style="
                                    font-size: 14px;
                                    font-weight: 900;
                                    color: #111827;
                                  "
                                >
                                  ${order.order_status}
                                </td>
                              </tr>

                              <tr>
                                <td colspan="2" style="height: 10px"></td>
                              </tr>

                              <tr>
                                <td
                                  style="
                                    font-size: 12px;
                                    color: #6b7280;
                                    padding-bottom: 4px;
                                  "
                                >
                                  Payment Status
                                </td>
                                <td
                                  align="right"
                                  style="
                                    font-size: 12px;
                                    color: #6b7280;
                                    padding-bottom: 4px;
                                  "
                                >
                                  Consignment ID
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    font-size: 14px;
                                    font-weight: 900;
                                    color: #111827;
                                  "
                                >
                                 ${order.payment_status}
                                </td>
                                <td
                                  align="right"
                                  style="
                                    font-size: 14px;
                                    font-weight: 900;
                                    color: #111827;
                                  "
                                >
                                  ${order.consignment_id || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td colspan="2" style="height: 10px"></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Delivery -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0 18px 18px">
                      <div
                        style="
                          font-weight: 900;
                          font-size: 14px;
                          margin-bottom: 10px;
                        "
                      >
                        Delivery Details
                      </div>

                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        style="border: 1px solid #eadfd2; border-radius: 14px"
                      >
                        <tr>
                          <td
                            style="
                              padding: 14px;
                              font-size: 13px;
                              color: #374151;
                              line-height: 1.7;
                            "
                          >
                            <div><b>Name:</b> ${order.recipient_name}</div>
                            <div><b>Phone:</b> ${order.recipient_phone}</div>
                            <div>
                              <b>Address:</b> ${order.recipient_address}
                            </div>

                            <div
                              style="
                                margin-top: 10px;
                                font-size: 12px;
                                color: #6b7280;
                              "
                            >
                              Delivery Type:
                              <b style="color: #111827">${
                                order.delivery_type === 12
                                  ? "Express"
                                  : "Regular"
                              }</b>
                              &nbsp;•&nbsp; Item Type:
                              <b style="color: #111827">Parcel</b>
                              &nbsp;•&nbsp; Weight:
                              <b style="color: #111827">${
                                order.item_weight
                              }kg</b>
                              &nbsp;•&nbsp; Qty:
                              <b style="color: #111827">${
                                order.products.length
                              }</b>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Items -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0 18px 8px">
                      <div style="font-weight: 900; font-size: 14px">Items</div>
                    </td>
                  </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0 18px 18px">
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                          border: 1px solid #eadfd2;
                          border-radius: 14px;
                          overflow: hidden;
                        "
                      >
                        <tr style="background: #fbf7f1">
                          <td
                            style="
                              padding: 12px;
                              font-size: 12px;
                              color: #6b7280;
                              font-weight: 800;
                              width: 70%;
                            "
                          >
                            Product
                          </td>
                          <td
                            align="center"
                            style="
                              padding: 12px;
                              font-size: 12px;
                              color: #6b7280;
                              font-weight: 800;
                              width: 10%;
                            "
                          >
                            Qty
                          </td>
                          <td
                            align="right"
                            style="
                              padding: 12px;
                              font-size: 12px;
                              color: #6b7280;
                              font-weight: 800;
                              width: 20%;
                            "
                          >
                            Price
                          </td>
                        </tr>

                        ${order.products.map(
                          (product) => `<tr>
                          <td
                            style="padding: 12px; border-top: 1px solid #eadfd2"
                          >
                            <div>
                              <img
                                src="${product.img}"
                                alt="${product.title}"
                                width="48"
                                height="48"
                                style="
                                  display: block;
                                  width: 48px;
                                  height: 48px;
                                  border: none;
                                  border-radius: 8px;
                                  float: left;
                                  margin-right: 12px;
                                "
                              />
                            </div>
                            <div>
                              <div
                                style="
                                  font-size: 12px;
                                  font-weight: 900;
                                  color: #111827;
                                "
                              >
                                ${product.title}
                              </div>
                              <div
                                style="
                                  font-size: 9px;
                                  color: #6b7280;
                                  margin-top: 3px;
                                "
                              >
                                SKU: ${product.sku} (${
                            product.variant || "N/A"
                          })
                              </div>
                            </div>
                          </td>
                          <td
                            align="center"
                            style="
                              padding: 12px;
                              border-top: 1px solid #eadfd2;
                              font-size: 13px;
                              color: #111827;
                            "
                          >
                            ${product.quantity}
                          </td>
                          <td
                            align="right"
                            style="
                              padding: 12px;
                              border-top: 1px solid #eadfd2;
                              font-size: 13px;
                              color: #111827;
                              font-weight: 900;
                            "
                          >
                            ৳${product.price * product.quantity}
                          </td>
                        </tr>`
                        )}
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Summary -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0 18px 22px">
                      <div
                        style="
                          font-weight: 900;
                          font-size: 14px;
                          margin-bottom: 10px;
                        "
                      >
                        Payment Summary
                      </div>

                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                          border: 1px solid #eadfd2;
                          border-radius: 14px;
                          background: #fbf7f1;
                        "
                      >
                        <tr>
                          <td style="padding: 14px">
                            <table
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              style="font-size: 13px; color: #374151"
                            >
                              <tr>
                                <td style="padding: 6px 0">Order Total</td>
                                <td
                                  align="right"
                                  style="
                                    padding: 6px 0;
                                    font-weight: 900;
                                    color: #111827;
                                  "
                                >
                                  ৳${order.products.reduce(
                                    (total, product) =>
                                      total + product.price * product.quantity,
                                    0
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 6px 0">Delivery Charge</td>
                                <td
                                  align="right"
                                  style="
                                    padding: 6px 0;
                                    font-weight: 900;
                                    color: #111827;
                                  "
                                >
                                  ৳${order.delivery_charge}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 6px 0">Amount Paid</td>
                                <td
                                  align="right"
                                  style="
                                    padding: 6px 0;
                                    font-weight: 900;
                                    color: #111827;
                                  "
                                >
                                  ৳${order.amount_paid}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 6px 0">
                                  Amount to Collect (COD)
                                </td>
                                <td
                                  align="right"
                                  style="
                                    padding: 6px 0;
                                    font-weight: 900;
                                    color: #111827;
                                  "
                                >
                                  ৳${order.amount_to_collect}
                                </td>
                              </tr>
                            </table>

                            <!-- CTA -->
                            <div style="margin-top: 12px">
                              <a
                                href="${order?.order_url || "#"}"
                                style="
                                  display: inline-block;
                                  background: #ef5b3f;
                                  color: #ffffff;
                                  text-decoration: none;
                                  font-weight: 900;
                                  font-size: 13px;
                                  padding: 11px 16px;
                                  border-radius: 12px;
                                "
                              >
                                View Your Order →
                              </a>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer (your dark section vibe) -->
            <tr>
              <td style="padding: 16px 0px 0">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="background: #1f2937; border-radius: 16px"
                >
                  <tr>
                    <td
                      style="
                        padding: 18px 18px;
                        color: #e5e7eb;
                        font-size: 12px;
                        line-height: 1.6;
                      "
                    >
                      <div
                        style="
                          font-weight: 900;
                          font-size: 13px;
                          margin-bottom: 6px;
                        "
                      >
                        Join the Retro Crew
                      </div>
                      <div style="color: #cbd5e1">
                        Exclusive drops, early access, and special discounts —
                        nostalgia delivered to your inbox.
                      </div>

                      <div style="margin-top: 10px; color: #9ca3af">
                        Need help? Reply with your Order ID
                        <b style="color: #ffffff">#${
                          order.merchant_order_id
                        }</b>
                      </div>

                      <div style="margin-top: 10px; color: #9ca3af">
                        © 2024 Retro Revive • All rights reserved.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    });
    return;
  } catch (error) {
    throw new Error("Failed to send order confirmation email");
  }
}

module.exports = { sendOrderConfirmationEmail };
