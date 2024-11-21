import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBModule } from '../../shared/modules/mongodb.module';
import { EventModule } from '../../shared/modules/event.module';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingRepo } from './rating.repo';
import { Rating, RatingSchema } from '../../shared/schemas/rating.schema';
import { User, UserSchema } from '../../shared/schemas/user.schema';
import { Book, BookSchema } from '../../shared/schemas/book.schema';

@Module({
  imports: [
    MongoDBModule,
    EventModule,
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: Book.name, schema: BookSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RatingController],
  providers: [RatingService, RatingRepo],
  exports: [RatingService],
})
export class RatingModule {}
