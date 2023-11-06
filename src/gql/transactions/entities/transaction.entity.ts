import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';

@Entity()
@ObjectType()
export class Transaction {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column('decimal', { precision: 9, scale: 2 })
	@Field(() => Float)
	amount: number;

	@Column({ type: 'varchar' })
	@Field(() => String)
	description: string;

	@Column({
		type: 'datetime',
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@Field()
	createdAt: Date;

	@Column({ type: 'int' })
	@Field(() => ID)
	walletFromId: number;

	@ManyToOne(() => Wallet, (wallet) => wallet.withdrawals, { eager: true })
	@Field(() => Wallet)
	walletFrom: Wallet;

	@Column({ type: 'int' })
	@Field(() => ID)
	walletToId: number;

	@ManyToOne(() => Wallet, (wallet) => wallet.deposits, { eager: true })
	@Field(() => Wallet)
	walletTo: Wallet;
}
