import { CreateAdminInput } from './create-admin.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsStrongPassword,
} from 'class-validator';

@InputType()
export class UpdateAdminInput extends PartialType(CreateAdminInput) {
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
