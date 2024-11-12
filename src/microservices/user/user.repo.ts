import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../shared/schemas/user.schema';
import { ServiceResponse } from '../../shared/utils/ServiceResponse';

@Injectable()
export class UserRepo {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async upsert(data: User): Promise<ServiceResponse<User>> {
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

  async findById(id:string): Promise<ServiceResponse<User>> {
    try {
      const result = await this.model.findOne({ _id: new Types.ObjectId(id) }).exec();
  
      if (result) {
        return ServiceResponse.success(result);
      } else {
        return ServiceResponse.failure('Data not found!');
      }
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }

  async find(filter: Record<string, any>): Promise<ServiceResponse<User>> {
    try {
      const result = await this.model.findOne(filter).exec();
  
      if (result) {
        return ServiceResponse.success(result);
      } else {
        return ServiceResponse.failure('Data not found!');
      }
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }

  async findAll(): Promise<ServiceResponse<User[]>> {
    try {
      const result = await this.model.find().exec();

      if (result) {
        return ServiceResponse.success(result);
      } else {
        return ServiceResponse.failure('Data not found!');
      }
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }

  async delete(id: string): Promise<ServiceResponse<User>> {
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
}
