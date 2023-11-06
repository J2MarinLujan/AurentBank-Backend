import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as moment from 'moment-timezone';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('i-bank/api');
	app.useGlobalPipes(new ValidationPipe());
	// app.enableCors({ origin: 'http://localhost:3001' });
	moment.tz.setDefault('America/Bogota');
	await app.listen(3000);
}
bootstrap();
