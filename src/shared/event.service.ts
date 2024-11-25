import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class EventService implements OnModuleInit, OnModuleDestroy {
  private clients: { [queue: string]: ClientProxy } = {};

  constructor() {
    // Create a ClientProxy for each microservice queue
    const queues = ['user_queue', 'book_queue', 'bookshelf_queue', 'rating_queue'];
    for (const queue of queues) {
      this.clients[queue] = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
          queue,
          queueOptions: { durable: true },
        },
      });
    }
  }

  async emit(event: string, message: any) {
    const promises = Object.values(this.clients).map(client =>
      client.emit(event, message).toPromise(),
    );
    await Promise.all(promises);
    console.log(`[I] Event "${event}" emitted to all queues.`);
  }

  async onModuleInit() {
    await Promise.all(
      Object.values(this.clients).map(client => client.connect()),
    );
    console.log('RabbitMQ clients connected.');
  }

  async onModuleDestroy() {
    await Promise.all(
      Object.values(this.clients).map(client => client.close()),
    );
    console.log('RabbitMQ clients disconnected.');
  }
}
