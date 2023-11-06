import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Dni } from '../../../dni/entities/dni.entity';

@Entity()
@ObjectType()
export class DniType {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column({ type: 'varchar' })
	@Field(() => String)
	name: string;

	@Column({ type: 'varchar' })
	@Field(() => String)
	abbreviation: string;

	@OneToMany(() => Dni, (dni) => dni.type)
	@Field(() => [Dni], { nullable: true })
	documents?: Dni[];
}
