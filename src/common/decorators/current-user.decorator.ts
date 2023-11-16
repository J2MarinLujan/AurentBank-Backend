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

		// switch (role) {
		// 	case undefined:
		// 		return user;
		// 	case ValidRoles.user:
		// 		if (
		// 			user.role === ValidRoles.user ||
		// 			user.role === ValidRoles.admin ||
		// 			user.role === ValidRoles.super ||
		// 			user.role === ValidRoles.root
		// 		)
		// 			return user;
		// 		throw new ForbiddenException('User need a valid role');
		// 	case ValidRoles.admin:
		// 		if (
		// 			user.role === ValidRoles.admin ||
		// 			user.role === ValidRoles.super ||
		// 			user.role === ValidRoles.root
		// 		)
		// 			return user;
		// 		throw new ForbiddenException('You need to have a role admin');
		// 	case ValidRoles.super:
		// 		if (user.role === ValidRoles.super || user.role === ValidRoles.root)
		// 			return user;
		// 		throw new ForbiddenException('You need to have a role super');
		//
		// 	case ValidRoles.root:
		// 		if (user.role === ValidRoles.root) return user;
		// 		throw new ForbiddenException('You need to have a role root');
		// 	default:
		// 		throw new ForbiddenException('User need a valid role');
		// }

		const rolePermissions: Record<ValidRoles, ValidRoles[]> = {
			[ValidRoles.root]: [ValidRoles.root],
			[ValidRoles.super]: [ValidRoles.super, ValidRoles.root],
			[ValidRoles.admin]: [ValidRoles.admin, ValidRoles.super, ValidRoles.root],
			[ValidRoles.user]: [
				ValidRoles.user,
				ValidRoles.admin,
				ValidRoles.super,
				ValidRoles.root,
			],
		};

		const allowedRoles = rolePermissions[role];

		if (!allowedRoles || !allowedRoles.includes(user.role)) {
			throw new ForbiddenException('User needs a valid role');
		}

		return user;
	}
);
