import { Field, InputType } from '@nestjs/graphql';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsStrongPassword,
	Length,
} from 'class-validator';

@InputType()
export class CreateUserInput {
	@IsString()
	@Length(2, 25)
	@IsNotEmpty()
	@Field(() => String)
	firstName: string;

	@IsString()
	@Length(2, 25)
	@IsOptional()
	@Field(() => String)
	secondName?: string;

	@IsString()
	@Length(2, 30)
	@IsNotEmpty()
	@Field(() => String)
	firstSurname: string;

	@IsString()
	@Length(2, 30)
	@IsOptional()
	@Field(() => String)
	secondSurname?: string;

	@IsEmail()
	@IsNotEmpty()
	@Field(() => String)
	email: string;

	@IsStrongPassword()
	@IsNotEmpty()
	@Field(() => String)
	password: string;

	@IsString()
	@IsNotEmpty()
	@Length(10, 10)
	@Field(() => String)
	phone: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 5)
	@Field(() => String)
	countryCode: string;
}
