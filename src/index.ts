import express from 'express';
import { logger } from './config/logger';
import './db/db';
import userRouter from './routes/user';
import videoRouter from './routes/video';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

dotenv.config();

const PORT = process.env.PORT ?? 5000;

app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use('/api/v1', userRouter);
app.use('/api/v1', videoRouter);

app.listen(PORT, () => logger.info(`server upon port ${PORT}`));
