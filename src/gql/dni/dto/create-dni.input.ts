import { InputType, Int, Field } from '@nestjs/graphql';
import { dateScalar } from '../../../scalars/date.scalar';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateDniInput {
	@IsInt()
	@Field(() => Int)
	userId: number;

	@IsInt()
	@Field(() => Int)
	typeId: number;

	@IsInt()
	@Field(() => Int)
	number: number;

	@IsDate()
	@Field(() => dateScalar)
	birth: Date;

	@IsDate()
	@Field(() => dateScalar)
	expeditionDate: Date;

	@IsString()
	@Field(() => String)
	expeditionPlace: string;

	@IsDate()
	@IsOptional()
	@Field(() => dateScalar, { nullable: true })
	expiresOn?: Date;

	@IsInt()
	@Field(() => Int)
	nationalityId: number;
}
