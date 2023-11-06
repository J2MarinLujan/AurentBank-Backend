import { Injectable } from '@nestjs/common';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class CountriesService {
	constructor(
		@InjectRepository(Country)
		private readonly countriesRepository: Repository<Country>,
		private readonly currenciesService: CurrenciesService
	) {}
	async create(createCountryInput: CreateCountryInput): Promise<Country> {
		const countryToSave = this.countriesRepository.create(createCountryInput);
		const currenciesList = [];
		for (const currencyId of createCountryInput.currenciesId) {
			const currencyFound = await this.currenciesService.findOne(currencyId);
			if (!currencyFound)
				throw new Error(`Currency with id: ${currencyId}, not found`);
			currenciesList.push(currencyFound);
		}
		countryToSave.currencies = currenciesList;
		return await this.countriesRepository.save(countryToSave);
	}

	async findAll(): Promise<Country[]> {
		const countriesList = await this.countriesRepository.find({
			relations: {
				currencies: true,
				documents: true,
				status: true,
			},
		});
		return countriesList.filter((country) => country.statusId !== 3);
	}

	async findOne(id: number): Promise<Country> {
		return await this.countriesRepository.findOne({
			where: {
				id,
			},
			relations: {
				currencies: true,
			},
		});
	}

	async update(
		id: number,
		updateCountryInput: UpdateCountryInput
	): Promise<Country> {
		let countryToUpdate = await this.findOne(id);
		const currenciesList = [];
		if (updateCountryInput.currenciesId) {
			for (const currencyId of updateCountryInput.currenciesId) {
				const currencyFound = await this.currenciesService.findOne(currencyId);
				if (!currencyFound)
					throw new Error(`Currency with id: ${currencyId}, not found`);
				currenciesList.push(currencyFound);
			}
			countryToUpdate = await this.countriesRepository.preload({
				...updateCountryInput,
				id,
				currencies: currenciesList,
			});
		} else {
			countryToUpdate = await this.countriesRepository.preload({
				...updateCountryInput,
				id,
			});
		}
		return await this.countriesRepository.save(countryToUpdate);
	}
}
