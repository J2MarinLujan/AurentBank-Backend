import { ValidRoles } from '../../../common/enums/valid-roles.enum';
import { IsString } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ValidRoleArgs {
	@IsString()
	@Field(() => ValidRoles, { nullable: true })
	role: ValidRoles;
}
