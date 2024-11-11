import { Injectable } from '@nestjs/common';
import { RatingRepo } from './rating.repo';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './schemas/rating.schema';

@Injectable()
export class RatingService {
  constructor(
    private readonly ratingRepo: RatingRepo,
  ) {}

}
