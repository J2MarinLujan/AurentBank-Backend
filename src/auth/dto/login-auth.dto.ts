import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Field } from '@nestjs/graphql';

export class LoginAuthDto {
	@IsEmail()
	@IsNotEmpty()
	@Field(() => String)
	email: string;

	@IsStrongPassword()
	@IsNotEmpty()
	@Field(() => String)
	password: string;
}
