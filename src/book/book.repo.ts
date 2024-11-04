import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BookRepo {
  constructor(@InjectModel(Book.name) private model: Model<BookDocument>) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = new this.model(createBookDto);
    return book.save();
  }

  async findAll(): Promise<Book[]> {
    return this.model.find().exec();
  }

  async findOne(isbn: string): Promise<Book | null> {
    return this.model.findOne({ ISBN: isbn }).exec();
  }

  async delete(isbn: string): Promise<Book | null> {
    return this.model.findOneAndDelete({ ISBN: isbn }).exec();
  }
}
