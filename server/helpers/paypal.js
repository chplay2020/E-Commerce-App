const { Client, Environment, OrdersController } = require('@paypal/paypal-server-sdk');

// PayPal client configuration
const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox,
    // For production use: Environment.Production
});

const ordersController = new OrdersController(client);

module.exports = { client, ordersController };