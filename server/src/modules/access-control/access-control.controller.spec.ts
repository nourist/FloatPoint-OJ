import { Test, TestingModule } from '@nestjs/testing';

import { AccessControlController } from './access-control.controller';
import { AccessControlService } from './access-control.service';

describe('AccessControlController', () => {
	let controller: AccessControlController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessControlController],
			providers: [AccessControlService],
		}).compile();

		controller = module.get<AccessControlController>(AccessControlController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
