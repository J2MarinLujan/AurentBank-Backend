import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateWalletsTypeInput {
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(20)
	@Field()
	name: string;
}
