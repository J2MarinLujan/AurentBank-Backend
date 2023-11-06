import { CreateWalletsTypeInput } from './create-wallets-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWalletsTypeInput extends PartialType(
	CreateWalletsTypeInput
) {
	@Field(() => Int)
	id: number;
}
