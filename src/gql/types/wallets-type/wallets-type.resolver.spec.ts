import { Test, TestingModule } from '@nestjs/testing';
import { WalletsTypeResolver } from './wallets-type.resolver';
import { WalletsTypeService } from './wallets-type.service';

describe('WalletsTypeResolver', () => {
	let resolver: WalletsTypeResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [WalletsTypeResolver, WalletsTypeService],
		}).compile();

		resolver = module.get<WalletsTypeResolver>(WalletsTypeResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
