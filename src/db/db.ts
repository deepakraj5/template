import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { logger } from '../config/logger';
import { User } from '../entity/user';
import dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: true,
    logging: false,
});

AppDataSource.initialize()
    .then(() => logger.info('DB connected'))
    .catch((error) => logger.error(`DB connection ${error}`));

export default AppDataSource;
