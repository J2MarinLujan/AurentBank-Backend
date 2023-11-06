import { Test, TestingModule } from '@nestjs/testing';
import { DniService } from './dni.service';

describe('DniService', () => {
	let service: DniService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DniService],
		}).compile();

		service = module.get<DniService>(DniService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
