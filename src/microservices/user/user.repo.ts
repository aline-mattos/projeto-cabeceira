import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegistrationDTO } from './dto/registration.dto';
import { User, UserDocument } from '../../shared/schemas/user.schema';

@Injectable()
export class UserRepo {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async create(dto: RegistrationDTO): Promise<User | null> {
    try {
      const user = new this.model(dto);
      await user.save(); 
      return user;
    } catch (error) {
      console.log(`[E] UserRepo.create(${dto}): ${error}`);
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.model.findById(new Types.ObjectId(id)).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ email }).exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.model.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}
