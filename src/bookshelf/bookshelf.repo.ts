import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookshelf, BookshelfDocument, BookState } from './schemas/bookshelf.schema';

@Injectable()
export class BookshelfRepo {
  constructor(@InjectModel(Bookshelf.name) private model: Model<BookshelfDocument>) {}

  async upsert(userId: string, bookState: BookState): Promise<Bookshelf | null> {
    const session = await this.model.db.startSession();
    session.startTransaction();

    try {
      const bookshelf = await this.model
        .findOneAndUpdate(
          { user: userId, 'books.book': { $ne: bookState.book } },
          { $addToSet: { books: bookState } },
          { new: true, upsert: true, session }
        )
        .populate('user')
        .populate('books.book')
        .exec();

      await session.commitTransaction(); 
      return bookshelf;
    } catch (error) {
      await session.abortTransaction();
      console.log(`[E] BookshelfRepo.upsert(${userId}, ${bookState}): ${error}`);
      return null;
    } finally {
      session.endSession();
    }
  }

  async updateBookStatus(userId: string, bookId: string, newStatus: string): Promise<Bookshelf | null> {
    const session = await this.model.db.startSession();
    session.startTransaction();

    try {
      const bookshelf = await this.model
        .findOneAndUpdate(
          { user: userId, 'books.book': bookId },
          { $set: { 'books.$.status': newStatus } },
          { new: true, session }
        )
        .populate('user')
        .populate('books.book')
        .exec();

      await session.commitTransaction(); 
      return bookshelf;
    } catch (error) {
      await session.abortTransaction(); 
      console.log(`[E] BookshelfRepo.updateBookStatus(${userId}, ${bookId}, ${newStatus}): ${error}`);
      return null;
    } finally {
      session.endSession();
    }
  }

  async findByUser(userId: string): Promise<Bookshelf | null> {
    return this.model.findOne({ user: userId }).populate('user').populate('books.book').exec();
  }

  async deleteBook(userId: string, bookId: string): Promise<Bookshelf | null> {
    return this.model
      .findOneAndUpdate(
        { user: userId },
        { $pull: { books: { book: bookId } } },
        { new: true }
      )
      .populate('user')
      .populate('books.book')
      .exec();
  }
}
