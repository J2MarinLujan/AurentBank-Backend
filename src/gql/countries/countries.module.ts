import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesResolver } from './countries.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusModule } from '../status/status.module';
import { Country } from './entities/country.entity';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Country]),
		StatusModule,
		CurrenciesModule,
	],
	providers: [CountriesResolver, CountriesService],
	exports: [CountriesService],
})
export class CountriesModule {}
