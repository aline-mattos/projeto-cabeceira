import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookshelfController } from './bookshelf.controller';
import { BookshelfService } from './bookshelf.service';
import { Bookshelf, BookshelfSchema } from './schemas/bookshelf.schema';
import { MongoDBModule } from '../shared/modules/mongodb.module';
import { BookshelfRepo } from './bookshelf.repo';
import { EventModule } from '../shared/modules/event.module';

@Module({
  imports: [
    MongoDBModule, 
    EventModule,
    MongooseModule.forFeature([{ name: Bookshelf.name, schema: BookshelfSchema }]),
  ],
  controllers: [BookshelfController],
  providers: [BookshelfService, BookshelfRepo],
  exports: [BookshelfService],
})
export class BookshelfModule {}
