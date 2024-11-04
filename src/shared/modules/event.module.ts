import { Module, Global } from '@nestjs/common';
import { KafkaModule } from './kafka.module';
import { EventService } from '../services/event.service';

@Global()
@Module({
  imports: [KafkaModule],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
