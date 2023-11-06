import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateWalletInput {
	@IsInt()
	@IsNotEmpty()
	@Field(() => Int)
	dniId: number;

	@IsInt()
	@IsNotEmpty()
	@Field(() => Int)
	currencyId: number;

	@IsInt()
	@IsNotEmpty()
	@Field(() => Int)
	typeId: number;
}
