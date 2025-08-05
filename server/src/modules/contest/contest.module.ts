import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContestService } from './contest.service';
import { ContestController } from './contest.controller';
import { Contest } from 'src/entities/contest.entity';

@Module({
	controllers: [ContestController],
	providers: [ContestService],
	imports: [TypeOrmModule.forFeature([Contest])],
})
export class ContestModule {}
