import { Test, TestingModule } from '@nestjs/testing';
import { WalletsTypeService } from './wallets-type.service';

describe('WalletsTypeService', () => {
	let service: WalletsTypeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [WalletsTypeService],
		}).compile();

		service = module.get<WalletsTypeService>(WalletsTypeService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
