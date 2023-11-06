import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CurrenciesService } from './currencies.service';
import { Currency } from './entities/currency.entity';
import { CreateCurrencyInput } from './dto/create-currency.input';
import { UpdateCurrencyInput } from './dto/update-currency.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ValidRoles } from '../../common/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { StatusService } from '../status/status.service';

@Resolver(() => Currency)
@UseGuards(JwtAuthGuard)
export class CurrenciesResolver {
	constructor(
		private readonly currenciesService: CurrenciesService,
		private readonly statusService: StatusService
	) {}

	@Mutation(() => Currency, { name: 'createCurrency' })
	async create(
		@Args('createCurrencyInput') createCurrencyInput: CreateCurrencyInput,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<Currency> {
		const currency = await this.currenciesService.findOneByName(
			createCurrencyInput.name
		);
		if (currency)
			throw new Error(
				`Currency with name: ${createCurrencyInput.name}, already exists`
			);
		return await this.currenciesService.create(createCurrencyInput);
	}

	@Query(() => [Currency], { name: 'currencies' })
	async findAll(@CurrentUser(ValidRoles.user) user: User): Promise<Currency[]> {
		return await this.currenciesService.findAll();
	}

	@Query(() => Currency, { name: 'currency' })
	async findOne(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<Currency> {
		const currency = await this.currenciesService.findOne(id);
		if (!currency) throw new Error(`Currency with id: ${id}, not found`);
		return currency;
	}

	@Mutation(() => Currency, { name: 'updateCurrency' })
	async update(
		@Args('updateCurrencyInput') updateCurrencyInput: UpdateCurrencyInput,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<Currency> {
		const currency = await this.currenciesService.findOne(
			updateCurrencyInput.id
		);
		if (!currency)
			throw new Error(`Currency with id: ${updateCurrencyInput.id}, not found`);
		const currency2 = await this.currenciesService.findOneByName(
			updateCurrencyInput.name
		);
		if (currency2)
			throw new Error(
				`Currency with name: ${updateCurrencyInput.name}, already exists`
			);
		return await this.currenciesService.update(
			updateCurrencyInput.id,
			updateCurrencyInput
		);
	}

	@Mutation(() => Currency, { name: 'deactivateCurrency' })
	async deactivate(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<Currency> {
		const currencyToDeactivate = await this.currenciesService.findOne(id);
		if (!currencyToDeactivate)
			throw new Error(`Currency with id: ${id}, not found`);
		const status = await this.statusService.findOne(2);
		if (!status) throw new Error(`Status with id: 2, not found`);
		currencyToDeactivate.statusId = status.id;
		currencyToDeactivate.status = status;
		return await this.currenciesService.update(id, currencyToDeactivate);
	}

	@Mutation(() => Currency, { name: 'blockCurrency' })
	async block(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser(ValidRoles.admin) user: User
	): Promise<Currency> {
		const currencyToBlock = await this.currenciesService.findOne(id);
		if (!currencyToBlock) throw new Error(`Currency with id: ${id}, not found`);
		const status = await this.statusService.findOne(3);
		if (!status) throw new Error(`Status with id: 3, not found`);
		currencyToBlock.statusId = status.id;
		currencyToBlock.status = status;
		return await this.currenciesService.update(id, currencyToBlock);
	}
}
