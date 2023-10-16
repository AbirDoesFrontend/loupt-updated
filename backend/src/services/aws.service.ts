import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
/* import { generatePresignedUrlRoute } from '../routes/misc.routes';
 */
export interface presignedUrlType {
    presignedUrl: string,
    url: string
}

export async function generatePresignedPutUrl(fileName: string, fileType: string): Promise<presignedUrlType | undefined> {
    const s3Client = new S3Client({
        region: 'us-east-1' // Change to your desired AWS region
    });

    const command = new PutObjectCommand({
        Bucket: 'louptimageassets',
        Key: fileName,
        ContentType: fileType
    });

    try {
        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60  // URL expiry time (in seconds)
        });

        return {
            presignedUrl: presignedUrl,
            url: `https://louptimageassets.s3.amazonaws.com/${fileName}`
        }
    } catch (err) {
        return undefined
    }
}

export async function deleteS3ItemByKey(key: string, bucketname? : string): Promise<boolean> {
    const s3Client = new S3Client({
        region: 'us-east-1' // Change to your desired AWS region
    });

    const command = new DeleteObjectCommand({
        Bucket: bucketname || 'louptimageassets',
        Key: key
    });

    try {
        await s3Client.send(command);
        return true
    } catch (err) {
        return false
    }
}