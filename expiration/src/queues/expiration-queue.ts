import Queue from "bull";

interface JobPayload {
  orderId: string;
};

const expirationQueue = new Queue<JobPayload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
    // port: 6379,
  }
});

expirationQueue.process(async function(job, done) {
  console.log(
		"I am processing expiration:complete event for orderId",
		job.data.orderId
  );
  done();
});

expirationQueue.on('completed', job => {
  console.log(`Job with id ${job.id} has been completed`);
});

expirationQueue.on('active', (job) => {
  console.log(`Job with id ${job.id} has been active`);
});

expirationQueue.on('error', (job) => {
  console.log(`Job with id ${job.stack} has been error`);
});

export { expirationQueue };