import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepo } from './book.repo';
import { MongoDBModule } from '../../shared/modules/mongodb.module';
import { EventModule } from '../../shared/modules/event.module';
import { Book, BookSchema } from '../../shared/schemas/book.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongoDBModule,
    EventModule,
    UserModule,
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService, BookRepo],
  exports: [BookService],
})
export class BookModule {}
