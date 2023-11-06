import { Field, ObjectType } from '@nestjs/graphql';
import { Transaction } from '../entities/transaction.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
@ObjectType()
export class TransactionResponse {
	@Field(() => Wallet, { name: 'Sender' })
	walletFrom: Wallet;

	@Field(() => Wallet, { name: 'Recipient' })
	walletTo: Wallet;

	@Field(() => Transaction)
	transaction: Transaction;
}
