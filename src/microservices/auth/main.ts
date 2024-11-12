import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function service() {
  const port = 3005
  const app = await NestFactory.create(AuthModule)

  /**
   * Setting up Swagger
   * http://localhost:3001/api
   */
  SwaggerModule.setup('api', app, 
    SwaggerModule.createDocument(app, 
      new DocumentBuilder()
      .setTitle('Auth Microservice API') 
      .setDescription('API documentation for the Auth Microservice') 
      .setVersion('1.0') 
      .addTag('auth')
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
        groupId: 'auth-service-group',
        sessionTimeout: 30000,
      },
    },
  });

  await app.startAllMicroservices();
  app.listen(port, () => {
    console.log('Auth microservice is running with Kafka...');
  });
}

service();
