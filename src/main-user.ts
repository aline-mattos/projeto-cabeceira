import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user/user.module';

async function service() {
  const port = 3001
  const app = await NestFactory.create(UserModule)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`localhost:9092`],
      },
      consumer: {
        groupId: 'user-service-group',
      },
    },
  });

  await app.startAllMicroservices();
  app.listen(port, () => {
    console.log('User microservice is running with Kafka...');
  });
}

service();
