import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ValidRoles } from '../../common/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { StatusService } from '../status/status.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Country)
@UseGuards(JwtAuthGuard)
export class CountriesResolver {
	constructor(
		private readonly countriesService: CountriesService,
		private readonly statusService: StatusService
	) {}

	@Mutation(() => Country, { name: 'createCountry' })
	async create(
		@Args('createCountryInput') createCountryInput: CreateCountryInput
	): Promise<Country> {
		return await this.countriesService.create(createCountryInput);
	}

	@Query(() => [Country], { name: 'countries' })
	async findAll(): Promise<Country[]> {
		return await this.countriesService.findAll();
	}

	@Query(() => Country, { name: 'country' })
	async findOne(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<Country> {
		return await this.countriesService.findOne(id);
	}

	@Mutation(() => Country, { name: 'updateCountry' })
	async update(
		@Args('updateCountryInput') updateCountryInput: UpdateCountryInput,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<Country> {
		const country = await this.countriesService.findOne(updateCountryInput.id);
		if (!country)
			throw new Error(`Country with id: ${updateCountryInput.id}, not found`);
		return await this.countriesService.update(
			updateCountryInput.id,
			updateCountryInput
		);
	}

	@Mutation(() => Country, { name: 'deactivateCountry' })
	async deactivate(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<Country> {
		const countryToDeactivate = await this.countriesService.findOne(id);
		if (!countryToDeactivate)
			throw new Error(`Country with id: ${id}, not found`);
		const status = await this.statusService.findOne(2);
		if (!status) throw new Error(`Status with id: 2, not found`);
		countryToDeactivate.statusId = status.id;
		countryToDeactivate.status = status;
		return await this.countriesService.update(id, countryToDeactivate);
	}

	@Mutation(() => Country, { name: 'blockCountry' })
	async block(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<Country> {
		const countryToBlock = await this.countriesService.findOne(id);
		if (!countryToBlock) throw new Error(`Country with id: ${id}, not found`);
		const status = await this.statusService.findOne(3);
		if (!status) throw new Error(`Status with id: 3, not found`);
		countryToBlock.statusId = status.id;
		countryToBlock.status = status;
		return await this.countriesService.update(id, countryToBlock);
	}
}
