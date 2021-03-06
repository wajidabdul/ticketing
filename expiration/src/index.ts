import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {

    // For k8s env variables
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
        await natsWrapper.connect('test-cluster', 'expiration-service');

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();

    } catch (err) {
        console.error(err);
    }
};

start();