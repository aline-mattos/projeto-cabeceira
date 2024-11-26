import { Injectable } from '@nestjs/common';
import { BookshelfRepo } from './bookshelf.repo';
import { UpsertBookshelfDTO } from './dto/upsert-bookshelf.dto';
import { Bookshelf } from '../../shared/schemas/bookshelf.schema';
import { EventService } from '../../shared/event.service';
import { APIGateway } from '../../shared/gateway/api_gateway';
import { Types } from 'mongoose';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class BookshelfService {
  constructor(
    private readonly repo: BookshelfRepo,
    private readonly eventService: EventService,
  ) {}

  async upsert(dto: UpsertBookshelfDTO, auth: string): Promise<Bookshelf | undefined> {
    const user = await APIGateway.user.authorize(auth);

    if (!user) {
      console.log(`[I] BookshelfService.upsert(${JSON.stringify(user)}): Unauthorized!`);
      return undefined
    }

    const book = await APIGateway.book.getBookById(auth, dto.bookId)

    if (!book) {
      console.log(`[I] BookshelfService.upsert(${JSON.stringify(book)}): Book not found!`);
      return undefined
    }

    const result = await this.repo.upsert(
      user._id.toString(), 
      {
        book: new Types.ObjectId(book._id),
        status: dto.status,
      }
    );

    if (result.error)  console.log(`[E] BookshelfService.upsert: ${result.error}`); 
    else console.log(`[I] BookshelfService.upsert: Successfully updated bookshelf`);

    return result.data;
  }

  async updateStatus(dto: UpsertBookshelfDTO, auth: string): Promise<Bookshelf | undefined> {
    const user = await APIGateway.user.authorize(auth);

    if (!user) {
      console.log(`[I] BookshelfService.updateStatus(${JSON.stringify(user)}): Unauthorized!`);
      return undefined
    }

    const result = await this.repo.updateBookStatus(user._id.toString(), dto.bookId, dto.status);
  
    if (result.error) console.log(`[E] BookshelfService.updateStatus(${JSON.stringify(dto)}): ${result.error}`); 
    else console.log(`[I] BookshelfService.updateStatus(${JSON.stringify(dto)}): ${JSON.stringify(result.data)}`);
  
    return result.data;
  }

  async find(filter: Record<string, any>): Promise<Bookshelf | undefined> {
    const result = await this.repo.find(filter);
  
    if (result.error) console.log(`[E] BookshelfService.find(${JSON.stringify(filter)}): ${result.error}`); 
    else console.log(`[I] BookshelfService.find(${JSON.stringify(filter)}): ${JSON.stringify(result.data)}`);
  
    return result.data;
  }

  async removeBook(bookId: string, auth: string): Promise<Bookshelf | undefined> {
    const user = await APIGateway.user.authorize(auth);

    if (!user) {
      console.log(`[I] BookshelfService.deleteBook(${JSON.stringify(user)}): Unauthorized!`);
      return undefined
    }

    const result = await this.repo.deleteBook(user._id.toString(), bookId);

    if (result.error) console.log(`[E] BookshelfService.deleteBook(${bookId}): ${result.error}`); 
    else console.log(`[I] BookshelfService.deleteBook(${bookId}): ${JSON.stringify(result.data)}`);
  
    return result.data;
  }

  async removeBookFromAllUsers(bookId: string): Promise<{ modifiedCount: number }> {
    return this.repo.removeBookFromAllUsers(bookId);
  }

  async removeBookshelf(userId: string): Promise<{ deletedCount: number }> {
    return this.repo.removeBookshelf(userId);
  }
}
