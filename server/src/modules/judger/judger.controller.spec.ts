import { Test, TestingModule } from '@nestjs/testing';

import { JudgerController } from './judger.controller';
import { JudgerService } from './judger.service';

describe('JudgerController', () => {
	let controller: JudgerController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [JudgerController],
			providers: [JudgerService],
		}).compile();

		controller = module.get<JudgerController>(JudgerController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
