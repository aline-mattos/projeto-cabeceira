import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating, RatingDocument } from '../../shared/schemas/rating.schema';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingRepo {
  constructor(@InjectModel(Rating.name) private model: Model<RatingDocument>) {}

  async create(dto: CreateRatingDto): Promise<Rating | null> {
    try {
      const rating = new this.model(dto);
      await rating.save();
      return rating;
    } catch (error) {
      console.log(`[E] RatingRepo.create(${dto}): ${error}`);
      return null;
    }
  }

  async findAll(): Promise<Rating[]> {
    return this.model.find().exec();
  }

  async findByUser(id: string): Promise<Rating[]> {
    return this.model.find().exec();
  }

  async findByBook(id: string): Promise<Rating[]> {
    return this.model.find().exec();
  }

  async delete(id: string): Promise<Rating | null> {
    return this.model.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}
