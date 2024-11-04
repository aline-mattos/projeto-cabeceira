import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongoDBModule } from '../shared/modules/mongodb.module';
import { UserRepo } from './user.repo';
import { EventModule } from '../shared/modules/event.module';

@Module({
  imports: [
    MongoDBModule,
    EventModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepo],
  exports: [UserService],
})
export class UserModule {}
