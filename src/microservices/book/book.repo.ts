import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from '../../shared/schemas/book.schema';
import { ServiceResponse } from '../../shared/utils/ServiceResponse';

@Injectable()
export class BookRepo {
  constructor(@InjectModel(Book.name) private model: Model<BookDocument>) {}

  async upsert(data: Book): Promise<ServiceResponse<Book>> {
    try {
      const result = await this.model.findOneAndUpdate(
        { _id: data._id }, 
        { $set: data }, 
        { new: true, upsert: true }
      );
      return ServiceResponse.success(result);
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }

  async find(filter: Record<string, any>): Promise<ServiceResponse<Book>> {
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

  async findAll(): Promise<ServiceResponse<Book[]>> {
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

  async delete(id: string): Promise<ServiceResponse<Book>> {
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
