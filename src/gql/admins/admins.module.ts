import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsResolver } from './admins.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { StatusModule } from '../status/status.module';

@Module({
	imports: [TypeOrmModule.forFeature([Admin]), StatusModule],
	providers: [AdminsResolver, AdminsService],
	exports: [AdminsService, AdminsResolver],
})
export class AdminsModule {}
