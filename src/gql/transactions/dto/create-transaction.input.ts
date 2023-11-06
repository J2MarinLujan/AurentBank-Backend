import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsString,
	MaxLength,
} from 'class-validator';

@InputType()
export class CreateTransactionInput {
	@IsNumber()
	@IsNotEmpty()
	@Field(() => Float)
	amount: number;

	@IsString()
	@MaxLength(100)
	@IsNotEmpty()
	@Field(() => String)
	description: string;

	@IsInt()
	@IsNotEmpty()
	@Field(() => Int)
	walletFromId: number;

	@IsInt()
	@IsNotEmpty()
	@Field(() => Int)
	walletToId: number;
}
