import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class EventService implements OnModuleInit {
  constructor(@Inject('KAFKA_MODULE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async emit(topic: string, message: any) {
    await this.client.emit(topic, message);
  }
}
