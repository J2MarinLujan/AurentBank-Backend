import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsStrongPassword,
	MaxLength,
	MinLength,
} from 'class-validator';
import { Field } from '@nestjs/graphql';
import { ValidRoles } from '../../common/enums/valid-roles.enum';

export class SignupAdminDto {
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

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(30)
	@Field(() => String)
	username: string;

	@IsNotEmpty()
	@IsStrongPassword()
	@Field(() => String)
	password: string;

	@IsOptional()
	@IsEnum(ValidRoles)
	@Field(() => ValidRoles, { nullable: true })
	role?: ValidRoles;
}
