import { Test, TestingModule } from '@nestjs/testing';

import { JudgerGateway } from './judger.gateway';

describe('JudgerGateway', () => {
	let gateway: JudgerGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [JudgerGateway],
		}).compile();

		gateway = module.get<JudgerGateway>(JudgerGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
