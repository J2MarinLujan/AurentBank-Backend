import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import * as process from 'process';
import { join } from 'path';
import { UsersModule } from './gql/users/users.module';
import { WalletsModule } from './gql/wallets/wallets.module';
import { TransactionsModule } from './gql/transactions/transactions.module';
import { CurrenciesModule } from './gql/currencies/currencies.module';
import { WalletsTypeModule } from './gql/types/wallets-type/wallets-type.module';
import { StatusModule } from './gql/status/status.module';
import { DniTypeModule } from './gql/types/dni-type/dni-type.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategies/jwt.Strategy';
import { dateScalar } from './scalars/date.scalar';
import { CountriesModule } from './gql/countries/countries.module';
import { DniModule } from './gql/dni/dni.module';

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			playground: false,
			plugins: [ApolloServerPluginLandingPageLocalDefault()],
			resolvers: {
				Date: dateScalar,
			},
		}),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: '1039625365',
			database: 'aurent-bank-db',
			entities: [__dirname + '/**/*.entity{.ts,.js}'],
			synchronize: true,
		}),
		UsersModule,
		WalletsModule,
		TransactionsModule,
		CurrenciesModule,
		WalletsTypeModule,
		StatusModule,
		DniTypeModule,
		AuthModule,
		DniModule,
		CountriesModule,
	],
	controllers: [AppController],
	providers: [AppService, JwtStrategy],
})
export class AppModule {}
