import { Injectable } from '@nestjs/common';
import { CreateWalletInput } from './dto/create-wallet.input';
import { UpdateWalletInput } from './dto/update-wallet.input';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WalletsService {
	constructor(
		@InjectRepository(Wallet)
		private readonly walletsRepository: Repository<Wallet>
	) {}

	async create(createWalletInput: CreateWalletInput) {
		const wallet = this.walletsRepository.create(createWalletInput);
		return await this.walletsRepository.save(wallet);
	}

	async findAll(): Promise<Wallet[]> {
		const walletsList = await this.walletsRepository.find({
			relations: {
				withdrawals: true,
				deposits: true,
				currency: true,
				status: true,
				dni: true,
			},
		});
		return walletsList.filter((wallet) => wallet.statusId !== 3);
	}

	async findOne(id: number) {
		return await this.walletsRepository.findOne({
			where: {
				id,
			},
		});
	}

	async update(id: number, updateWalletInput: UpdateWalletInput) {
		const wallet = await this.walletsRepository.preload({
			...updateWalletInput,
			id,
		});
		return await this.walletsRepository.save(wallet);
	}

	async recharge(id: number, amount: number): Promise<Wallet> {
		const wallet = await this.findOne(id);
		wallet.balance = parseFloat(wallet.balance.toString());
		wallet.balance += amount;
		return await this.walletsRepository.save(wallet);
	}
}
