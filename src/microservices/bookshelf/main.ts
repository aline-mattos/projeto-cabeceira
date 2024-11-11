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
   * Kafka configuration
   */
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`kafka:9093`],
      },
      consumer: {
        groupId: 'bookshelf-service-group',
        sessionTimeout: 30000,
      },
    },
  });

  await app.startAllMicroservices();
  app.listen(port, () => {
    console.log('Bookshelf microservice is running with Kafka on port ' + port);
  });
}

service();
