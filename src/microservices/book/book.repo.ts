import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { Book, BookDocument } from '../../shared/schemas/book.schema';

@Injectable()
export class BookRepo {
  constructor(@InjectModel(Book.name) private model: Model<BookDocument>) {}

  async create(dto: CreateBookDto): Promise<Book | null> {
    try {
      const book = new this.model(dto);
      await book.save();
      return book;
    } catch (error) {
      console.log(`[E] BookRepo.create(${dto}): ${error}`);
      return null;
    }
  }

  async findAll(): Promise<Book[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Book | null> {
    return this.model.findById(new Types.ObjectId(id)).exec();
  }

  async delete(id: string): Promise<Book | null> {
    return this.model.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}
