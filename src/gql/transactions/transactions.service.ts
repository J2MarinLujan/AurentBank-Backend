import { Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionResponse } from './types/transaction-response.type';

@Injectable()
export class TransactionsService {
	constructor(
		@InjectRepository(Transaction)
		private readonly transactionsRepository: Repository<Transaction>,
		private readonly walletsService: WalletsService
	) {}

	async create(
		createTransactionInput: CreateTransactionInput
	): Promise<TransactionResponse> {
		const transactionToSave = this.transactionsRepository.create(
			createTransactionInput
		);
		const walletFrom = await this.walletsService.findOne(
			createTransactionInput.walletFromId
		);
		walletFrom.balance = parseFloat(walletFrom.balance.toString());
		walletFrom.balance -= createTransactionInput.amount;
		await this.walletsService.update(walletFrom.id, walletFrom);
		const walletTo = await this.walletsService.findOne(
			createTransactionInput.walletToId
		);
		walletTo.balance = parseFloat(walletTo.balance.toString());
		walletTo.balance += createTransactionInput.amount;
		await this.walletsService.update(walletTo.id, walletTo);
		const transaction =
			await this.transactionsRepository.save(transactionToSave);
		return {
			transaction,
			walletFrom,
			walletTo,
		};
	}

	async findAll(): Promise<Transaction[]> {
		return await this.transactionsRepository.find({
			relations: {
				walletFrom: true,
				walletTo: true,
			},
		});
	}

	async findOne(id: number): Promise<Transaction> {
		return await this.transactionsRepository.findOne({
			where: {
				id,
			},
		});
	}
}
