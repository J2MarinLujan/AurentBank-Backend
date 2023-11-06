import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsResolver } from './wallets.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { StatusModule } from '../status/status.module';
import { DniModule } from '../dni/dni.module';

@Module({
	imports: [TypeOrmModule.forFeature([Wallet]), DniModule, StatusModule],
	providers: [WalletsResolver, WalletsService],
	exports: [WalletsService],
})
export class WalletsModule {}
