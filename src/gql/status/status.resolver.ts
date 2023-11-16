import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StatusService } from './status.service';
import { Status } from './entities/status.entity';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ValidRoles } from '../../common/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Admin } from '../admins/entities/admin.entity';

@Resolver(() => Status)
@UseGuards(JwtAuthGuard)
export class StatusResolver {
	constructor(private readonly statusService: StatusService) {}

	@Mutation(() => Status, { name: 'createStatus' })
	async create(
		@Args('createStatusInput') createStatusInput: CreateStatusInput,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<Status> {
		const status = await this.statusService.findOneByName(
			createStatusInput.name
		);
		if (status)
			throw new Error(
				`Status with name: ${createStatusInput.name}, already exists`
			);
		return await this.statusService.create(createStatusInput);
	}

	@Query(() => [Status], { name: 'allStatus' })
	async findAll(@CurrentUser(ValidRoles.user) user: User): Promise<Status[]> {
		return await this.statusService.findAll();
	}

	@Query(() => Status, { name: 'status' })
	async findOne(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) admin: Admin
	): Promise<Status> {
		return await this.statusService.findOne(id);
	}

	@Mutation(() => Status, { name: 'updateStatus' })
	async update(
		@Args('updateStatusInput') updateStatusInput: UpdateStatusInput,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<Status> {
		const statusById = await this.statusService.findOne(updateStatusInput.id);
		if (!statusById)
			throw new Error(`Status with id: ${updateStatusInput.id}, not found`);
		const statusByName = await this.statusService.findOneByName(
			updateStatusInput.name
		);
		if (statusByName)
			throw new Error(
				`Status with name: ${updateStatusInput.name}, already exists`
			);
		return await this.statusService.update(
			updateStatusInput.id,
			updateStatusInput
		);
	}
}
