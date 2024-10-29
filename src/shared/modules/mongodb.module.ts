import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:password@localhost:27017', {
        dbName: 'cabeceira',
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDBModule {}