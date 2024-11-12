import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookshelf, BookshelfDocument, BookStatus } from '../../shared/schemas/bookshelf.schema';
import { ServiceResponse } from '../../shared/utils/ServiceResponse';

@Injectable()
export class BookshelfRepo {
  constructor(@InjectModel(Bookshelf.name) private model: Model<BookshelfDocument>) {}

  async upsert(userId: string, status: BookStatus): Promise<ServiceResponse<Bookshelf>> {
    try {
      const bookshelf = await this.model
        .findOneAndUpdate(
          { user: userId, 'books.book': { $ne: status.book } },
          { $addToSet: { statuses: status } },
          { new: true, upsert: true }
        )
        .populate('user')
        .populate('books.book')
        .exec();

      if (bookshelf) {
        return ServiceResponse.success(bookshelf);
      } else {
        return ServiceResponse.failure('Failed to upsert bookshelf');
      }
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }

  async updateBookStatus(userId: string, bookId: string, newStatus: string): Promise<ServiceResponse<Bookshelf>> {
    try {
      const bookshelf = await this.model
        .findOneAndUpdate(
          { user: userId, 'books.book': bookId },
          { $set: { 'books.$.status': newStatus } },
          { new: true }
        )
        .populate('user')
        .populate('books.book')
        .exec();

      if (bookshelf) {
        return ServiceResponse.success(bookshelf);
      } else {
        return ServiceResponse.failure('Failed to update book status');
      }
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }

  async find(filter: Record<string, any> = {}): Promise<ServiceResponse<Bookshelf>> {
    try {
      const bookshelf = await this.model
        .findOne(filter)
        .populate('user')
        .populate('books.book')
        .exec();

      if (bookshelf) {
        return ServiceResponse.success(bookshelf);
      } else {
        return ServiceResponse.failure('Bookshelf not found');
      }
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }

  async deleteBook(userId: string, bookId: string): Promise<ServiceResponse<Bookshelf>> {
    try {
      const bookshelf = await this.model
        .findOneAndUpdate(
          { user: userId },
          { $pull: { statuses: { book: bookId } } },
          { new: true }
        )
        .populate('user')
        .populate('books.book')
        .exec();

      if (bookshelf) {
        return ServiceResponse.success(bookshelf);
      } else {
        return ServiceResponse.failure("Failed to delete book from bookshelf");
      }
    } catch (error) {
      return ServiceResponse.failure(error);
    }
  }
}

