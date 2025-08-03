import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { UnprocessableEntityException } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';

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

	await app.listen(configService.get<number>('PORT')!);
}

void bootstrap();
