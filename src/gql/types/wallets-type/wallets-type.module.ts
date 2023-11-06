import { Module } from '@nestjs/common';
import { WalletsTypeService } from './wallets-type.service';
import { WalletsTypeResolver } from './wallets-type.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsType } from './entities/wallets-type.entity';

@Module({
	imports: [TypeOrmModule.forFeature([WalletsType])],
	providers: [WalletsTypeResolver, WalletsTypeService],
	exports: [WalletsTypeService],
})
export class WalletsTypeModule {}
