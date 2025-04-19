import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DELIVERY_PACKAGE_NAME } from './types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../proto/delivery.proto'),
      package: DELIVERY_PACKAGE_NAME,
      url: 'localhost:50053',
    },
  });

  // Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'delivery-consumer',
      },
    },
  });

  app.enableShutdownHooks();

  // Start both transports
  await app.startAllMicroservices();
  console.log('✅ gRPC and Kafka microservices running on Delivery Service');
}
void bootstrap();
