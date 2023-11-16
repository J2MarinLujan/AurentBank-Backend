import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DniTypeService } from './dni-type.service';
import { DniType } from './entities/dni-type.entity';
import { CreateDniTypeInput } from './dto/create-dni-type.input';
import { UpdateDniTypeInput } from './dto/update-dni-type.input';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ValidRoles } from '../../../common/enums/valid-roles.enum';
import { User } from '../../users/entities/user.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Admin } from '../../admins/entities/admin.entity';

@Resolver(() => DniType)
@UseGuards(JwtAuthGuard)
export class DniTypeResolver {
	constructor(private readonly dniTypeService: DniTypeService) {}

	@Mutation(() => DniType, { name: 'createDniType' })
	async create(
		@Args('createDniTypeInput') createDniTypeInput: CreateDniTypeInput,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<DniType> {
		const dniTypeByName = await this.dniTypeService.findOneByName(
			createDniTypeInput.name
		);
		if (dniTypeByName) {
			throw new Error('Dni type already exists');
		}
		const dniTypeByAbbreviation =
			await this.dniTypeService.findOneByAbbreviation(
				createDniTypeInput.abbreviation
			);
		if (dniTypeByAbbreviation) {
			throw new Error('Dni type already exists');
		}
		return await this.dniTypeService.create(createDniTypeInput);
	}

	@Query(() => [DniType], { name: 'dniTypes' })
	async findAll(@CurrentUser(ValidRoles.user) user: User): Promise<DniType[]> {
		return await this.dniTypeService.findAll();
	}

	@Query(() => DniType, { name: 'dniType' })
	async findOne(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) admin: Admin
	): Promise<DniType> {
		return await this.dniTypeService.findOne(id);
	}

	@Mutation(() => DniType, { name: 'updateDniType' })
	async update(
		@Args('updateDniTypeInput') updateDniTypeInput: UpdateDniTypeInput,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<DniType> {
		const dniTypeById = await this.dniTypeService.findOne(
			updateDniTypeInput.id
		);
		if (!dniTypeById) {
			throw new Error(`DniType with id: ${updateDniTypeInput.id}, not found`);
		}
		const dniTypeByName = await this.dniTypeService.findOneByName(
			updateDniTypeInput.name
		);
		if (dniTypeByName) {
			throw new Error(
				`DniType with name: ${updateDniTypeInput.name}, already exists`
			);
		}
		const dniTypeByAbbreviation =
			await this.dniTypeService.findOneByAbbreviation(
				updateDniTypeInput.abbreviation
			);
		if (dniTypeByAbbreviation)
			throw new Error(
				`DniType with abbreviation: ${updateDniTypeInput.abbreviation}, already exists`
			);
		return await this.dniTypeService.update(
			updateDniTypeInput.id,
			updateDniTypeInput
		);
	}
}
