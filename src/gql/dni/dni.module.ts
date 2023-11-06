import { Module } from '@nestjs/common';
import { DniService } from './dni.service';
import { DniResolver } from './dni.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dni } from './entities/dni.entity';
import { UsersModule } from '../users/users.module';
import { StatusModule } from '../status/status.module';

@Module({
	imports: [TypeOrmModule.forFeature([Dni]), UsersModule, StatusModule],
	providers: [DniResolver, DniService],
	exports: [DniService],
})
export class DniModule {}
