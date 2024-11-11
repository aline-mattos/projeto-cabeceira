import { Injectable } from '@nestjs/common';
import { BookshelfRepo } from './bookshelf.repo';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { Book } from '../../shared/schemas/book.schema';
import { Bookshelf, BookState } from '../../shared/schemas/bookshelf.schema';
import { User } from '../../shared/schemas/user.schema';
import { EventService } from '../../shared/services/event.service';

@Injectable()
export class BookshelfService {
  constructor(private readonly bookshelfRepo: BookshelfRepo, private readonly eventService: EventService) {}

  async addBook(createBookshelfDto: CreateBookshelfDto): Promise<Bookshelf | null> {
    
    const user = await this.retrieveUserIfExists(createBookshelfDto.userId);
  
    if (!user) {
      console.log("Usuário não encontrado.");
      return null;
    }

    const book = await this.retrieveBookIfExists(createBookshelfDto.bookId);

    if (!book) {
      console.log("Livro não encontrado.")
      return null
    }

    const bookState : BookState = {
      status: createBookshelfDto.status,
      book
    };
    
    return this.bookshelfRepo.upsert(createBookshelfDto.userId, bookState);
  }

  async findBooks(userId: string): Promise<Bookshelf | null> {
    return await this.bookshelfRepo.findByUser(userId);
  }

  async removeBook(userId: string, bookId: string): Promise<Bookshelf | null> {
    return await this.bookshelfRepo.deleteBook(userId, bookId);
  }

  async updateBookStatus(userId: string, bookId: string, newStatus: string): Promise<Bookshelf | null> {
    return await this.bookshelfRepo.updateBookStatus(userId, bookId, newStatus);
  }

  private async retrieveBookIfExists(bookId: string): Promise<Book | null> {
    const message = { bookId };

    try {
      return await this.eventService.requestReply<Book | null>('book-existence-request', message);
    } catch (error) {
      console.log(`retrieveBookIfExists: ${error}`)
      return null
    }
  }

  private async retrieveUserIfExists(userId: string): Promise<User | null> {
    const message = { userId };

    try {
      return await this.eventService.requestReply<User | null>('user-existence-request', message);
    } catch (error) {
      console.log(`retrieveUserIfExists: ${error}`)
      return null
    }
  }
}