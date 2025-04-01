import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../delivery.proto'),
        package: 'delivery',
        url: 'localhost:50053',
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log('Delivery service is running on: http://localhost:50053');
}
void bootstrap();
