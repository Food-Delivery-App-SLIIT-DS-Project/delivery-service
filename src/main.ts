import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DELIVERY_PACKAGE_NAME } from './types';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  // Load environment variables
  void ConfigModule.forRoot({
    isGlobal: true,
  });
  const app = await NestFactory.create(AppModule);
  const url = process.env.DELIVERY_SERVICE_URL || 'localhost:50053';
  const protoPath =
    process.env.GRPC_PROTO_PATH || join(__dirname, '../proto/delivery.proto');

  //  gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath: protoPath,
      package: DELIVERY_PACKAGE_NAME,
      url: url,
    },
  });
  // Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
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
