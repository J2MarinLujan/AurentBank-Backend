import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Wallet } from '../../../wallets/entities/wallet.entity';

@Entity()
@ObjectType()
export class WalletsType {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column({ type: 'varchar' })
	@Field(() => String)
	name: string;

	@OneToMany(() => Wallet, (wallet) => wallet.status)
	@Field(() => [Wallet], { nullable: true })
	wallets?: Wallet[];
}
