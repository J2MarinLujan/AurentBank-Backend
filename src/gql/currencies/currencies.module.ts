import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesResolver } from './currencies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { StatusModule } from '../status/status.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Currency]),
		StatusModule,
		CurrenciesModule,
	],
	providers: [CurrenciesResolver, CurrenciesService],
	exports: [CurrenciesService],
})
export class CurrenciesModule {}
