import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookshelfModule } from './bookshelf.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function service() {
  const port = 3003;
  const app = await NestFactory.create(BookshelfModule);

  /**
   * Setting up Swagger
   * http://localhost:3003/api
   */
  SwaggerModule.setup('api', app, 
    SwaggerModule.createDocument(app, 
      new DocumentBuilder()
      .setTitle('Bookshelf Microservice API') 
      .setDescription('API documentation for the Bookshelf Microservice') 
      .setVersion('1.0') 
      .addTag('bookshelf')
      .build()
    )
  );
  
  /**
   * RabbitMQ configuration
   */
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
      queue: 'bookshelf_queue',
      queueOptions: { durable: true },
      prefetchCount: 1,
      noAck: false,
    },
  });

  await app.startAllMicroservices();

  app.listen(port, () => {
    console.log('Bookshelf microservice is running with Kafka on port ' + port);
  });
}

service();
