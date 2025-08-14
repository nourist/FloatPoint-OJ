import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinioModule } from '../minio/minio.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User]), MinioModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService, TypeOrmModule],
})
export class UserModule {}
