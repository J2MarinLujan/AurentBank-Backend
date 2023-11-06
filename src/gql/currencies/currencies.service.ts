import { Injectable } from '@nestjs/common';
import { CreateCurrencyInput } from './dto/create-currency.input';
import { UpdateCurrencyInput } from './dto/update-currency.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrenciesService {
	constructor(
		@InjectRepository(Currency)
		private readonly currenciesRepository: Repository<Currency>
	) {}

	async create(createCurrencyInput: CreateCurrencyInput): Promise<Currency> {
		const currency = this.currenciesRepository.create(createCurrencyInput);
		return await this.currenciesRepository.save(currency);
	}

	async findAll(): Promise<Currency[]> {
		const currencyList = await this.currenciesRepository.find({
			relations: {
				wallets: true,
				countries: true,
			},
		});
		return currencyList.filter((currency) => currency.statusId !== 3);
	}

	async findOne(id: number): Promise<Currency> {
		return await this.currenciesRepository.findOne({
			where: {
				id,
			},
			relations: {
				countries: true,
			},
		});
	}

	async findOneByName(name: string): Promise<Currency> {
		return await this.currenciesRepository.findOne({
			where: {
				name,
			},
		});
	}

	async update(
		id: number,
		updateCurrencyInput: UpdateCurrencyInput
	): Promise<Currency> {
		const currency = await this.currenciesRepository.preload({
			...updateCurrencyInput,
			id,
		});
		return await this.currenciesRepository.save(currency);
	}
}
