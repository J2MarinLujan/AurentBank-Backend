import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from '../../status/entities/status.entity';
import { ValidRoles } from '../../../common/enums/valid-roles.enum';
import { Dni } from '../../dni/entities/dni.entity';

@Entity()
@ObjectType()
export class User {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column({ type: 'varchar', name: 'first_name' })
	@Field(() => String, { nullable: true })
	firstName: string;

	@Column({ type: 'varchar', name: 'second_name', default: '' })
	@Field(() => String)
	secondName?: string;

	@Column({ type: 'varchar', name: 'first_surname' })
	@Field(() => String)
	firstSurname: string;

	@Column({ type: 'varchar', name: 'second_surname', default: '' })
	@Field(() => String, { nullable: true })
	secondSurname?: string;

	@Column({ unique: true, type: 'varchar' })
	@Field(() => String)
	email: string;

	@Column({ type: 'varchar' })
	@Field(() => String)
	password: string;

	@Column({ type: 'char', length: 10 })
	@Field(() => String)
	phone: string;

	@Column({ type: 'varchar', length: 5, name: 'country_code' })
	@Field(() => String)
	countryCode: string;

	@Column({
		type: 'datetime',
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@Field()
	createdAt: Date;

	@Column({ unique: true, type: 'int', default: null })
	@Field(() => Int, { nullable: true })
	dniId?: number;

	@OneToOne(() => Dni, (dni) => dni.user)
	@JoinColumn()
	@Field(() => Dni, { nullable: true })
	dni?: Dni;

	@Column({ type: 'int', default: 1 })
	@Field(() => Int)
	statusId: number;

	@ManyToOne(() => Status, (status) => status.users, {
		eager: true,
	})
	@Field(() => Status)
	status: Status;

	@Column({ type: 'enum', enum: ValidRoles, default: ValidRoles.user })
	@Field(() => ValidRoles)
	role: ValidRoles;
}
