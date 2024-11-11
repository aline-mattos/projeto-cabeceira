import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { BookRepo } from './book.repo';
import { MessagePattern } from '@nestjs/microservices';
import { Book } from '../../shared/schemas/book.schema';
import { EventService, KafkaResponse } from '../../shared/services/event.service';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepo: BookRepo,
    private readonly eventService: EventService,
  ) {}

  @MessagePattern('book-existence-request')
  async checkIfBookExists(message: { bookId: string, correlationId: string }): Promise<KafkaResponse<Book | null>> {
    const { bookId, correlationId } = message;
  
    const book = await this.bookRepo.findOne(bookId);

    console.log(`[E] BookService.checkIfBookExists(${bookId}): ${JSON.stringify(book)}`);
  
    return { 
      correlationId,
      data: book || null
    };
  }

  async create(createBookDto: CreateBookDto): Promise<Book | null> {
    console.log(`creating new book: ${JSON.stringify(createBookDto)}`);
    return await this.bookRepo.create(createBookDto);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepo.findAll();
  }

  async findOne(id: string): Promise<Book | null> {
    return await this.bookRepo.findOne(id);
  }

  async delete(id: string): Promise<Book | null> {
    const book = await this.bookRepo.delete(id);

    console.log(`BookService: deleting ${id} - ${JSON.stringify(book)}`);

    return book;
  }
}
