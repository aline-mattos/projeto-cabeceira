import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookModule } from './book/book.module';

async function service() {
  const port = 3002;
  const app = await NestFactory.create(BookModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`localhost:9092`],
      },
      consumer: {
        groupId: 'book-service-group',
      },
    },
  });

  await app.startAllMicroservices();
  app.listen(port, () => {
    console.log('Book microservice is running with Kafka on port ' + port);
  });
}

service();
