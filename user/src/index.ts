import 'reflect-metadata';
import { app } from './app';
import { AppDataSource } from './config/database';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  console.log('Starting user service...');

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

    // Connect to database
    await AppDataSource.initialize();
    console.log('Database connected!');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('User service listening on port 3000!');
  });
};

start();
