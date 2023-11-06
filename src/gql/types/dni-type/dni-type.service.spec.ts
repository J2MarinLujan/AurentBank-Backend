import { Test, TestingModule } from '@nestjs/testing';
import { DniTypeService } from './dni-type.service';

describe('DniTypeService', () => {
	let service: DniTypeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DniTypeService],
		}).compile();

		service = module.get<DniTypeService>(DniTypeService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
