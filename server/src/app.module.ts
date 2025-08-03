import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MailerModule } from '@nestjs-modules/mailer';
import path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				PORT: Joi.number().default(4000),
				CLIENT_URL: Joi.string().default('http://localhost:3000'), //for cors

				DB_HOST: Joi.string().default('localhost'),
				DB_PORT: Joi.number().default(5432),
				DB_USER: Joi.string().default('postgres'),
				DB_PASS: Joi.string().default(''),
				DB_NAME: Joi.string().default('postgres'),

				MAIL_HOST: Joi.string().default('smtp.mailtrap.com'),
				MAIL_PORT: Joi.number().default(587),
				MAIL_USER: Joi.string().required(),
				MAIL_PASS: Joi.string().required(),
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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
