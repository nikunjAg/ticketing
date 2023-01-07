import Queue from "bull";

import { OrderExpiredPublisher } from "../events/publisher/order-expired-publisher";
import { natsWrapper } from "../nats-wrapper";

interface JobPayload {
  orderId: string;
};

const expirationQueue = new Queue<JobPayload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
    // port: 6379,
  }
});

expirationQueue.process(async function(job) {
  console.log(
		"Expiration:completed for orderId:",
		job.data.orderId
  );

  new OrderExpiredPublisher(natsWrapper.client).publish({
    id: job.data.orderId,
  });
});

expirationQueue.on('completed', job => {
  console.log(`Job with id ${job.id} has been completed`);
});

expirationQueue.on('active', (job) => {
  console.log(`Job with id ${job.id} has been active`);
});

expirationQueue.on('error', (job) => {
  console.log(`Job with id ${job.stack} has been error`, job.stack);
});
expirationQueue.on('failed', (job) => {
  console.log(`Job with id ${job.id} has been error`, job.failedReason);
});

export { expirationQueue };