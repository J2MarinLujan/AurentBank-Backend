import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WalletsTypeService } from './wallets-type.service';
import { WalletsType } from './entities/wallets-type.entity';
import { CreateWalletsTypeInput } from './dto/create-wallets-type.input';
import { UpdateWalletsTypeInput } from './dto/update-wallets-type.input';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ValidRoles } from '../../../common/enums/valid-roles.enum';
import { User } from '../../users/entities/user.entity';

@Resolver(() => WalletsType)
@UseGuards(JwtAuthGuard)
export class WalletsTypeResolver {
	constructor(private readonly walletsTypeService: WalletsTypeService) {}

	@Mutation(() => WalletsType, { name: 'createWalletsType' })
	async create(
		@Args('createWalletsTypeInput')
		createWalletsTypeInput: CreateWalletsTypeInput,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<WalletsType> {
		const walletsTypeByName = await this.walletsTypeService.findOneByName(
			createWalletsTypeInput.name
		);
		if (walletsTypeByName) {
			throw new Error(
				`WalletType with name: ${createWalletsTypeInput.name}, already exists`
			);
		}
		return await this.walletsTypeService.create(createWalletsTypeInput);
	}

	@Query(() => [WalletsType], { name: 'walletsTypes' })
	async findAll(): Promise<WalletsType[]> {
		return await this.walletsTypeService.findAll();
	}

	@Query(() => WalletsType, { name: 'walletType' })
	async findOne(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.user) user: User
	): Promise<WalletsType> {
		return await this.walletsTypeService.findOne(id);
	}

	@Mutation(() => WalletsType, { name: 'updateWalletsType' })
	async update(
		@Args('updateWalletsTypeInput')
		updateWalletsTypeInput: UpdateWalletsTypeInput,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<WalletsType> {
		const walletsTypeById = await this.walletsTypeService.findOne(
			updateWalletsTypeInput.id
		);
		if (!walletsTypeById)
			throw new Error(
				`WalletType with id: ${updateWalletsTypeInput.id}, not found`
			);

		const walletsTypeByName = await this.walletsTypeService.findOneByName(
			updateWalletsTypeInput.name
		);
		if (walletsTypeByName)
			throw new Error(
				`WalletType with name: ${updateWalletsTypeInput.name}, already exists`
			);
		return await this.walletsTypeService.update(
			updateWalletsTypeInput.id,
			updateWalletsTypeInput
		);
	}
}
