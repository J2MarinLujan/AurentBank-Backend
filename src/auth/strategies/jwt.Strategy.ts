import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/jwt.constants';
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

	async validate(payload: JwtPayloadInterface) {
		try {
			const { id, role } = payload;
			const user = await this.authService.validate(id, role);
			if (!user) new UnauthorizedException('User not found');
			return user;
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}
}
