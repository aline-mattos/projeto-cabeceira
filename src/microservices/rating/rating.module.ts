import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBModule } from '../../shared/modules/mongodb.module';
import { EventModule } from '../../shared/modules/event.module';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingRepo } from './rating.repo';
import { Rating, RatingSchema } from '../../shared/schemas/rating.schema';
import { BookModule } from '../book/book.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongoDBModule,
    EventModule,
    BookModule,
    UserModule,
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
  ],
  controllers: [RatingController],
  providers: [RatingService, RatingRepo],
  exports: [RatingService],
})
export class RatingModule {}
