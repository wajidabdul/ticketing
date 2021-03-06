import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import {TicketUpdatedListener  } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {

    // For k8s env variables
    // if (!process.env.JWT_KEY) {
    //     throw new Error('JWT_KEY must be defined');
    // }
    // if (!process.env.MONGO_URI) {
    //     throw new Error('MONGO_URI must be defined');
    // }
    // if (!process.env.NATS_CLIENT_ID) {
    //     throw new Error('NATS_CLIENT_ID must be defined');
    // }
    // if (!process.env.NATS_URL) {
    //     throw new Error('NATS_URL must be defined');
    // }
    // if (!process.env.NATS_CLUSTER_ID) {
    //     throw new Error('NATS_CLUSTER_ID must be defined');
    // }
    
    try {
        // for k8s nats
        // await natsWrapper.connect(
        //     process.env.NATS_CLUSTER_ID,
        //     process.env.NATS_CLIENT_ID,
        //     process.env.NATS_URL
        // );
        // for local nats
        await natsWrapper.connect('test-cluster', 'orders-client');

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        
        // For k8s use env var URI process.env.MONGO_URI
        await mongoose.connect('mongodb+srv://micro-ticketing:ticketing@cluster0.rq8ca.mongodb.net/micro-ticketing-orders?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('connected to DB');
    } catch (err) {
        console.error(err);
    }

    app.listen(3003, () => {
        console.log('Listening on port 3003!');
    });
};

start();