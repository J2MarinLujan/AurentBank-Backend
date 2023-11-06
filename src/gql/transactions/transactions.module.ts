import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { WalletsModule } from '../wallets/wallets.module';
import { DniModule } from '../dni/dni.module';

@Module({
	imports: [TypeOrmModule.forFeature([Transaction]), WalletsModule, DniModule],
	providers: [TransactionsResolver, TransactionsService],
	exports: [TransactionsService],
})
export class TransactionsModule {}
