import { CreateStatusInput } from './create-status.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateStatusInput extends PartialType(CreateStatusInput) {
	@IsNotEmpty()
	@IsInt()
	@Field(() => Int)
	id: number;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	isActive?: boolean;
}
