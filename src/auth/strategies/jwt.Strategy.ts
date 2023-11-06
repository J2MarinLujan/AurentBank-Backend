import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/jwt.constants';
import { User } from '../../gql/users/entities/user.entity';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: JwtPayloadInterface): Promise<User> {
		try {
			const { id } = payload;
			const user = await this.authService.validate(id);
			if (!user) throw new UnauthorizedException('User not found');
			return user;
		} catch (error) {
			console.log(error);
			throw new UnauthorizedException('Invalid token');
		}
	}
}
