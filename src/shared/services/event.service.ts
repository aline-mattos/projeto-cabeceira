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

  async requestReply<T>(topic: string, message: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.client
        .send(topic, message)
        .subscribe({
          next: (response: T) => resolve(response),
          error: (err) => reject(err),
        });
    });
  }
}
