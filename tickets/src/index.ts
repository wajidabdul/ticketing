import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

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
        await natsWrapper.connect('test-cluster', 'test');

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
        
        // For k8s use env var URI process.env.MONGO_URI
        await mongoose.connect('mongodb+srv://microticketing:ticketing@cluster0.7sqyh.mongodb.net/micro-ticketing-tickets?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('connected to DB');
    } catch (err) {
        console.error(err);
    }

    app.listen(3002, () => {
        console.log('Listening on port 3002!');
    });
};

start();