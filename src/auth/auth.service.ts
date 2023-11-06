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
import { User } from '../gql/users/entities/user.entity';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	private getJwtToken(user: User): string {
		return this.jwtService.sign({ id: user.id, dniId: user.dniId });
	}

	async signup(signupAuthDto: SignupAuthDto): Promise<AuthResponse> {
		const verifyEmail = await this.usersService.findOneByEmail(
			signupAuthDto.email
		);
		if (verifyEmail)
			throw new BadRequestException(
				`Email: ${signupAuthDto.email}, already exists`
			);
		const user = await this.usersService.create(signupAuthDto);
		const token = this.getJwtToken(user);
		delete user.password;
		return { token, user };
	}

	async login({ email, password }: LoginAuthDto): Promise<AuthResponse> {
		const user = await this.usersService.findOneByEmail(email);
		if (!user) throw new UnauthorizedException('Email incorrect');
		const checkPassword = compareSync(password, user.password);
		if (!checkPassword) throw new UnauthorizedException('Password incorrect');
		const token = this.getJwtToken(user);
		delete user.password;
		return { token, user };
	}

	async validate(id: number): Promise<User> {
		const user = await this.usersService.findOne(id);
		if (user.statusId !== 1) {
			throw new UnauthorizedException('User is not active');
		} else {
			delete user.password;
			return user;
		}
	}

	revalidate(user: User): AuthResponse {
		const token = this.getJwtToken(user);
		return { token, user };
	}
}
