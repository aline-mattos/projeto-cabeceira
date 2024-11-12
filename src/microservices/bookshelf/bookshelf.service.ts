import { Injectable } from '@nestjs/common';
import { BookshelfRepo } from './bookshelf.repo';
import { UpsertBookshelfDTO } from './dto/create-bookshelf.dto';
import { Book } from '../../shared/schemas/book.schema';
import { Bookshelf, BookState } from '../../shared/schemas/bookshelf.schema';
import { User } from '../../shared/schemas/user.schema';
import { EventService } from '../../shared/services/event.service';
import { UserService } from '../user/user.service';
import { BookService } from '../book/book.service';

@Injectable()
export class BookshelfService {
  constructor(
    private readonly repo: BookshelfRepo,
    private readonly userService: UserService,
    private readonly bookService: BookService,
    private readonly eventService: EventService,
  ) {}

  async addBook(dto: UpsertBookshelfDTO): Promise<Bookshelf | null> {
    
    const book = await this.bookService.find({ _id: dto.bookId});

    if (!book) {
      console.log("Livro não encontrado.")
      return null
    }

    const bookState : BookState = {
      status: dto.status,
      book
    };
    
    return null //this.repo.upsert(createBookshelfDto.userId, bookState);
  }

  async findBooks(userId: string): Promise<Bookshelf | null> {
    return await this.repo.findByUser(userId);
  }

  async removeBook(userId: string, bookId: string): Promise<Bookshelf | null> {
    return await this.repo.deleteBook(userId, bookId);
  }

  async updateBookStatus(userId: string, bookId: string, newStatus: string): Promise<Bookshelf | null> {
    return await this.repo.updateBookStatus(userId, bookId, newStatus);
  }
}
