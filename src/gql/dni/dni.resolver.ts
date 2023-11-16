import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DniService } from './dni.service';
import { Dni } from './entities/dni.entity';
import { CreateDniInput } from './dto/create-dni.input';
import { UpdateDniInput } from './dto/update-dni.input';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ValidRoles } from '../../common/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { StatusService } from '../status/status.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Admin } from '../admins/entities/admin.entity';

@Resolver(() => Dni)
@UseGuards(JwtAuthGuard)
export class DniResolver {
	constructor(
		private readonly dniService: DniService,
		private readonly usersService: UsersService,
		private readonly statusService: StatusService
	) {}

	@Mutation(() => Dni, { name: 'createDni' })
	async create(
		@Args('createDniInput') createDniInput: CreateDniInput,
		@CurrentUser(ValidRoles.user) user: User
	): Promise<Dni> {
		const userToUpdate = await this.usersService.findOne(createDniInput.userId);
		if (!userToUpdate)
			throw new Error(`User with id: ${createDniInput.userId}, not found`);
		const dni = await this.dniService.findOneByNumber(createDniInput.number);
		if (dni)
			throw new Error(
				`Dni with number: ${createDniInput.number}, already exists`
			);
		const dniCreated = await this.dniService.create(createDniInput);
		if (!dniCreated) throw new Error('Dni not created');
		await this.usersService.addDni(userToUpdate.id, dniCreated);
		return dniCreated;
	}

	@Query(() => [Dni], { name: 'documents' })
	async findAll(@CurrentUser(ValidRoles.admin) admin: Admin): Promise<Dni[]> {
		const dniList = await this.dniService.findAll();
		return dniList.filter((dni) => dni.statusId !== 3);
	}

	@Query(() => Dni, { name: 'dni' })
	async findOne(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) admin: Admin
	): Promise<Dni> {
		return await this.dniService.findOne(id);
	}

	@Mutation(() => Dni, { name: 'updateDni' })
	async update(
		@Args('updateDniInput') updateDniInput: UpdateDniInput,
		@CurrentUser(ValidRoles.user) user: User
	): Promise<Dni> {
		const dniById = await this.dniService.findOne(updateDniInput.id);
		if (!dniById)
			throw new Error(`Dni with id: ${updateDniInput.id}, not found`);
		const dniByNumber = await this.dniService.findOneByNumber(
			updateDniInput.number
		);
		if (dniByNumber)
			throw new Error(
				`Dni with number: ${updateDniInput.number}, already exists`
			);
		return await this.dniService.update(updateDniInput.id, updateDniInput);
	}

	@Mutation(() => Dni, { name: 'deactivateDni' })
	async deactivate(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<Dni> {
		const dniToDeactivate = await this.dniService.findOne(id);
		if (!dniToDeactivate) throw new Error(`Dni with id: ${id}, not found`);
		const status = await this.statusService.findOne(2);
		if (!status) throw new Error('Status with id: 2, not found');
		dniToDeactivate.statusId = status.id;
		dniToDeactivate.status = status;
		return await this.dniService.update(id, dniToDeactivate);
	}

	@Mutation(() => Dni, { name: 'blockDni' })
	async block(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<Dni> {
		const dniToBlock = await this.dniService.findOne(id);
		if (!dniToBlock) throw new Error(`DNI with id: ${id}, not found`);
		const status = await this.statusService.findOne(3);
		if (!status) throw new Error('Status with id: 3, not found');
		dniToBlock.statusId = status.id;
		dniToBlock.status = status;
		return await this.dniService.update(id, dniToBlock);
	}
}
