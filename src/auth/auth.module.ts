import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../gql/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constants';
import { JwtStrategy } from './strategies/jwt.Strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminsModule } from '../gql/admins/admins.module';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			useFactory: () => ({
				secret: jwtConstants.secret,
				signOptions: { expiresIn: '8h' },
			}),
		}),
		UsersModule,
		AdminsModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, JwtAuthGuard],
	exports: [JwtStrategy, PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
