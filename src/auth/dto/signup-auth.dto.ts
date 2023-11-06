import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsStrongPassword,
	Length,
	MaxLength,
	MinLength,
} from 'class-validator';
import { Field } from '@nestjs/graphql';

export class SignupAuthDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	@MaxLength(25)
	@Field(() => String)
	firstName: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(25)
	@Field(() => String)
	secondName?: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	@MaxLength(30)
	@Field(() => String)
	firstSurname: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(30)
	@Field(() => String)
	secondSurname?: string;

	@IsNotEmpty()
	@IsEmail()
	@Field(() => String)
	email: string;

	@IsNotEmpty()
	@IsStrongPassword()
	@Field(() => String)
	password: string;

	@IsNotEmpty()
	@IsString()
	@Length(10, 10)
	@Field(() => String)
	phone: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 5)
	@Field(() => String)
	countryCode: string;
}
