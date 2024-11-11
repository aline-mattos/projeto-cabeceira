import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating, RatingDocument } from '../../shared/schemas/rating.schema';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingRepo {
  constructor(@InjectModel(Rating.name) private model: Model<RatingDocument>) {}

  async create(dto: CreateRatingDto): Promise<Rating | null> {
    const session = await this.model.db.startSession();
    session.startTransaction();
    
    try {
      const rating = new this.model(dto);
      await rating.save({ session });
      await session.commitTransaction();
      return rating;
    } catch (error) {
      await session.abortTransaction();
      console.log(`[E] RatingRepo.create(${dto}): ${error}`)
      return null
    } finally {
      session.endSession();
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
