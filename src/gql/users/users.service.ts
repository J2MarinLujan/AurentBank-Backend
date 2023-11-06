import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { SignupAuthDto } from '../../auth/dto/signup-auth.dto';
import { Dni } from '../dni/entities/dni.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly usersRepository: Repository<User>
	) {}
	async create(signupAuthDto: SignupAuthDto): Promise<User> {
		const user = this.usersRepository.create({
			...signupAuthDto,
			password: hashSync(signupAuthDto.password, 10),
		});
		return await this.usersRepository.save(user);
	}

	async findAll(): Promise<User[]> {
		return await this.usersRepository.find({
			relations: {
				status: true,
				dni: true,
			},
		});
	}

	async findOne(id: number): Promise<User> {
		return await this.usersRepository.findOne({
			where: { id },
		});
	}

	async findOneByEmail(email: string): Promise<User> {
		return await this.usersRepository.findOne({
			where: { email },
		});
	}

	async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
		let user = await this.findOne(id);
		if (!user) throw new Error(`User with id: ${id}, not found`);
		const checkPassword = compareSync(updateUserInput.password, user.password);
		if (!checkPassword) throw new UnauthorizedException('Password incorrect');
		if (updateUserInput.newPassword) {
			const newPassword = hashSync(updateUserInput.newPassword, 10);
			user = await this.usersRepository.preload({
				...updateUserInput,
				id,
				password: newPassword,
			});
		} else {
			user = await this.usersRepository.preload({
				...updateUserInput,
				id,
				password: user.password,
			});
		}
		return await this.usersRepository.save(user);
	}

	async addDni(id: number, document: Dni): Promise<User> {
		const user = await this.findOne(id);
		if (!user) throw new Error(`User with id: ${id}, not found`);
		user.dni = document;
		return await this.usersRepository.save(user);
	}
}
