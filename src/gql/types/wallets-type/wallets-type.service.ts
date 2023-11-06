import { Injectable } from '@nestjs/common';
import { CreateWalletsTypeInput } from './dto/create-wallets-type.input';
import { UpdateWalletsTypeInput } from './dto/update-wallets-type.input';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsType } from './entities/wallets-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletsTypeService {
	constructor(
		@InjectRepository(WalletsType)
		private readonly walletsTypeRepository: Repository<WalletsType>
	) {}
	async create(
		createWalletsTypeInput: CreateWalletsTypeInput
	): Promise<WalletsType> {
		const walletTypeToSave = this.walletsTypeRepository.create(
			createWalletsTypeInput
		);
		return await this.walletsTypeRepository.save(walletTypeToSave);
	}

	async findAll(): Promise<WalletsType[]> {
		return await this.walletsTypeRepository.find({
			relations: {
				wallets: true,
			},
		});
	}

	async findOne(id: number): Promise<WalletsType> {
		return await this.walletsTypeRepository.findOne({
			where: {
				id,
			},
		});
	}

	async findOneByName(name: string): Promise<WalletsType> {
		return await this.walletsTypeRepository.findOne({
			where: {
				name,
			},
		});
	}

	async update(
		id: number,
		updateWalletsTypeInput: UpdateWalletsTypeInput
	): Promise<WalletsType> {
		const walletTypeToUpdate = await this.walletsTypeRepository.preload({
			...updateWalletsTypeInput,
			id,
		});
		return this.walletsTypeRepository.save(walletTypeToUpdate);
	}
}
