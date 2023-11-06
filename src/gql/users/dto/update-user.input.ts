import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsStrongPassword,
} from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
	@IsInt()
	@IsNotEmpty()
	@Field(() => Int)
	id: number;

	@IsStrongPassword()
	@Field(() => String)
	password: string;

	@IsOptional()
	@IsStrongPassword()
	@Field(() => String, { nullable: true })
	newPassword?: string;
}
