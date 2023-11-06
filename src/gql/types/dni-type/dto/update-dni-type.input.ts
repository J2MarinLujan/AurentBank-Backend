import { CreateDniTypeInput } from './create-dni-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDniTypeInput extends PartialType(CreateDniTypeInput) {
	@Field(() => Int)
	id: number;
}
