import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateCurrencyInput {
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(25)
	@Field(() => String)
	name: string;

	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(3)
	@Field(() => String)
	codIso: string;
}
