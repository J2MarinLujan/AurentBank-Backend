import { CreateDniInput } from './create-dni.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDniInput extends PartialType(CreateDniInput) {
	@Field(() => Int)
	id: number;
}
