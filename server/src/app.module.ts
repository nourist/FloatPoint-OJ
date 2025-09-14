import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContestModule } from './modules/contest/contest.module';
import { GoogleModule } from './modules/google/google.module';
import { JudgerModule } from './modules/judger/judger.module';
import { MailModule } from './modules/mail/mail.module';
import { MinioModule } from './modules/minio/minio.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProblemModule } from './modules/problem/problem.module';
import { RedisModule } from './modules/redis/redis.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { UserModule } from './modules/user/user.module';

@Module({
	imports: [
		// Global configuration module with environment validation
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				// Application environment
				NODE_ENV: Joi.valid('development', 'production', 'test').empty('').default('development'),

				// Server configuration
				PORT: Joi.number().empty('').default(4000),
				CLIENT_URL: Joi.string().empty('').default('http://localhost:3000'), // for CORS

				// JWT authentication configuration
				JWT_SECRET: Joi.string().empty('').default('secretKey'),
				JWT_EXPIRES_IN: Joi.string().empty('').default('7d'),
				SALT_ROUNDS: Joi.number().empty('').default(10),

				// Database configuration
				DB_HOST: Joi.string().empty('').default('localhost'),
				DB_PORT: Joi.number().empty('').default(5432),
				DB_USER: Joi.string().empty('').default('postgres'),
				DB_PASS: Joi.string().empty('').default('postgres'),
				DB_NAME: Joi.string().empty('').default('postgres'),

				// Message queue configuration
				RABBITMQ_HOST: Joi.string().empty('').default('localhost'),
				RABBITMQ_PORT: Joi.number().empty('').default(5672),
				RABBITMQ_USER: Joi.string().empty('').default('guest'),
				RABBITMQ_PASS: Joi.string().empty('').default('guest'),

				// Email service configuration
				MAIL_HOST: Joi.string().empty('').default('smtp.mailtrap.com'),
				MAIL_PORT: Joi.number().empty('').default(587),
				MAIL_USER: Joi.string().empty('').required(),
				MAIL_PASS: Joi.string().empty('').required(),
				MAIL_FROM_EMAIL: Joi.string().empty('').required(),

				// MinIO storage configuration
				MINIO_ENDPOINT: Joi.string().empty('').default('localhost'),
				MINIO_PORT: Joi.number().empty('').default(9000),
				MINIO_ACCESS_KEY: Joi.string().empty('').default('minioadmin'),
				MINIO_SECRET_KEY: Joi.string().empty('').default('minioadmin'),

				//redis configuration
				REDIS_HOST: Joi.string().empty('').default('localhost'),
				REDIS_PORT: Joi.number().empty('').default(6379),
				REDIS_PASSWORD: Joi.string().empty('').default('redispass'),
			}),
		}),

		// PostgreSQL database configuration
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('DB_HOST'),
				port: configService.get<number>('DB_PORT'),
				username: configService.get<string>('DB_USER'),
				password: configService.get<string>('DB_PASS'),
				database: configService.get<string>('DB_NAME'),
				entities: [__dirname + '/entities/*.entity{.ts,.js}'],
				synchronize: false,
			}),
			// Custom data source factory with transactional support
			dataSourceFactory: (options) => {
				if (!options) {
					throw new Error('Invalid options passed');
				}

				const ds = new DataSource(options);
				return ds.initialize().then(addTransactionalDataSource);
			},
		}),

		// Email service configuration
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: configService.get<string>('MAIL_HOST'),
					port: configService.get<number>('MAIL_PORT'),
					secure: configService.get<string>('NODE_ENV') === 'production',
					auth: {
						user: configService.get<string>('MAIL_USER'),
						pass: configService.get<string>('MAIL_PASS'),
					},
				},
				defaults: {
					from: `"FloatPoint Team" <${configService.get<string>('MAIL_FROM_EMAIL')}>`,
				},
				template: {
					dir: path.join(__dirname, 'modules/mail/templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
		}),

		// Task scheduling module
		ScheduleModule.forRoot(),

		// Feature modules
		UserModule,
		AuthModule,
		MailModule,
		GoogleModule,
		AccessControlModule,
		ProblemModule,
		MinioModule,
		SubmissionModule,
		ContestModule,
		BlogModule,
		NotificationModule,
		JudgerModule,
		RedisModule,
		StatisticsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
