import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinioModule } from '../minio/minio.module';
import { SubmissionModule } from '../submission/submission.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User]), MinioModule, ConfigModule, forwardRef(() => SubmissionModule)],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService, TypeOrmModule],
})
export class UserModule {}
