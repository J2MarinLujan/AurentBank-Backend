import { Test, TestingModule } from '@nestjs/testing';
import { DniResolver } from './dni.resolver';
import { DniService } from './dni.service';

describe('DniResolver', () => {
	let resolver: DniResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DniResolver, DniService],
		}).compile();

		resolver = module.get<DniResolver>(DniResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
