import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { DniType } from '../../types/dni-type/entities/dni-type.entity';
import { dateScalar } from '../../../scalars/date.scalar';
import { User } from '../../users/entities/user.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Status } from '../../status/entities/status.entity';
import { Country } from '../../countries/entities/country.entity';

@Entity()
@ObjectType()
export class Dni {
	@PrimaryGeneratedColumn()
	@Field(() => ID)
	id: number;

	@Column({ unique: true, type: 'int' })
	@Field(() => Int)
	number: number;

	@Column({ type: 'date', name: 'expedition_date' })
	@Field(() => dateScalar)
	expeditionDate: Date;

	@Column({ type: 'int' })
	@Field(() => Int)
	nationalityId: number;

	@ManyToOne(() => Country, (country) => country.documents, { eager: true })
	@Field(() => Country)
	nationality: Country;

	@Column({ type: 'varchar', name: 'expedition_place' })
	@Field(() => String)
	expeditionPlace: string;

	@Column({ type: 'date', name: 'expires_on', default: null })
	@Field(() => dateScalar, { nullable: true })
	expiresOn?: Date;

	@Column({
		type: 'datetime',
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@Field()
	createdAt: Date;

	@Column({ type: 'int' })
	@Field(() => Int)
	typeId: number;

	@Column({ type: 'date' })
	@Field(() => dateScalar)
	birth: Date;

	@ManyToOne(() => DniType, (dniType) => dniType.documents, { eager: true })
	@Field(() => DniType)
	type: DniType;

	@Column({ type: 'int', default: 1 })
	@Field(() => Int)
	statusId: number;

	@ManyToOne(() => Status, (status) => status.documents, { eager: true })
	@Field(() => Status)
	status: Status;

	@Column({ unique: true, type: 'int' })
	@Field(() => Int)
	userId: number;

	@OneToOne(() => User, (user) => user.dni)
	@Field(() => User)
	user: User;

	@OneToMany(() => Wallet, (wallet) => wallet.dni, { nullable: true })
	@Field(() => [Wallet], { nullable: true })
	wallets?: Wallet[];
}
