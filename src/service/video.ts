import { Response, Request } from 'express';
import { logger } from '../config/logger';
import { UploadVideoToS3 } from '../_dto/video';
import { s3Client } from '../config/s3Client';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { v4 as uuid } from 'uuid';
import { videoUploadValidator } from '../validator/video';
import { VideoUploadValidationException } from '../exception/video';

// upload video to s3
export const uploadVideoToS3 = async (req: Request, res: Response) => {
    try {
        const videoData: UploadVideoToS3 = req.body;

        const validationResponse = videoUploadValidator.validate(videoData);
        if (validationResponse?.error)
            throw new VideoUploadValidationException(
                `validation error ${validationResponse?.error.message}`,
            );

        logger.info('started uploading video to S3');

        videoData.id = uuid();

        const buffer = Buffer.from(videoData.data)

        console.log(buffer)

        const s3Object: PutObjectRequest = {
            Bucket: process.env.S3_BUCKET as string,
            Key: `${videoData.id}.mp4`,
            Body: buffer,
            ContentType: 'video/mp4'
        };

        await s3Client.putObject(s3Object).promise();

        return res.send({
            message: 'video uploaded',
        });
    } catch (error) {
        
        if (error instanceof VideoUploadValidationException) {
            logger.error(`Error on video upload validation ${error}`);
            return res.status(400).send({
                message: error?.message,
            });
        }

        logger.error(`Internal server error ${error}`);
        res.status(500).send(error);
    }
};
