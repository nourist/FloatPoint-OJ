import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { GoogleModule } from './modules/google/google.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { ProblemModule } from './modules/problem/problem.module';
import { MinioModule } from './modules/minio/minio.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				NODE_ENV: Joi.valid('development', 'production', 'test').default('development'),

				PORT: Joi.number().default(4000),
				CLIENT_URL: Joi.string().default('http://localhost:3000'), //for cors

				JWT_SECRET: Joi.string().default('secretKey'),
				JWT_EXPIRES_IN: Joi.string().default('7d'),
				SALT_ROUNDS: Joi.number().default(10),

				DB_HOST: Joi.string().default('localhost'),
				DB_PORT: Joi.number().default(5432),
				DB_USER: Joi.string().default('postgres'),
				DB_PASS: Joi.string().default(''),
				DB_NAME: Joi.string().default('postgres'),

				MAIL_HOST: Joi.string().default('smtp.mailtrap.com'),
				MAIL_PORT: Joi.number().default(587),
				MAIL_USER: Joi.string().required(),
				MAIL_PASS: Joi.string().required(),

				MINIO_ENDPOINT: Joi.string().default('localhost'),
				MINIO_PORT: Joi.number().default(9000),
				MINIO_ACCESS_KEY: Joi.string().required(),
				MINIO_SECRET_KEY: Joi.string().required(),
			}),
		}),
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
			dataSourceFactory: (options) => {
				if (!options) {
					throw new Error('Invalid options passed');
				}

				const ds = new DataSource(options);
				return ds.initialize().then(addTransactionalDataSource);
			},
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: configService.get<string>('MAIL_HOST'),
					port: configService.get<number>('MAIL_PORT'),
					auth: {
						user: configService.get<string>('MAIL_USER'),
						pass: configService.get<string>('MAIL_PASS'),
					},
				},
				defaults: {
					from: '"FloatPoint Team" <noreply@floatpoint.com>',
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
		UserModule,
		AuthModule,
		MailModule,
		GoogleModule,
		AccessControlModule,
		ProblemModule,
		MinioModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
