import { Injectable, Logger } from "@nestjs/common";
import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client }     from "@aws-sdk/client-s3";
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { awsConstant } from "src/constants/aws.constant";
import { promises } from "dns";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import path from "path";
import { randomUUID } from "crypto";
import { map } from "rxjs";
import { json } from "stream/consumers";
import { IAWSEnvironment } from "src/interfaces/aws.interface";
@Injectable()
export class AwsUtil { 
    private logger: Logger = new Logger(AwsUtil.name)
    private readonly s3Client: S3Client;
    private readonly ssmClient: SSMClient; 
    constructor() {
        const params: any = { 
            region: awsConstant.REGION_AWS,
            credentials: { 
                accessKeyId: awsConstant.ACCESS_KEY_AWS,
                secreAccessKey: awsConstant.SECRET_ACCESS_KEY_AWS,
            }
        }
        this.s3Client = new S3Client(params)
        this.ssmClient = new SSMClient(params)
    }
    public async uploadFileToS3(params: { 
        key: string,
        body: Buffer | Uint8Array | Blob | string, 
        contentType?: string,
    }): Promise<string> { 
        try { 
            await this.s3Client.send(new PutObjectCommand({
                Bucket: awsConstant.BUCKET_NAME_AWS,
                Key: params.key,
                Body: params.body,
                ContentType: params.contentType
            }))
            return this.getUrlS3(params.key)
        }catch (error) {
            this.logger.error(error, "Error Upload File To S3",(error as Error)?.stack)
            throw error
        }
    }
    private getUrlS3(key: string): string { 
        return `https://s3.${awsConstant.REGION_AWS}.amazonaws.com/${awsConstant.BUCKET_NAME_AWS}/${encodeURIComponent(key)}`
    }

    public makeTempKey(userUuid: string, originalName: string): string {
        const ext = path.extname(originalName || '') || '.bin'
        const safeBase = (path.basename(originalName, ext ) || 'file').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0,50)
        return `temp/${userUuid}/${randomUUID()}-${safeBase}${ext}`
    }

    public async createPresignedUrl(key: string, contentType: string):Promise< { url: string, key: string }> { 
        const cmd = new PutObjectCommand({
            Bucket: awsConstant.BUCKET_NAME_AWS,
            Key: key,
            ContentType: contentType,
            Tagging: 'stage=temp',
            ACL: 'private',
        })
        const url = await getSignedUrl(this.s3Client, cmd, { expiresIn: 60 * 5 })
        return {url,key}
    }
    public async finalizeObjectFromTemp(tempKey: string, finalKey: string): Promise<string> {
        await this.s3Client.send(new HeadObjectCommand({
            Bucket: awsConstant.BUCKET_NAME_AWS,
            Key: tempKey
        }))
        await this.s3Client.send(new CopyObjectCommand({
            Bucket: awsConstant.BUCKET_NAME_AWS,
            CopySource: `${awsConstant.BUCKET_NAME_AWS}/${encodeURIComponent(tempKey)} }`,
            Key: finalKey,
            MetadataDirective: 'REPLACE',
            TaggingDirective: 'REPLACE',
            Tagging: 'stage=permanent',
            ACL: 'private'
        }))

        try { 
            await this.s3Client.send(new DeleteObjectCommand({
                Bucket: awsConstant.BUCKET_NAME_AWS,
                Key: tempKey
            }))
        } catch (error) {
            this.logger.warn(`Failed to delete temp object: ${tempKey}`, (error as Error)?.stack)
        }
        return this.getUrlS3(finalKey)
    }
    public makeUserPhotoKey(userUuid: string, originalName: string): string {
          const ext = path.extname(originalName || '') || '.bin'
        const safeBase = (path.basename(originalName, ext ) || 'file').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0,50)
        return `temp/${userUuid}/${randomUUID()}-${safeBase}${ext}`
    }
    public async getParameterStoreValue(): Promise<IAWSEnvironment> { 
        try { 
            const parameterNames = awsConstant.PARAMETER_STORE_NAME_AWS
            let splitParameterName: string[] = []
          if(parameterNames) { 
              if(parameterNames.includes(',') ) {
                splitParameterName = parameterNames.split(',').map((p): string => p.trim()).filter(Boolean)
            }else {
                splitParameterName = [parameterNames.trim()]
            }
          }else { 
            splitParameterName = []
          }
          let result: IAWSEnvironment = {} as IAWSEnvironment
          for(const parameterName of splitParameterName) { 
            const response: any = await this.ssmClient.send(new GetParameterCommand({
                Name: parameterName,
                WithDecryption: true
            }));
            const dataName: any = JSON.parse(response.Parameter.Value);
            result = {...result, ...dataName}
          }
          return result
        }catch (error) {
            this.logger.error(error, "Error Get Parameter Store Value",(error as Error)?.stack)
            throw error
        }
    }
}