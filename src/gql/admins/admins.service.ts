import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAdminInput } from './dto/update-admin.input';
import { compareSync, hashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { SignupAdminDto } from '../../auth/dto/signup-admin.dto';

@Injectable()
export class AdminsService {
	constructor(
		@InjectRepository(Admin)
		private readonly adminsRepository: Repository<Admin>
	) {}
	async create(signupAdminDto: SignupAdminDto): Promise<Admin> {
		const admin = this.adminsRepository.create({
			...signupAdminDto,
			password: hashSync(signupAdminDto.password, 10),
		});
		return await this.adminsRepository.save(admin);
	}

	async findAll(): Promise<Admin[]> {
		return await this.adminsRepository.find({
			relations: {
				status: true,
			},
		});
	}

	async findOne(id: number): Promise<Admin> {
		return await this.adminsRepository.findOne({
			where: { id },
		});
	}

	async findOneByUsername(username: string): Promise<Admin> {
		return await this.adminsRepository.findOne({
			where: { username },
		});
	}

	async update(id: number, updateAdminInput: UpdateAdminInput) {
		let admin = await this.findOne(id);
		if (!admin) throw new Error(`Admin with id: ${id}, not found`);
		const checkPassword = compareSync(
			updateAdminInput.password,
			admin.password
		);
		if (!checkPassword) throw new UnauthorizedException('Password incorrect');
		if (updateAdminInput.newPassword) {
			const newPassword = hashSync(updateAdminInput.newPassword, 10);
			admin = await this.adminsRepository.preload({
				...updateAdminInput,
				id,
				password: newPassword,
			});
		} else {
			admin = await this.adminsRepository.preload({
				...updateAdminInput,
				id,
				password: admin.password,
			});
		}
		return await this.adminsRepository.save(admin);
	}
}
