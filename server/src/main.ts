import { ValidationPipe } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { CustomIoAdapter } from './adapters/io.adapter';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { SerializeInterceptor } from './interceptors/serialize.interceptor';

async function bootstrap() {
	// Initialize transactional context for database transactions
	initializeTransactionalContext();

	const app = await NestFactory.create(AppModule, {
		logger: ['error', 'warn', 'log', 'verbose', 'debug'],
	});
	const configService = app.get(ConfigService);

	// Configure WebSocket adapter with proper CORS
	app.useWebSocketAdapter(new CustomIoAdapter(app, configService));

	app.enableCors({
		origin: configService.get<string>('CLIENT_URL'),
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true,
	});

	app.use(cookieParser());

	// Configure global validation pipe with custom error handling
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
				exposeUnsetFields: true,
			},
			// Custom exception factory to format validation errors
			exceptionFactory: (validationErrors: ValidationError[] = []) => {
				return new UnprocessableEntityException({
					statusCode: 422,
					error: 'Unprocessable Entity',
					message: 'Validation failed',
					// Transform validation errors into field-specific error messages
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

	const rabbitmqUrl = `amqp://${configService.get<string>('RABBITMQ_USER')}:${configService.get<string>('RABBITMQ_PASS')}@${configService.get<string>('RABBITMQ_HOST')}:${configService.get<number>('RABBITMQ_PORT')}`;

	// Connect to RabbitMQ microservice for judger acknowledgments
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [rabbitmqUrl],
			queue: 'judger.ack',
			queueOptions: { durable: true },
		},
	});

	// Connect to RabbitMQ microservice for judger results
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [rabbitmqUrl],
			queue: 'judger.result',
			queueOptions: { durable: true },
		},
	});

	// Connect to RabbitMQ microservice for judger heartbeats
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [rabbitmqUrl],
			queue: 'judger.heartbeat',
			queueOptions: { durable: true },
		},
	});

	// Configure proxy middleware for MinIO storage access
	app.use(
		'/storage',
		createProxyMiddleware({
			target: `http://${configService.get<string>('MINIO_ENDPOINT')}:${configService.get<number>('MINIO_PORT')}`,
			changeOrigin: true,
			pathRewrite: {
				'^/storage': '',
			},
		}),
	);

	const config = new DocumentBuilder().setTitle('API Docs').setDescription('API documentation for my project').setVersion('1.0').addBearerAuth().build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document);

	await app.startAllMicroservices();
	await app.listen(configService.get<number>('PORT')!);
}

void bootstrap();
