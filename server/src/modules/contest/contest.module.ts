import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { Contest } from 'src/entities/contest.entity';

@Module({
	controllers: [ContestController],
	providers: [ContestService],
	imports: [TypeOrmModule.forFeature([Contest])],
})
export class ContestModule {}
