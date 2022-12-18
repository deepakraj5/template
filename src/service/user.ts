import { Request, Response } from 'express';
import { logger } from '../config/logger';
import AppDataSource from '../db/db';
import { User } from '../entity/user';
import bcrypt from 'bcryptjs';
import { UserLoginDTO, UserProfileDTO, UserSignupDTO } from '../_dto/user';
import { userLoginValidator, userSignupValidator } from '../validator/user';
import { UserValidationException } from '../exception/user';
import jwt from 'jsonwebtoken';
import { UserProfile } from '../_dto/UserProfile';

// user signup
export const signup = async (req: Request, res: Response) => {
    try {
        const payload: UserSignupDTO = req.body;

        const validationResponse = userSignupValidator.validate(payload);
        if (validationResponse?.error)
            throw new UserValidationException(
                `validation error ${validationResponse?.error.message}`,
            );

        const userRepository = AppDataSource.getRepository(User);
        payload.password = bcrypt.hashSync(payload.password, 12);

        await userRepository.save(payload);

        res.status(200).send({
            messsage: 'user created',
        });
    } catch (error) {
        if (error instanceof UserValidationException) {
            logger.error(`Error on validating singup payload ${error}`);
            return res.status(400).send({
                message: error?.message,
            });
        }

        logger.error(`Internal server error ${error}`);
        res.status(500).send(error);
    }
};

// user login
export const login = async (req: Request, res: Response) => {
    try {
        const payload: UserLoginDTO = req.body;

        const validationResponse = userLoginValidator.validate(payload);
        if (validationResponse?.error)
            throw new UserValidationException(
                `validation error ${validationResponse?.error.message}`,
            );

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email: payload.email });
        if (!user) throw new UserValidationException(`Wrong email or password`);
        const validatePassword = bcrypt.compareSync(
            payload.password,
            user?.password,
        );
        if (!validatePassword)
            throw new UserValidationException(`Wrong email or password`);

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET_KEY as string,
        );

        res.status(200).send({
            id: user.id,
            email: user.email,
            token,
        });
    } catch (error) {
        if (error instanceof UserValidationException) {
            logger.error(`Error on login ${error}`);
            return res.status(400).send({
                message: error?.message,
            });
        }

        logger.error(`Internal server error ${error}`);
        res.status(500).send(error);
    }
};

// user profile
export const profile = (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        const userProfile: UserProfileDTO = UserProfile.create(
            user.id,
            user.name,
            user.email,
        );

        return res.send(userProfile);
    } catch (error) {
        logger.error(`Internal server error ${error}`);
        res.status(500).send(error);
    }
};
