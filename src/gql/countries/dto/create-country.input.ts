import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateCountryInput {
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(25)
	@Field(() => String)
	name: string;

	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(3)
	@Field(() => String)
	isoCodeMain: string;

	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(2)
	@Field(() => String)
	isoCodeSecond: string;

	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(5)
	@Field(() => String)
	code: string;

	@IsNotEmpty()
	@Field(() => [Int])
	currenciesId: number[];
}
