import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RatingModule } from './rating.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function service() {
  const port = 3004
  const app = await NestFactory.create(RatingModule)

  /**
   * Setting up Swagger
   * http://localhost:3004/api
   */
  SwaggerModule.setup('api', app, 
    SwaggerModule.createDocument(app, 
      new DocumentBuilder()
      .setTitle('Rating Microservice API') 
      .setDescription('API documentation for the Rating Microservice') 
      .setVersion('1.0') 
      .addTag('rating')
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
      queue: 'rating_queue',
      queueOptions: { durable: true },
      prefetchCount: 1,
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  app.listen(port, () => {
    console.log('Rating microservice is running with Kafka...');
  });
}

service();
