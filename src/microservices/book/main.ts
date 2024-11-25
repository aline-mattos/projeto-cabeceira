import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookModule } from './book.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function service() {
  const port = 3002;
  const app = await NestFactory.create(BookModule);

  /**
   * Setting up Swagger
   * http://localhost:3002/api
   */
  SwaggerModule.setup('api', app, 
    SwaggerModule.createDocument(app, 
      new DocumentBuilder()
      .setTitle('Book Microservice API') 
      .setDescription('API documentation for the Book Microservice') 
      .setVersion('1.0') 
      .addTag('book')
      .build()
    )
  );
  
  /**
   * Kafka configuration
   */
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
      queue: 'book_queue',
      queueOptions: { durable: true },
      prefetchCount: 1,
      noAck: false,
    },
  });

  await app.startAllMicroservices();

  app.listen(port, () => {
    console.log('Book microservice is running with Kafka on port ' + port);
  });
}

service();
