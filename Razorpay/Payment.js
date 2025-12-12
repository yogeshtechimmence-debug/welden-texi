import Razorpay from "razorpay";

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      receipt = "rcptid_11",
      notes = {},
    } = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "amount required (in paise)" });
    }

    const options = {
      amount: amount,
      currency,
      receipt,
      payment_capture: 1,
      notes,
    };

    const order = await razorpay.orders.create(options);

    return res.json({ success: true, order });
  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const verifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment verified",
        payment_id: razorpay_payment_id,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("verify-payment error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const RazorpayWebHook = (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  try {
    const body = req.body;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature === expectedSignature) {
      const event = JSON.parse(body.toString("utf8"));

      console.log("Webhook verified. Event:", event.event);

      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;
        console.log("Payment captured:", payment.id, payment.amount);
      } else if (event.event === "payment.failed") {
      }

      return res.status(200).json({ status: "ok" });
    } else {
      console.warn("Webhook signature mismatch");
      return res.status(400).send("Invalid signature");
    }
  } catch (err) {
    console.error("webhook error:", err);
    return res.status(500).send("Server error");
  }
};
