import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminsService } from './admins.service';
import { Admin } from './entities/admin.entity';
import { UpdateAdminInput } from './dto/update-admin.input';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ValidRoles } from '../../common/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { StatusService } from '../status/status.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Resolver(() => Admin)
@UseGuards(JwtAuthGuard)
export class AdminsResolver {
	constructor(
		private readonly adminsService: AdminsService,
		private readonly statusService: StatusService
	) {}

	@Query(() => [Admin], { name: 'admins' })
	async findAll(@CurrentUser(ValidRoles.admin) admin: Admin): Promise<Admin[]> {
		const adminsList = await this.adminsService.findAll();
		return adminsList.filter((admin) => admin.statusId !== 3);
	}

	@Query(() => Admin, { name: 'admin' })
	async findOne(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) admin: Admin
	): Promise<Admin> {
		return await this.adminsService.findOne(id);
	}

	@Mutation(() => Admin, { name: 'updateAdmin' })
	async update(
		@Args('updateAdminInput') updateAdminInput: UpdateAdminInput,
		@CurrentUser(ValidRoles.admin) admin: Admin
	): Promise<Admin> {
		const adminById = await this.adminsService.findOne(updateAdminInput.id);
		if (!adminById)
			throw new Error(`Admin with id: ${updateAdminInput.id} not found`);
		return await this.adminsService.update(
			updateAdminInput.id,
			updateAdminInput
		);
	}

	@Mutation(() => Admin, { name: 'signupAdmin' })
	async deactivate(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<Admin> {
		const adminById = await this.adminsService.findOne(id);
		if (!adminById) throw new Error(`Admin with id: ${id} not found`);
		const status = await this.statusService.findOne(2);
		if (!status) throw new Error(`Status with id: 2 not found`);
		adminById.statusId = status.id;
		adminById.status = status;
		return await this.adminsService.update(id, adminById);
	}

	@Mutation(() => Admin, { name: 'blockAdmin' })
	async block(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.super) user: User
	): Promise<Admin> {
		const adminById = await this.adminsService.findOne(id);
		if (!adminById) throw new Error(`Admin with id: ${id} not found`);
		const status = await this.statusService.findOne(3);
		if (!status) throw new Error(`Status with id: 3 not found`);
		adminById.statusId = status.id;
		adminById.status = status;
		return await this.adminsService.update(id, adminById);
	}
}
