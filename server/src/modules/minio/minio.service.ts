import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
	private readonly logger = new Logger(MinioService.name);
	private readonly minioClient: Client;

	constructor(private readonly config: ConfigService) {
		this.minioClient = new Client({
			endPoint: this.config.get<string>('MINIO_ENDPOINT')!,
			port: this.config.get<number>('MINIO_PORT'),
			useSSL: this.config.get<string>('NODE_ENV') === 'production',
			accessKey: this.config.get<string>('MINIO_ACCESS_KEY'),
			secretKey: this.config.get<string>('MINIO_SECRET_KEY'),
		});

		void this.ensureBucketExists('test-cases');
	}

	private async ensureBucketExists(bucketName: string) {
		try {
			const exists = await this.minioClient.bucketExists(bucketName);
			if (!exists) {
				await this.minioClient.makeBucket(bucketName, '');
				this.logger.log(`Bucket "${bucketName}" created`);
			} else {
				this.logger.log(`Bucket "${bucketName}" already exists`);
			}
		} catch (error) {
			this.logger.error(`Failed to check/create bucket: ${error}`);
		}
	}

	getClient() {
		return this.minioClient;
	}

	async getFileContent(bucketName: string, filename: string): Promise<string> {
		const stream = await this.minioClient.getObject(bucketName, filename);

		return new Promise((resolve, reject) => {
			let data = '';
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			stream.on('data', (chunk) => (data += chunk.toString()));
			stream.on('end', () => resolve(data));
			stream.on('error', reject);
		});
	}

	async renameFile(bucketName: string, oldFilename: string, newFilename: string) {
		await this.minioClient.copyObject(bucketName, newFilename, oldFilename);
		await this.minioClient.removeObject(bucketName, oldFilename);
	}

	async saveFile(bucketName: string, filename: string, content: string) {
		await this.minioClient.putObject(bucketName, filename, content);
	}

	async removeFile(bucketName: string, filename: string) {
		await this.minioClient.removeObject(bucketName, filename);
	}

	async renameDir(bucketName: string, oldDirname: string, newDirname: string) {
		const objectsList: string[] = [];

		const stream = this.minioClient.listObjects(bucketName, oldDirname, true);

		for await (const obj of stream) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
			objectsList.push(obj.name);
		}

		await Promise.all(objectsList.map((item) => this.renameFile(bucketName, item, item.replace(oldDirname, newDirname))));
	}

	async removeDir(bucketName: string, dirname: string) {
		const objectsList: string[] = [];

		const stream = this.minioClient.listObjects(bucketName, dirname, true);

		for await (const obj of stream) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
			objectsList.push(obj.name);
		}

		if (objectsList.length > 0) {
			await this.minioClient.removeObjects(bucketName, objectsList);
		}
	}
}
