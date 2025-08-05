import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { Problem } from 'src/entities/problem.entity';
import { TestCase } from 'src/entities/test-case.entity';
import { Subtask } from 'src/entities/subtask.entity';
import { UserModule } from '../user/user.module';
import { ProblemTag } from 'src/entities/problem-tag.entity';
import { ProblemEditorial } from 'src/entities/problem-editorial.entity';
import { MinioModule } from '../minio/minio.module';

@Module({
	controllers: [ProblemController],
	providers: [ProblemService],
	imports: [TypeOrmModule.forFeature([Problem, TestCase, Subtask, ProblemTag, ProblemEditorial]), UserModule, MinioModule],
	exports: [ProblemService, TypeOrmModule],
})
export class ProblemModule {}
