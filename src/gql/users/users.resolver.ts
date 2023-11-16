import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { ValidRoles } from '../../common/enums/valid-roles.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { StatusService } from '../status/status.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Admin } from '../admins/entities/admin.entity';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
	constructor(
		private readonly usersService: UsersService,
		private readonly statusService: StatusService
	) {}

	@Query(() => [User], { name: 'users' })
	async findAll(@CurrentUser(ValidRoles.admin) admin: Admin): Promise<User[]> {
		const usersList = await this.usersService.findAll();
		return usersList.filter((user) => user.statusId !== 3);
	}

	@Query(() => User, { name: 'user' })
	async findOne(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) admin: Admin
	): Promise<User> {
		return await this.usersService.findOne(id);
	}

	@Mutation(() => User, { name: 'updateUser' })
	async update(
		@Args('updateUserInput') updateUserInput: UpdateUserInput,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<User> {
		const userById = await this.usersService.findOne(updateUserInput.id);
		if (!userById)
			throw new Error(`User with id: ${updateUserInput.id} not found`);
		return await this.usersService.update(updateUserInput.id, updateUserInput);
	}

	@Mutation(() => User, { name: 'deactivateUser' })
	async deactivate(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<User> {
		const userById = await this.usersService.findOne(id);
		if (!userById) throw new Error(`User with id: ${id} not found`);
		const status = await this.statusService.findOne(2);
		if (!status) throw new Error(`Status with id: 2 not found`);
		userById.statusId = status.id;
		userById.status = status;
		return await this.usersService.update(id, userById);
	}

	@Mutation(() => User, { name: 'blockUser' })
	async block(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<User> {
		const userById = await this.usersService.findOne(id);
		if (!userById) throw new Error(`User with id: ${id} not found`);
		const status = await this.statusService.findOne(3);
		if (!status) throw new Error(`Status with id: 3 not found`);
		userById.statusId = status.id;
		userById.status = status;
		return await this.usersService.update(id, userById);
	}
}
