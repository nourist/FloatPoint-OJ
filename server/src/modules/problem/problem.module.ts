import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinioModule } from '../minio/minio.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { ProblemEditorial } from 'src/entities/problem-editorial.entity';
import { ProblemTag } from 'src/entities/problem-tag.entity';
import { Problem } from 'src/entities/problem.entity';
import { Subtask } from 'src/entities/subtask.entity';
import { TestCase } from 'src/entities/test-case.entity';

@Module({
	controllers: [ProblemController],
	providers: [ProblemService],
	imports: [TypeOrmModule.forFeature([Problem, TestCase, Subtask, ProblemTag, ProblemEditorial]), UserModule, MinioModule, NotificationModule],
	exports: [ProblemService, TypeOrmModule],
})
export class ProblemModule {}
