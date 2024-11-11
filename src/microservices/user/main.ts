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
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`kafka:9093`],
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
