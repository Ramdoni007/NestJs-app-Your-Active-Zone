import * as process from 'process';

export const awsConstant = {
    ACCESS_KEY_AWS: process.env.AWS_ACCESS_KEY_AWS || '',
    SECRET_ACCESS_KEY_AWS: process.env.AWS_SECRET_ACCESS_KEY || '',
    REGION_AWS: process.env.AWS_REGION || 'us-east-1',
    BUCKET_NAME_AWS: process.env.BUCKET_NAME_AWS || '',
    PARAMETER_STORE_NAME_AWS: process.env.PARAMETER_STORE_NAME_AWS || '',
}