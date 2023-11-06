import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Currency } from '../../currencies/entities/currency.entity';
import { Country } from '../../countries/entities/country.entity';
import { Dni } from '../../dni/entities/dni.entity';

@Entity()
@ObjectType()
export class Status {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column({ type: 'varchar' })
	@Field(() => String)
	name: string;

	@OneToMany(() => User, (user) => user.status)
	@Field(() => [User], { nullable: true })
	users?: User[];

	@OneToMany(() => Wallet, (wallet) => wallet.status)
	@Field(() => [Wallet], { nullable: true })
	wallets?: Wallet[];

	@OneToMany(() => Dni, (dni) => dni.status)
	@Field(() => [Dni], { nullable: true })
	documents?: Dni[];

	@OneToMany(() => Currency, (currency) => currency.status)
	@Field(() => [Currency], { nullable: true })
	currencies?: Currency[];

	@OneToMany(() => Country, (country) => country.status)
	@Field(() => [Country], { nullable: true })
	countries?: Country[];
}
