import {
	createParamDecorator,
	ExecutionContext,
	ForbiddenException,
	InternalServerErrorException,
} from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from '../../gql/users/entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
	(role: ValidRoles, context: ExecutionContext) => {
		const ctx = GqlExecutionContext.create(context);
		const user: User = ctx.getContext().req.user;
		if (!user) {
			throw new InternalServerErrorException('No user inside the request');
		}
		if (role === undefined) return user;
		if (user.role === ValidRoles.admin) return user;
		if (role === user.role) return user;
		throw new ForbiddenException('User need a valid role');
	}
);
