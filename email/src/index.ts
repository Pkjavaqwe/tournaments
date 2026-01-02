import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { ParticipationApprovedListener } from './events/listeners/participation-approved-listener';
import { ParticipationRejectedListener } from './events/listeners/participation-rejected-listener';

const start = async () => {
  console.log('Starting email service...');

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    // Connect to NATS
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.close());
    process.on('SIGTERM', () => natsWrapper.close());

    // Start event listeners
    // Email service is fully decoupled - just listens to events!
    new UserCreatedListener(natsWrapper.client).listen();
    new ParticipationApprovedListener(natsWrapper.client).listen();
    new ParticipationRejectedListener(natsWrapper.client).listen();

    console.log('Email service listening for events...');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Email service on port 3000!');
  });
};

start();
