import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import * as crypto from 'crypto'; 

export interface KafkaResponse<T> {
  correlationId: string;
  data: T;
}

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
      const correlationId = crypto.randomBytes(16).toString('hex');
      const replyTo = `${topic}.reply`;

      // Subscribe to the reply topic dynamically
      this.client.subscribeToResponseOf(replyTo);

      // Send the request to the topic with the replyTo and correlationId
      this.client.send(topic, { ...message, replyTo, correlationId }).subscribe({
        next: (response: KafkaResponse<T> | null) => {
          if (response && response.correlationId === correlationId) {
            resolve(response.data);
          } else {
            reject(new Error('Invalid correlationId'));
          }
        },
        error: (err) => reject(err),
      });
    });
  }
}
