import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBModule } from '../../shared/mongodb.module';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingRepo } from './rating.repo';
import { Rating, RatingSchema } from '../../shared/schemas/rating.schema';
import { User, UserSchema } from '../../shared/schemas/user.schema';
import { Book, BookSchema } from '../../shared/schemas/book.schema';
import { EventService } from '../../shared/event.service';

@Module({
  imports: [
    MongoDBModule,
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: Book.name, schema: BookSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RatingController],
  providers: [EventService, RatingService, RatingRepo],
  exports: [RatingService],
})
export class RatingModule {}
