import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		UserModule,
		MailModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: config.get<string>('JWT_EXPIRES_IN'),
				},
			}),
		}),
	],
})
export class AuthModule {}
