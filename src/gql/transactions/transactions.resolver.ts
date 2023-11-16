import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ValidRoles } from '../../common/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionResponse } from './types/transaction-response.type';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Resolver(() => Transaction)
@UseGuards(JwtAuthGuard)
export class TransactionsResolver {
	constructor(
		private readonly transactionsService: TransactionsService,
		private readonly walletsService: WalletsService
	) {}

	@Mutation(() => TransactionResponse, { name: 'createTransaction' })
	async create(
		@Args('createTransactionInput')
		createTransactionInput: CreateTransactionInput,
		@CurrentUser(ValidRoles.user) user: User
	): Promise<TransactionResponse> {
		const walletFrom = await this.walletsService.findOne(
			createTransactionInput.walletFromId
		);
		if (!walletFrom)
			throw new Error(
				`Sender with id: ${createTransactionInput.walletFromId}, not found`
			);
		if (walletFrom.statusId !== 1)
			throw new Error('Sender wallet is not active');
		if (
			walletFrom.balance > 0 &&
			walletFrom.balance < createTransactionInput.amount
		)
			throw new Error('Insufficient funds');
		if (user.dniId !== walletFrom.dniId)
			throw new Error('You are not the owner of this wallet');
		const walletTo = await this.walletsService.findOne(
			createTransactionInput.walletToId
		);
		if (!walletTo)
			throw new Error(
				`Recipient with id: ${createTransactionInput.walletToId}, not found`
			);
		if (walletTo.statusId === 3) throw new Error('Recipient wallet is blocked');
		return this.transactionsService.create(createTransactionInput);
	}

	@Query(() => [Transaction], { name: 'transactions' })
	findAll(@CurrentUser(ValidRoles.admin) user: User): Promise<Transaction[]> {
		return this.transactionsService.findAll();
	}

	@Query(() => Transaction, { name: 'transaction' })
	findOne(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.user) user: User
	): Promise<Transaction> {
		return this.transactionsService.findOne(id);
	}
}
