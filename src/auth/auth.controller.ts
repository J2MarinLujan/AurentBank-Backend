import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../gql/users/users.service';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { AdminResponse } from './types/admin-response.type';
import { AdminsService } from '../gql/admins/admins.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
		private readonly adminsService: AdminsService
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

	@Post('signupAdmin')
	async signupAdmin(
		@Body() signupAdminDto: SignupAdminDto
	): Promise<AdminResponse> {
		const adminByUsername = await this.adminsService.findOneByUsername(
			signupAdminDto.username
		);
		if (adminByUsername)
			throw new Error(`Username: ${signupAdminDto.username}, already in use`);
		return await this.authService.signupAdmin(signupAdminDto);
	}

	@Post('login')
	async login(@Body() loginAuthDto: LoginAuthDto): Promise<AuthResponse> {
		return await this.authService.login(loginAuthDto);
	}

	@Post('loginAdmin')
	async loginAdmin(
		@Body() loginAdminDto: LoginAdminDto
	): Promise<AdminResponse> {
		return await this.authService.loginAdmin(loginAdminDto);
	}
}
