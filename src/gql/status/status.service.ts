import { Injectable } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusService {
	constructor(
		@InjectRepository(Status)
		private readonly statusRepository: Repository<Status>
	) {}

	async create(createStatusInput: CreateStatusInput): Promise<Status> {
		const statusToSave = this.statusRepository.create(createStatusInput);
		return await this.statusRepository.save(statusToSave);
	}

	async findAll(): Promise<Status[]> {
		return await this.statusRepository.find({
			relations: {
				users: true,
				wallets: true,
				documents: true,
				currencies: true,
			},
		});
	}

	async findOne(id: number): Promise<Status> {
		return await this.statusRepository.findOne({
			where: {
				id,
			},
		});
	}

	async findOneByName(name: string): Promise<Status> {
		return await this.statusRepository.findOne({
			where: {
				name,
			},
		});
	}

	async update(
		id: number,
		updateStatusInput: UpdateStatusInput
	): Promise<Status> {
		const statusToUpdate = await this.statusRepository.preload({
			...updateStatusInput,
			id,
		});
		return await this.statusRepository.save(statusToUpdate);
	}
}
