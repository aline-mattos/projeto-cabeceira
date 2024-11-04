import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book, BookSchema } from './schemas/book.schema';
import { MongoDBModule } from '../shared/modules/mongodb.module';
import { BookRepo } from './book.repo';
import { EventModule } from '../shared/modules/event.module';

@Module({
  imports: [
    MongoDBModule,
    EventModule,
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService, BookRepo],
  exports: [BookService],
})
export class BookModule {}
