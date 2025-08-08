import { ValidationPipe } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { SerializeInterceptor } from './interceptors/serialize.interceptor';

async function bootstrap() {
	initializeTransactionalContext();

	const app = await NestFactory.create(AppModule, {
		logger: ['error', 'warn', 'log', 'verbose', 'debug'],
	});
	const configService = app.get(ConfigService);

	app.enableCors({
		origin: configService.get<string>('CLIENT_URL'),
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true,
	});

	app.use(cookieParser());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
				exposeUnsetFields: true,
			},
			exceptionFactory: (validationErrors: ValidationError[] = []) => {
				return new UnprocessableEntityException({
					statusCode: 422,
					error: 'Unprocessable Entity',
					message: 'Validation failed',
					fieldErrors: validationErrors.reduce(
						(acc, error) => ({
							...acc,
							[error.property]: Object.values(error?.constraints ?? {}).reduce((acc, cur) => cur, ''),
						}),
						{},
					),
				});
			},
		}),
	);

	app.useGlobalFilters(new AllExceptionsFilter());

	app.useGlobalInterceptors(new SerializeInterceptor());

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [configService.get<string>('RABBITMQ_URL')!],
			queue: 'judger.ack',
			queueOptions: { durable: true },
		},
	});

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [configService.get<string>('RABBITMQ_URL')!],
			queue: 'judger.result',
			queueOptions: { durable: true },
		},
	});

	await app.startAllMicroservices();

	await app.listen(configService.get<number>('PORT')!);
}

void bootstrap();
