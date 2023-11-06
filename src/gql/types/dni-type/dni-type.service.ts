import { Injectable } from '@nestjs/common';
import { CreateDniTypeInput } from './dto/create-dni-type.input';
import { UpdateDniTypeInput } from './dto/update-dni-type.input';
import { DniType } from './entities/dni-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DniTypeService {
	constructor(
		@InjectRepository(DniType)
		private readonly dniTypeRepository: Repository<DniType>
	) {}
	async create(createDniTypeInput: CreateDniTypeInput): Promise<DniType> {
		const dniTypeToSave = this.dniTypeRepository.create(createDniTypeInput);
		return await this.dniTypeRepository.save(dniTypeToSave);
	}

	async findAll(): Promise<DniType[]> {
		return await this.dniTypeRepository.find({
			relations: {
				documents: true,
			},
		});
	}

	async findOne(id: number): Promise<DniType> {
		return await this.dniTypeRepository.findOne({
			where: {
				id,
			},
		});
	}

	async findOneByName(name: string): Promise<DniType> {
		return await this.dniTypeRepository.findOne({
			where: {
				name,
			},
		});
	}

	async findOneByAbbreviation(abbreviation: string): Promise<DniType> {
		return await this.dniTypeRepository.findOne({
			where: {
				abbreviation,
			},
		});
	}

	async update(
		id: number,
		updateDniTypeInput: UpdateDniTypeInput
	): Promise<DniType> {
		const dniTypeToUpdate = await this.dniTypeRepository.preload({
			...updateDniTypeInput,
			id,
		});
		return await this.dniTypeRepository.save(dniTypeToUpdate);
	}
}
