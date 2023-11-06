import {
	createParamDecorator,
	ExecutionContext,
	ForbiddenException,
	InternalServerErrorException,
} from '@nestjs/common';
import { ValidRoles } from '../../common/enums/valid-roles.enum';
import { User } from '../../gql/users/entities/user.entity';

export const ActiveUser = createParamDecorator(
	(role: ValidRoles, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user: User = request.user;
		if (!user) {
			throw new InternalServerErrorException('No user inside the request');
		}
		if (role === undefined) return user;
		if (user.role === ValidRoles.admin) return user;
		if (role === user.role) return user;
		throw new ForbiddenException('User need a valid role');
	}
);
