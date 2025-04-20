import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: [
          join(__dirname, '../delivery.proto'),
          join(__dirname, '../vehicle.proto'),
        ],
        package: 'delivery',
        url: 'localhost:50053',
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableShutdownHooks();
  await app.listen();
  console.log('Delivery service is running on: http://localhost:50053');
}
void bootstrap();
