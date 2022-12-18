import { NextFunction, Response, Request } from 'express';
import { logger } from '../config/logger';
import AppDataSource from '../db/db';
import { User } from '../entity/user';
import { UnauthenticatedException } from '../exception/user';
import jwt from 'jsonwebtoken';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bearerToken = req.headers.authorization?.split('Bearer ')[1];
        if (!bearerToken)
            throw new UnauthenticatedException('Unauthenticated access');

        const jwtVerification = jwt.verify(
            bearerToken,
            process.env.JWT_SECRET_KEY as string,
        );
        if (typeof jwtVerification === 'string' || !jwtVerification)
            throw new UnauthenticatedException('Unauthenticated access');

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({
            id: jwtVerification?.id,
        });
        if (!user) throw new UnauthenticatedException('Unauthenticated access');

        res.locals.user = user;
        next();
    } catch (error) {
        logger.error(`Unauthenticated access`);
        res.status(401).send({ message: 'Unauthenticated' });
    }
};
