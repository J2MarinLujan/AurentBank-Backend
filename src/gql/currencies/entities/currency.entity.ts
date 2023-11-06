import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Status } from '../../status/entities/status.entity';
import { Country } from '../../countries/entities/country.entity';

@Entity()
@ObjectType()
export class Currency {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column({ type: 'varchar' })
	@Field(() => String)
	name: string;

	@Column({ type: 'varchar', name: 'cod_iso' })
	@Field(() => String)
	codIso: string;

	@Column({ type: 'int', default: 1 })
	@Field(() => Int)
	statusId: number;

	@ManyToOne(() => Status, (status) => status.currencies, {
		eager: true,
	})
	@Field(() => Status)
	status: Status;

	@OneToMany(() => Wallet, (wallet) => wallet.currency)
	@Field(() => [Wallet], { nullable: true })
	wallets?: Wallet[];

	@ManyToMany(() => Country, (country) => country.currencies)
	// @JoinTable({ name: 'countries_currencies' })
	@Field(() => [Country], { nullable: true })
	countries?: Country[];
}
