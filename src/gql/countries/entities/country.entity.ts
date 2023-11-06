import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Currency } from '../../currencies/entities/currency.entity';
import { Status } from '../../status/entities/status.entity';
import { Dni } from '../../dni/entities/dni.entity';

@Entity()
@ObjectType()
export class Country {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column({ type: 'varchar', unique: true })
	@Field(() => String)
	name: string;

	@Column({ type: 'varchar', name: 'code_iso_main', unique: true })
	@Field(() => String)
	isoCodeMain: string;

	@Column({ type: 'varchar', name: 'code_iso_second', unique: true })
	@Field(() => String)
	isoCodeSecond: string;

	@Column({ type: 'varchar', unique: true })
	@Field(() => String)
	code: string;

	@Column({ type: 'int', default: 1 })
	@Field(() => Int)
	statusId: number;

	@ManyToOne(() => Status, (status) => status.countries, {
		eager: true,
	})
	@Field(() => Status)
	status: Status;

	@ManyToMany(() => Currency, (currency) => currency.countries, {
		eager: true,
		cascade: true,
	})
	@JoinTable({ name: 'countries_currencies' })
	@Field(() => [Currency])
	currencies: Currency[];

	@OneToMany(() => Dni, (dni) => dni.nationality)
	@Field(() => [Dni])
	documents: Dni[];
}
