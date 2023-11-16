import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { WalletsService } from './wallets.service';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletInput } from './dto/create-wallet.input';
import { UpdateWalletInput } from './dto/update-wallet.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ValidRoles } from '../../common/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { StatusService } from '../status/status.service';
import { DniService } from '../dni/dni.service';
import { Admin } from '../admins/entities/admin.entity';

@Resolver(() => Wallet)
@UseGuards(JwtAuthGuard)
export class WalletsResolver {
	constructor(
		private readonly walletsService: WalletsService,
		private readonly dniService: DniService,
		private readonly statusService: StatusService
	) {}

	@Mutation(() => Wallet, { name: 'createWallet' })
	async create(
		@Args('createWalletInput') createWalletInput: CreateWalletInput,
		@CurrentUser(ValidRoles.user) user: User
	): Promise<Wallet> {
		const dniSearched = await this.dniService.findOne(createWalletInput.dniId);
		if (!dniSearched)
			throw new Error(`Dni with id: ${createWalletInput.dniId}, not found`);
		return this.walletsService.create(createWalletInput);
	}

	@Query(() => [Wallet], { name: 'wallets' })
	async findAll(@CurrentUser(ValidRoles.admin) user: User): Promise<Wallet[]> {
		const walletsList = await this.walletsService.findAll();
		return walletsList.filter((wallet) => wallet.statusId !== 3);
	}

	@Query(() => Wallet, { name: 'wallet' })
	async findOne(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.user) user: User
	): Promise<Wallet> {
		return await this.walletsService.findOne(id);
	}

	@Mutation(() => Wallet, { name: 'updateWallet' })
	async update(
		@Args('updateWalletInput') updateWalletInput: UpdateWalletInput,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<Wallet> {
		const walletById = await this.walletsService.findOne(updateWalletInput.id);
		if (!walletById)
			throw new Error(`Wallet with id: ${updateWalletInput.id} not found`);
		return await this.walletsService.update(
			updateWalletInput.id,
			updateWalletInput
		);
	}

	@Mutation(() => Wallet, { name: 'rechargeWallet' })
	async recharge(
		@Args('id', { type: () => Int }) id: number,
		@Args('amount', { type: () => Float }) amount: number,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<Wallet> {
		const walletById = await this.walletsService.findOne(id);
		if (!walletById) throw new Error(`Wallet with id: ${id} not found`);
		if (walletById.statusId !== 1) throw new Error('Wallet is not active');
		return await this.walletsService.recharge(id, amount);
	}

	@Mutation(() => Wallet, { name: 'deactivateWallet' })
	async deactivate(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<Wallet> {
		const walletById = await this.walletsService.findOne(id);
		if (!walletById) throw new Error(`Wallet with id: ${id} not found`);
		const status = await this.statusService.findOne(2);
		if (!status) throw new Error(`Status with id: 2 not found`);
		walletById.statusId = status.id;
		walletById.status = status;
		return await this.walletsService.update(id, walletById);
	}

	@Mutation(() => Wallet, { name: 'blockWallet' })
	async block(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.super) admin: Admin
	): Promise<Wallet> {
		const walletById = await this.walletsService.findOne(id);
		if (!walletById) throw new Error(`Wallet with id: ${id} not found`);
		const status = await this.statusService.findOne(3);
		if (!status) throw new Error(`Status with id: 3 not found`);
		walletById.statusId = status.id;
		walletById.status = status;
		return await this.walletsService.update(id, walletById);
	}
}
