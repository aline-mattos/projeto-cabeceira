import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating, RatingDocument } from '../../shared/schemas/rating.schema';
import { ServiceResponse } from '../../shared/utils/ServiceResponse';

@Injectable()
export class RatingRepo {
  constructor(@InjectModel(Rating.name) private model: Model<RatingDocument>) {}

  async upsert(data: Rating): Promise<ServiceResponse<Rating>> {
    try {
      return ServiceResponse.success(
        await this.model.findOneAndUpdate(
          { _id: data._id || new Types.ObjectId() }, 
          { $set: data }, 
          { new: true, upsert: true }
        )
      );
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }

  async find(filter: Record<string, any>): Promise<ServiceResponse<Rating[]>> {
    try {
      const result = await this.model.find(filter).exec();
  
      if (result) {
        return ServiceResponse.success(result);
      } else {
        return ServiceResponse.failure('Data not found!');
      }
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }

  async delete(id: string): Promise<ServiceResponse<Rating>> {
    try {
      const result = await this.model.findByIdAndDelete(new Types.ObjectId(id)).exec();

      if (result) {
        return ServiceResponse.success(result);
      } else {
        return ServiceResponse.failure("Data couldn't be deleted!");
      }
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }

  async deleteMany(filter: Record<string, any>): Promise<ServiceResponse<any>> {
    try {
      const result = await this.model.deleteMany(filter).exec();
      return ServiceResponse.success(result);
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }
  
}
