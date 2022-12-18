import * as AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION,
});

export const s3Client = new AWS.S3();
