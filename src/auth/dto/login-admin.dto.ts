import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { Field } from '@nestjs/graphql';

export class LoginAdminDto {
	@IsString()
	@IsNotEmpty()
	@Field(() => String)
	username: string;

	@IsStrongPassword()
	@IsNotEmpty()
	@Field(() => String)
	password: string;
}
