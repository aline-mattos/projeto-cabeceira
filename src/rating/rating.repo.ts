import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating, RatingDocument } from './schemas/rating.schema';

@Injectable()
export class RatingRepo {
  constructor(@InjectModel(Rating.name) private ratingModel: Model<RatingDocument>) {}

  async create(createRatingDto: Partial<Rating>): Promise<Rating> {
    const rating = new this.ratingModel(createRatingDto);
    return rating.save();
  }

}
