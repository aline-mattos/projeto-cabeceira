import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:password@localhost:27017', {
      dbName: 'cabeceiraDB',
    }),
    UserModule,
  ],
})
export class AppModule {}
