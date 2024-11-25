import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function service() {
  const port = 3001
  const app = await NestFactory.create(UserModule)

  /**
   * Setting up Swagger
   * http://localhost:3001/api
   */
  SwaggerModule.setup('api', app, 
    SwaggerModule.createDocument(app, 
      new DocumentBuilder()
      .setTitle('User Microservice API') 
      .setDescription('API documentation for the User Microservice') 
      .setVersion('1.0')
      .addTag('user')
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
      queue: 'user_queue',
      queueOptions: { durable: true },
      prefetchCount: 1,
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  app.listen(port, () => {
    console.log('User microservice is running with Kafka...');
  });
}

service();
