import Stripe from "stripe";

export const stripe = new Stripe(
    // for k8s
    // process.env.STRIPE_KEY
    'sk_test_51IJINgBbgYbfnANLMIXq3fglCpCiYR5A7sUHnEuVjgBmLaKe9GgKUwVypZzvOsen7rNapfwuNUkSBzP3iGbG4ZZB00CLaXS7GB',
    {
        apiVersion: '2020-08-27'
    }
);