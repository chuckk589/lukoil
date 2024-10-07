import { ConnectionOptions } from 'bullmq';
import { config } from 'dotenv';

config({ path: '.lukoil.env' });

export const RedisConnectionOptions: ConnectionOptions = {
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
};
