import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepo {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.model(createUserDto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.model.findById(new Types.ObjectId(id)).exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.model.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}
