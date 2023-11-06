import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Length, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateDniTypeInput {
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(25)
	@Field(() => String)
	name: string;

	@IsNotEmpty()
	@Length(2)
	@Field(() => String)
	abbreviation: string;
}
