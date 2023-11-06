import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateStatusInput {
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(25)
	@Field(() => String)
	name: string;
}
