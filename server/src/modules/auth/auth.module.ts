import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { GoogleModule } from '../google/google.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleIdStrategy } from 'src/strategies/google-id.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { LocalStrategy } from 'src/strategies/local.strategy';

@Module({
	controllers: [AuthController],
	providers: [AuthService, GoogleIdStrategy, LocalStrategy, JwtStrategy],
	imports: [
		GoogleModule,
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
