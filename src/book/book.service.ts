import { Injectable } from '@nestjs/common';
import { EventService } from '../shared/services/event.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './schemas/book.schema';
import { BookRepo } from './book.repo';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepo: BookRepo,
    private readonly eventService: EventService,
  ) {}

  @MessagePattern('book-existence-request')
  async checkIfBookExists(message: { bookId: string }) {
    const { bookId } = message;

    return await this.bookRepo.findOne(bookId)
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    console.log(`creating new book: ${JSON.stringify(createBookDto)}`);
    const book = await this.bookRepo.create(createBookDto);
    await this.eventService.emit('book.created', book);
    return book;
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepo.findAll();
  }

  async findOne(isbn: string): Promise<Book | null> {
    return this.bookRepo.findOne(isbn);
  }

  async delete(isbn: string): Promise<Book | null> {
    const book = await this.bookRepo.delete(isbn);

    console.log(`BookService: deleting ${isbn} - ${JSON.stringify(book)}`);

    await this.eventService.emit('book.deleted', book);
    return book;
  }
}
