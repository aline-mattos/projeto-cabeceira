import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookshelfController } from './bookshelf.controller';
import { BookshelfService } from './bookshelf.service';
import { BookshelfRepo } from './bookshelf.repo';
import { MongoDBModule } from '../../shared/modules/mongodb.module';
import { EventModule } from '../../shared/modules/event.module';
import { Bookshelf, BookshelfSchema } from '../../shared/schemas/bookshelf.schema';
import { BookModule } from '../book/book.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongoDBModule, 
    EventModule,
    BookModule,
    UserModule,
    MongooseModule.forFeature([{ name: Bookshelf.name, schema: BookshelfSchema }]),
  ],
  controllers: [BookshelfController],
  providers: [BookshelfService, BookshelfRepo],
  exports: [BookshelfService],
})
export class BookshelfModule {}
