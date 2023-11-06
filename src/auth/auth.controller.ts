import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../gql/users/entities/user.entity';
import { ValidRoles } from '../common/enums/valid-roles.enum';
import { AuthResponse } from './types/auth-response.type';
import { ActiveUser } from './decorators/active-user.decorator';
import { UsersService } from '../gql/users/users.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@Post('signup')
	async signup(@Body() signupAuthDto: SignupAuthDto): Promise<AuthResponse> {
		const userByEmail = await this.usersService.findOneByEmail(
			signupAuthDto.email
		);
		if (userByEmail)
			throw new Error(`Email: ${signupAuthDto.email}, already in use`);
		return await this.authService.signup(signupAuthDto);
	}

	@Post('login')
	async login(@Body() loginAuthDto: LoginAuthDto): Promise<AuthResponse> {
		return await this.authService.login(loginAuthDto);
	}

	@Get('revalidate')
	@UseGuards(JwtAuthGuard)
	revalidate(@ActiveUser(ValidRoles.user) user: User): AuthResponse {
		return this.authService.revalidate(user);
	}
}
