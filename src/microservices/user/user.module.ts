import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';
import { EventModule } from '../../shared/modules/event.module';
import { MongoDBModule } from '../../shared/modules/mongodb.module';
import { User, UserSchema } from '../../shared/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongoDBModule,
    EventModule,
    JwtModule.register({
      secret: '01932033-4251-73cb-b46d-66541e1c40b8',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepo],
  exports: [UserService],
})
export class UserModule {}
