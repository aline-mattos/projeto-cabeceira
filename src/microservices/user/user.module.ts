import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';
import { EventModule } from '../../shared/modules/event.module';
import { MongoDBModule } from '../../shared/modules/mongodb.module';
import { User, UserSchema } from '../../shared/schemas/user.schema';

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
