import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import {
	BeforeInsert,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Currency } from '../../currencies/entities/currency.entity';
import { Status } from '../../status/entities/status.entity';
import { WalletsType } from '../../types/wallets-type/entities/wallets-type.entity';
import { Dni } from '../../dni/entities/dni.entity';

@Entity()
@ObjectType()
export class Wallet {
	@PrimaryGeneratedColumn()
	@Field(() => ID)
	id: number;

	@Column({ type: 'varchar', length: 16 })
	@Field(() => String)
	number: string;

	@Column({
		type: 'int',
		name: 'security_code',
		default: Math.floor(Math.random() * 999),
	})
	@Field(() => Int)
	securityCode: number;

	@Column('decimal', { precision: 10, scale: 2, default: 0 })
	@Field(() => Float)
	balance: number;

	@Column({
		type: 'datetime',
		name: 'expires_on',
	})
	@Field(() => Date)
	expiresOn: Date;

	@Column({
		type: 'datetime',
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@Field()
	createdAt: Date;

	@Column({ type: 'int' })
	@Field(() => Int)
	dniId: number;

	@ManyToOne(() => Dni, (dni) => dni.wallets, { eager: true })
	@Field(() => Dni)
	dni: Dni;

	@Column({ type: 'int' })
	@Field(() => Int)
	currencyId: number;

	@ManyToOne(() => Currency, (currency) => currency.wallets, { eager: true })
	@Field(() => Currency)
	currency: Currency;

	@Column({ type: 'varchar', default: 1 })
	@Field(() => Int)
	statusId: number;

	@ManyToOne(() => Status, (status) => status.users, { eager: true })
	@Field(() => Status)
	status: Status;

	@Column({ type: 'int' })
	@Field(() => Int)
	typeId: number;

	@ManyToOne(() => WalletsType, (walletType) => walletType.wallets, {
		eager: true,
	})
	@Field(() => WalletsType)
	type: WalletsType;

	@OneToMany(() => Transaction, (transaction) => transaction.walletFrom)
	@Field(() => [Transaction], { nullable: true })
	withdrawals?: Transaction[];

	@OneToMany(() => Transaction, (transaction) => transaction.walletTo)
	@Field(() => [Transaction], { nullable: true })
	deposits?: Transaction[];

	@BeforeInsert()
	async generateNumberSecurityCodeAndExpiresOn() {
		// Generar un número simulado de tarjeta real (por ejemplo, un número aleatorio de 16 dígitos)
		this.number = Math.floor(
			1000000000 + Math.random() * 9000000000
		).toString();

		// Establecer la fecha de vencimiento en 5 años a partir de la fecha actual
		const now = new Date();
		this.expiresOn = new Date(
			now.getFullYear() + 5,
			now.getMonth(),
			now.getDate()
		);
	}
}
