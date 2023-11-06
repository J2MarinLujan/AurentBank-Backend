import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	getRequest(ctx: ExecutionContext) {
		return (
			ctx.switchToHttp().getRequest() ||
			GqlExecutionContext.create(ctx).getContext().req
		);
	}
}
