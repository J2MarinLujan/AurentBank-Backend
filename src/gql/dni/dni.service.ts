import { Injectable } from '@nestjs/common';
import { CreateDniInput } from './dto/create-dni.input';
import { UpdateDniInput } from './dto/update-dni.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Dni } from './entities/dni.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DniService {
	constructor(
		@InjectRepository(Dni) private readonly dniRepository: Repository<Dni>
	) {}

	async create(createDniInput: CreateDniInput): Promise<Dni> {
		const birthDate = new Date(createDniInput.birth);
		const expeditionDate = new Date(createDniInput.expeditionDate);

		// Aumentar un día a la fecha de nacimiento (birthDate)
		birthDate.setDate(birthDate.getDate() + 1);

		// Aumentar un día a la fecha de expedición (expeditionDate)
		expeditionDate.setDate(expeditionDate.getDate() + 1);

		// Crear el objeto Dni con las fechas actualizadas
		createDniInput.birth = birthDate;
		createDniInput.expeditionDate = expeditionDate;
		const userToSave = this.dniRepository.create(createDniInput);
		return await this.dniRepository.save(userToSave);
	}

	async findAll(): Promise<Dni[]> {
		const dniList = await this.dniRepository.find({
			relations: {
				wallets: true,
				type: true,
				status: true,
				user: true,
			},
		});
		return dniList.filter((dni) => dni.statusId !== 3);
	}

	async findOne(id: number): Promise<Dni> {
		return this.dniRepository.findOne({
			where: { id },
		});
	}

	async findOneByNumber(number: number): Promise<Dni> {
		return this.dniRepository.findOne({
			where: { number },
		});
	}

	async update(id: number, updateDniInput: UpdateDniInput): Promise<Dni> {
		const dni = await this.dniRepository.preload({ ...updateDniInput, id });
		return await this.dniRepository.save(dni);
	}
}
