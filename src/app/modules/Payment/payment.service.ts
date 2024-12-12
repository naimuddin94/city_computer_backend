import Stripe from "stripe";
import config from "../../config";

const stripe = new Stripe(config.stripe_secret_key!);

const generatePaymentKey = async (price: number) => {
  const amount = price * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  return paymentIntent.client_secret;
};

export const PaymentService = { generatePaymentKey };
