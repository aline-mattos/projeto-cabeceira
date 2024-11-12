import { Injectable } from '@nestjs/common';
import { BookshelfRepo } from './bookshelf.repo';
import { UpsertBookshelfDTO } from './dto/upsert-bookshelf.dto';
import { Bookshelf } from '../../shared/schemas/bookshelf.schema';
import { User } from '../../shared/schemas/user.schema';
import { EventService } from '../../shared/services/event.service';
import { BookService } from '../book/book.service';

@Injectable()
export class BookshelfService {
  constructor(
    private readonly repo: BookshelfRepo,
    private readonly bookService: BookService,
    private readonly eventService: EventService,
  ) {}

  async upsert(dto: UpsertBookshelfDTO, user: User): Promise<Bookshelf | undefined> {
    const book = await this.bookService.find({ _id: dto.bookId })
    if (!book) {
      console.log(`[I] RatingService.upsert(${JSON.stringify(book)}): Book not found!`);
      return undefined
    }

    const result = await this.repo.upsert(
      user._id.toString(), 
      {
        book: book,
        status: dto.status,
      }
    );

    if (result.error)  console.log(`[E] BookshelfService.upsert: ${result.error}`); 
    else console.log(`[I] BookshelfService.upsert: Successfully updated bookshelf`);

    return result.data;
  }

  async updateStatus(dto: UpsertBookshelfDTO, user: User): Promise<Bookshelf | undefined> {
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

  async removeBook(bookId: string, user: User): Promise<Bookshelf | undefined> { 
    const result = await this.repo.deleteBook(user._id.toString(), bookId);

    if (result.error) console.log(`[E] BookshelfService.find(${bookId}): ${result.error}`); 
    else console.log(`[I] BookshelfService.find(${bookId}): ${JSON.stringify(result.data)}`);
  
    return result.data;
  }
}
