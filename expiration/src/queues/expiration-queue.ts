import Queue from "bull";
import { ExpirationCompletePublsher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    // redis: {
    //     for k8s
    //     host: process.env.REDIS_HOST
    // }
    redis: { port: 6379, host: "127.0.0.1" }
});

expirationQueue.process(async (job) => {
    new ExpirationCompletePublsher(natsWrapper.client).publish({
        orderId: job.data.orderId
    });
});

export { expirationQueue };