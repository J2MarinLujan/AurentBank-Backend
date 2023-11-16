import { Field, ObjectType } from '@nestjs/graphql';
import { Admin } from '../../gql/admins/entities/admin.entity';
@ObjectType()
export class AdminResponse {
	@Field(() => String)
	token: string;

	@Field(() => Admin)
	admin: Admin;
}
