import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookshelfController } from './bookshelf.controller';
import { BookshelfService } from './bookshelf.service';
import { BookshelfRepo } from './bookshelf.repo';
import { MongoDBModule } from '../../shared/mongodb.module';
import { Bookshelf, BookshelfSchema } from '../../shared/schemas/bookshelf.schema';
import { User, UserSchema } from '../../shared/schemas/user.schema';
import { Book, BookSchema } from '../../shared/schemas/book.schema';
import { EventService } from '../../shared/event.service';

@Module({
  imports: [
    MongoDBModule, 
    MongooseModule.forFeature([
      { name: Bookshelf.name, schema: BookshelfSchema },
      { name: Book.name, schema: BookSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BookshelfController],
  providers: [EventService, BookshelfService, BookshelfRepo],
  exports: [BookshelfService],
})
export class BookshelfModule {}
