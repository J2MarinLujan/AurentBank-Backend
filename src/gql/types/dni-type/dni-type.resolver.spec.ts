import { Test, TestingModule } from '@nestjs/testing';
import { DniTypeResolver } from './dni-type.resolver';
import { DniTypeService } from './dni-type.service';

describe('DniTypeResolver', () => {
	let resolver: DniTypeResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DniTypeResolver, DniTypeService],
		}).compile();

		resolver = module.get<DniTypeResolver>(DniTypeResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
