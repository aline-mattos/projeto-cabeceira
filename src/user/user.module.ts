import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongoDBModule } from '../shared/modules/mongodb.module';
import { UserRepo } from './user.repo';
import { EventService } from '../shared/services/event.service';
import { KafkaModule } from '../shared/modules/kafka.module';

@Module({
  imports: [
    MongoDBModule,
    KafkaModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepo, EventService],
  exports: [UserService],
})
export class UserModule {}
