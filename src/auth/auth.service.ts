import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../gql/users/users.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './types/auth-response.type';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { AdminResponse } from './types/admin-response.type';
import { AdminsService } from '../gql/admins/admins.service';
import { ValidRoles } from '../common/enums/valid-roles.enum';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly adminsService: AdminsService,
		private readonly jwtService: JwtService
	) {}

	private getJwtToken(id: number, role: ValidRoles): string {
		return this.jwtService.sign({ id, role });
	}

	async signup(signupAuthDto: SignupAuthDto): Promise<AuthResponse> {
		const user = await this.usersService.create(signupAuthDto);
		const token = this.getJwtToken(user.id, ValidRoles.user);
		delete user.password;
		return { token, user };
	}

	async signupAdmin(signupAdminDto: SignupAdminDto): Promise<AdminResponse> {
		const admin = await this.adminsService.create(signupAdminDto);
		const token = this.getJwtToken(admin.id, ValidRoles.admin);
		delete admin.password;
		return { token, admin };
	}

	async login({ email, password }: LoginAuthDto): Promise<AuthResponse> {
		const user = await this.usersService.findOneByEmail(email);
		if (!user) throw new UnauthorizedException('Email incorrect');
		const checkPassword = compareSync(password, user.password);
		if (!checkPassword) throw new UnauthorizedException('Password incorrect');
		const token = this.getJwtToken(user.id, ValidRoles.user);
		delete user.password;
		return { token, user };
	}

	async loginAdmin({
		username,
		password,
	}: LoginAdminDto): Promise<AdminResponse> {
		const admin = await this.adminsService.findOneByUsername(username);
		if (!admin) throw new UnauthorizedException('Username incorrect');
		const checkPassword = compareSync(password, admin.password);
		if (!checkPassword) throw new UnauthorizedException('Password incorrect');
		const token = this.getJwtToken(admin.id, ValidRoles.user);
		delete admin.password;
		return { token, admin };
	}

	async validate(id: number, role: ValidRoles) {
		switch (role) {
			case ValidRoles.user:
				const user = await this.usersService.findOne(id);
				if (user.statusId !== 1) {
					throw new UnauthorizedException('User is not active');
				} else {
					delete user.password;
					return user;
				}
			case ValidRoles.admin:
				const admin = await this.adminsService.findOne(id);
				if (admin.statusId !== 1) {
					throw new UnauthorizedException('User is not active');
				} else {
					delete admin.password;
					return admin;
				}
			default:
				throw new BadRequestException('Invalid role');
		}
	}
}
