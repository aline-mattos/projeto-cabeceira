import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { Book, BookDocument } from '../../shared/schemas/book.schema';

@Injectable()
export class BookRepo {
  constructor(@InjectModel(Book.name) private model: Model<BookDocument>) {}

  async create(createBookDto: CreateBookDto): Promise<Book | null> {
    const session = await this.model.db.startSession();
    session.startTransaction();
    
    try {
      const book = new this.model(createBookDto);
      await book.save({ session });
      await session.commitTransaction();
      return book;
    } catch (error) {
      await session.abortTransaction();
      console.log(`[E] BookRepo.create(${createBookDto}): ${error}`)
      return null
    } finally {
      session.endSession();
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
