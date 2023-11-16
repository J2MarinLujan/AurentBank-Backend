import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../../status/entities/status.entity';
import { ValidRoles } from '../../../common/enums/valid-roles.enum';

@Entity()
@ObjectType()
export class Admin {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column({ type: 'varchar' })
	@Field(() => String)
	username: string;

	@Column({ type: 'varchar' })
	@Field(() => String)
	password: string;

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

	@Column({ type: 'int', default: 1 })
	@Field(() => Int)
	statusId: number;

	@ManyToOne(() => Status, (status) => status.users, {
		eager: true,
	})
	@Field(() => Status)
	status: Status;

	@Column({ type: 'enum', enum: ValidRoles, default: ValidRoles.admin })
	@Field(() => ValidRoles)
	role: ValidRoles;
}
