import { Module } from '@nestjs/common';
import { DniTypeService } from './dni-type.service';
import { DniTypeResolver } from './dni-type.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DniType } from './entities/dni-type.entity';

@Module({
	imports: [TypeOrmModule.forFeature([DniType])],
	providers: [DniTypeResolver, DniTypeService],
	exports: [DniTypeService],
})
export class DniTypeModule {}
