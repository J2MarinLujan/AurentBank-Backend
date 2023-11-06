import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersModule } from '../gql/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../app.module';
import { ValidRoles } from '../common/enums/valid-roles.enum';

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [UsersModule, AppModule],
			providers: [AuthService, JwtService],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should login', async () => {
		const result = await service.login({
			email: 'j2marinlujan@gmail.com',
			password: 'Jjjmlll32#@',
		});
		expect(result).toBeInstanceOf(Object);
	});

	it('should signup', async () => {
		const user = {
			firstName: 'Juan',
			secondName: 'Jose',
			firstSurname: 'Marin',
			secondSurname: 'Lujan',
			email: 'j4marinlujan@gmail.com',
			password: 'Jjjmlll32#@',
			country: 'Colombia',
			role: ValidRoles.admin,
		};
		const result = await service.signup(user);
		expect(result).toBeInstanceOf(Object);
	});
});
