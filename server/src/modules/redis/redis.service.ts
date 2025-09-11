import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private client: RedisClientType;

	constructor(private readonly configService: ConfigService) {
		this.client = createClient({
			password: this.configService.get<string>('REDIS_PASSWORD'),
			socket: {
				host: this.configService.get<string>('REDIS_HOST'),
				port: this.configService.get<number>('REDIS_PORT'),
			},
		});

		this.client.on('error', (err) => console.error('Redis Client Error', err));
	}

	async onModuleInit() {
		await this.client.connect();
	}

	async onModuleDestroy() {
		await this.client.quit();
	}

	getClient(): RedisClientType {
		return this.client;
	}
}
