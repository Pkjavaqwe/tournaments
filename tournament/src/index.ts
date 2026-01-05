import 'reflect-metadata';
import { app } from './app';
import { AppDataSource } from './config/database';
import { natsWrapper } from './nats-wrapper';
import { ParticipationApprovedListener } from './events/listeners/participation-approved-listener';
import { ParticipationLeftListener } from './events/listeners/participation-left-listener';

const start = async () => {
  console.log('Starting tournament service...');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
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

    new ParticipationApprovedListener(natsWrapper.client).listen();
    new ParticipationLeftListener(natsWrapper.client).listen();

    await AppDataSource.initialize();
    console.log('Database connected!');
  } catch (err) {
    console.error(err);
  }

  app.listen(3001, () => {
    console.log('Tournament service listening on port 3001!');
  });
};

start();
