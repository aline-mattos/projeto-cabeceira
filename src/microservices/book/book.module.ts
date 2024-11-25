import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepo } from './book.repo';
import { MongoDBModule } from '../../shared/mongodb.module';
import { Book, BookSchema } from '../../shared/schemas/book.schema';
import { EventService } from '../../shared/event.service';

@Module({
  imports: [
    MongoDBModule,
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [EventService, BookService, BookRepo],
  exports: [BookService],
})
export class BookModule {}
