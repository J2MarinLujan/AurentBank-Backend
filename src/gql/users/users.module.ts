import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StatusModule } from '../status/status.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]), StatusModule],
	providers: [UsersResolver, UsersService],
	exports: [UsersService, UsersResolver],
})
export class UsersModule {}
